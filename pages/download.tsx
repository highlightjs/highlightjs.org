import { StickyElement, StickyViewport } from '@allejo/react-position-sticky';
import { saveAs } from 'file-saver';
import hljs from 'highlight.js';
import { GetServerSideProps } from 'next';
import {
  FormEvent,
  SyntheticEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Alert, AlertTypes } from '../components/alert';
import { BlurredBackground } from '../components/blurredbackground';
import SearchableText from '../components/searchable-text';
import LANG_CATS from '../data/categories.json';
import { MainLayout } from '../layouts/main';
import { classList } from '../utilities/cssClasses';
import { removeFirst } from '../utilities/utilities';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // For backward compatability, redirect any POST requests made the `/download`
  // URL that was used by the Django version of this website; the new URL is a
  // Next.js API route.
  if (req.method === 'POST') {
    return {
      redirect: {
        permanent: false,
        destination: '/api/download',
      },
    };
  }

  return {
    props: {},
  };
};

interface PageContext {
  addLanguage: (lang: string) => void;
  delLanguage: (lang: string) => void;
  filter: string;
  selectedLanguages: string[];
  setFilter: (filter: string) => void;
}

const PageContext = createContext<PageContext>({
  addLanguage: () => {},
  delLanguage: () => {},
  filter: '',
  selectedLanguages: [],
  setFilter: () => {},
});

const LanguageList = () => {
  const { delLanguage, selectedLanguages } = useContext(PageContext);

  return (
    <div className="flex flex-col md:flex-row mt-3">
      <p
        id="language-list"
        className="font-weight-bold mb-2 mb-md-0 mr-2 whitespace-nowrap"
      >
        Selected Languages:
      </p>
      {selectedLanguages.length === 0 ? (
        <span>
          <em>None Selected</em>
        </span>
      ) : (
        <ul className="mb-0 pl-0 list-none" aria-describedby="language-list">
          {selectedLanguages.map((language) => (
            <li
              key={language}
              className="bg-cyan-300 rounded text-cyan-900 inline-block text-sm mb-1 mr-2 pt-0 px-2 pb-0.5"
            >
              {language}
              <button
                className="text-cyan-900 ml-2"
                onClick={() => delLanguage(language)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const BundlerControls = () => {
  const { filter, setFilter, selectedLanguages } = useContext(PageContext);

  const containerRef = useRef<HTMLDivElement>();
  const [height, setHeight] = useState(0);

  const handleFilterChange = (e: SyntheticEvent<HTMLInputElement>) => {
    setFilter(e.currentTarget.value);
  };

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    setHeight(containerRef.current.offsetHeight);
  }, [selectedLanguages]);

  return (
    <>
      <div
        className="hidden shadow-3xl fixed left-0 top-0 w-full bg-brand-grey transition-colors duration-200 motion-reduce:transition-none stuck:show"
        style={{ height: `${height}px` }}
      />
      <div className="relative py-4" ref={containerRef}>
        <div className="flex">
          <div className="flex-1">
            <label htmlFor="language-filter" className="sr-only">
              Search Languages
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Search languages..."
              onChange={handleFilterChange}
              value={filter}
            />
          </div>
          <div className="pl-4">
            <button type="submit" className="button">
              Download
            </button>
          </div>
        </div>
        <LanguageList />
      </div>
    </>
  );
};

interface LanguageCheckboxProps {
  language: string;
  onFilterResults: (language: string, matched: boolean) => void;
}

const LanguageCheckbox = ({
  language,
  onFilterResults,
}: LanguageCheckboxProps) => {
  const { addLanguage, delLanguage, filter, selectedLanguages } =
    useContext(PageContext);
  const isFilterActive = !!filter;

  const [matchFound, setMatchFound] = useState(false);
  const handleLanguageSelection = (event: SyntheticEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      addLanguage(language);
    } else {
      delLanguage(language);
    }
  };

  useEffect(() => onFilterResults(language, matchFound), [matchFound]);

  return (
    <label
      className={classList([
        'font-normal',
        'truncate',
        ['hidden', isFilterActive && !matchFound],
      ])}
      key={language}
    >
      <input
        type="checkbox"
        name="languages"
        className="mr-2"
        checked={selectedLanguages.indexOf(language) >= 0}
        onChange={handleLanguageSelection}
        value={language}
      />
      <SearchableText
        aliases={hljs.getLanguage(language)?.aliases}
        filter={filter}
        onMatch={setMatchFound}
        text={language}
      />
    </label>
  );
};

interface LanguageCategoryProps {
  category: string;
}

const LanguageCategory = ({ category }: LanguageCategoryProps) => {
  const [hasMatches, setHasMatches] = useState(false);
  const [langMatches, setLangMatches] = useState<Record<string, boolean>>({});
  const { filter } = useContext(PageContext);

  const isFilterActive = !!filter;

  const handleFilterResults = (lang: string, matched: boolean) => {
    setLangMatches((prevState) => ({
      ...prevState,
      [lang]: matched,
    }));
  };

  useEffect(() => {
    if (!isFilterActive) {
      return;
    }

    setHasMatches(Object.values(langMatches).some((v) => v === true));
  }, [langMatches]);

  return (
    <BlurredBackground
      className={classList([
        'mb-5',
        'p-6',
        ['hidden', isFilterActive && !hasMatches],
      ])}
    >
      <fieldset key={category}>
        <legend className="border-b pb-2 mb-6 w-full text-xl font-bold">
          {category}
        </legend>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {LANG_CATS[category].map((language) => (
            <LanguageCheckbox
              key={language}
              language={language}
              onFilterResults={handleFilterResults}
            />
          ))}
        </div>
      </fieldset>
    </BlurredBackground>
  );
};

const Download = () => {
  const [filter, setFilter] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const addLanguage = (language: string) => {
    const newLanguages = [...selectedLanguages, language];
    newLanguages.sort();

    setSelectedLanguages(newLanguages);
  };
  const delLanguage = (language: string) => {
    setSelectedLanguages(removeFirst(selectedLanguages, language));
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const languages = formData.getAll('languages');

    fetch('/api/download', {
      method: 'POST',
      body: JSON.stringify({
        api: 2,
        languages,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((response) => {
        const blob = new Blob([response], { type: 'application/json' });

        saveAs(blob, 'highlight.zip');
      });
  };

  return (
    <MainLayout
      title="Download a Custom Build"
      description="Download a bundle with only the languages you want, without needing to introduce a build system or package manager to your application."
    >
      <StickyViewport useBrowserViewport={true}>
        <PageContext.Provider
          value={{
            addLanguage,
            delLanguage,
            filter,
            selectedLanguages,
            setFilter,
          }}
        >
          <div className="container relative">
            <form className="relative" onSubmit={handleOnSubmit}>
              <StickyElement
                id="bundle-header"
                sentinels={{
                  top: { height: '1rem', top: '-1rem' },
                  bottom: { height: '50px' },
                }}
              >
                <section className="sticky top-0 z-10">
                  <BundlerControls />
                </section>
              </StickyElement>

              <Alert
                className="mb-6"
                type={AlertTypes.Note}
                title="Behavior Changes"
              >
                The design of the download bundle has changed and may be
                slightly different than what you're expecting. See{' '}
                <a href="https://github.com/highlightjs/highlightjs.org/pull/10">
                  PR #10
                </a>{' '}
                for more information.
              </Alert>

              <section>
                {Object.keys(LANG_CATS).map((category) => (
                  <LanguageCategory key={category} category={category} />
                ))}
              </section>
            </form>
          </div>
        </PageContext.Provider>
      </StickyViewport>
    </MainLayout>
  );
};

export default Download;
