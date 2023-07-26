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

import SearchableText from '../components/searchable-text';
import { MainLayout } from '../layouts/main';
import styles from '../styles/Download.module.scss';
import { LANG_CATS } from '../utilities/constants';
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
    <div className="d-flex flex-column flex-md-row mt-3">
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
        <ul
          className={styles.selectedLanguages}
          aria-describedby="language-list"
        >
          {selectedLanguages.map((language) => (
            <li key={language} className={styles.selectedLanguage}>
              {language}
              <button onClick={() => delLanguage(language)}>&times;</button>
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
        className={styles.bundleHeaderBackground}
        style={{ height: `${height}px` }}
      />
      <div className={styles.bundleHeaderBody} ref={containerRef}>
        <div className="d-flex">
          <div className="flex-grow-1">
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
          <div className="pl-3">
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
        'col-6',
        'col-md-3',
        ['d-none', isFilterActive && !matchFound],
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
    <fieldset
      key={category}
      className={isFilterActive && !hasMatches ? 'd-none' : ''}
    >
      <legend>{category}</legend>

      <div className="row">
        {LANG_CATS[category].map((language) => (
          <LanguageCheckbox
            key={language}
            language={language}
            onFilterResults={handleFilterResults}
          />
        ))}
      </div>
    </fieldset>
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
    <MainLayout>
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
            <h1 className="leading-tight">Download a Custom Build</h1>

            <form className="relative" onSubmit={handleOnSubmit}>
              <StickyElement
                id="bundle-header"
                sentinels={{
                  top: { height: '1rem', top: '-1rem' },
                  bottom: { height: '50px' },
                }}
              >
                <section className={styles.bundleHeader}>
                  <BundlerControls />
                </section>
              </StickyElement>

              <section className={styles.languagesContainer}>
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
