import { StickyElement, StickyViewport } from '@allejo/react-position-sticky';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';

import { MainLayout } from '../layouts/main';
import styles from '../styles/Download.module.scss';
import { removeFirst } from '../utilities/arrayUtils';
import { LANG_CATS } from '../utilities/constants';

interface LanguageListProps {
  languages: string[];
  onLanguageRemoval: (language: string) => void;
}

const LanguageList = ({ languages, onLanguageRemoval }: LanguageListProps) => (
  <div className="d-flex flex-column flex-md-row mt-3">
    <p id="language-list" className="font-weight-bold mb-2 mb-md-0 mr-2 ws-nowrap">
      Selected Languages:
    </p>
    {languages.length === 0 ? (
      <span>
        <em>None Selected</em>
      </span>
    ) : (
      <ul className={styles.selectedLanguages} aria-describedby="language-list">
        {languages.map((language) => (
          <li key={language} className={styles.selectedLanguage}>
            {language}
            <button onClick={() => onLanguageRemoval(language)}>&times;</button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

interface BundlerControlsProps {
  filter: string;
  includedLanguages: string[];
  onDownloadClick: () => void;
  onFilterChange: (filter: string) => void;
  onLanguageRemoval: (language: string) => void;
}

const BundlerControls = ({
  filter,
  includedLanguages,
  onDownloadClick,
  onFilterChange,
  onLanguageRemoval,
}: BundlerControlsProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const [height, setHeight] = useState(0);
  const handleInputOnChange = (e: SyntheticEvent<HTMLInputElement>) => {
    onFilterChange(e.currentTarget.value);
  };

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    setHeight(containerRef.current.offsetHeight);
  }, [includedLanguages]);

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
              onChange={handleInputOnChange}
              value={filter}
            />
          </div>
          <div className="pl-3">
            <button type="submit" className="button" onChange={onDownloadClick}>
              Download
            </button>
          </div>
        </div>
        <LanguageList
          languages={includedLanguages}
          onLanguageRemoval={onLanguageRemoval}
        />
      </div>
    </>
  );
};

const Download = () => {
  const [filter, setFilter] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const handleLanguageSelection = (event: SyntheticEvent<HTMLInputElement>) => {
    const lang = event.currentTarget.value;

    if (event.currentTarget.checked) {
      const newLanguages = [...selectedLanguages, lang];
      newLanguages.sort();

      setSelectedLanguages(newLanguages);
    } else {
      setSelectedLanguages(removeFirst(selectedLanguages, lang));
    }
  };
  const handleLanguageRemoval = (language: string) => {
    setSelectedLanguages(removeFirst(selectedLanguages, language));
  };

  return (
    <MainLayout>
      <StickyViewport useBrowserViewport={true}>
        <div className="container position-relative">
          <h1 className="lh-1">Download a Custom Build</h1>

          <form className="position-relative" method="POST">
            <StickyElement
              id="bundle-header"
              sentinels={{
                top: { height: '1rem', top: '-1rem' },
                bottom: { height: '50px' },
              }}
            >
              <section className={styles.bundleHeader}>
                <BundlerControls
                  filter={filter}
                  includedLanguages={selectedLanguages}
                  onDownloadClick={() => {}}
                  onFilterChange={setFilter}
                  onLanguageRemoval={handleLanguageRemoval}
                />
              </section>
            </StickyElement>

            <section className={styles.languagesContainer}>
              {Object.keys(LANG_CATS).map((category) => (
                <fieldset key={category}>
                  <legend>{category}</legend>

                  <div className="row">
                    {LANG_CATS[category].map((language) => (
                      <label className="col-6 col-md-3" key={language}>
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedLanguages.indexOf(language) >= 0}
                          onChange={handleLanguageSelection}
                          value={language}
                        />
                        <span>{language}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </section>
          </form>
        </div>
      </StickyViewport>
    </MainLayout>
  );
};

export default Download;
