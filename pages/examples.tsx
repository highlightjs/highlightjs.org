import * as fs from 'fs';
import * as path from 'path';

import { SyntheticEvent, useState } from 'react';

import { CodeBlock } from '../components/codeblock';
import { ThemeSelector } from '../components/theme-selector';
import { MainLayout } from '../layouts/main';
import styles from '../styles/Examples.module.scss';
import { LANG_CATS } from '../utilities/constants';

const SNIPPETS_DIR = path.resolve(process.cwd(), 'data', 'snippets');
const SNIPPET_IGNORE = ['node-repl', 'sql_more'];

// This object will automatically be populated from data in `LANG_CATS`. Do not
// touch this object manually.
const __LANG_LOOKUP = {};
Object.keys(LANG_CATS).forEach((category) => {
  LANG_CATS[category].forEach((language) => {
    __LANG_LOOKUP[language] = category;
  });
});

interface Props {
  snippets: Record<string, string>;
  totalCount: number;
}

export async function getStaticProps() {
  const snippets = {};
  const snippetFiles = fs.readdirSync(SNIPPETS_DIR);

  snippetFiles.forEach((filenames) => {
    const language = filenames.replace('.txt', '');
    const filePath = path.resolve(SNIPPETS_DIR, filenames);

    if (SNIPPET_IGNORE.indexOf(language) >= 0) {
      return;
    }

    snippets[language] = fs.readFileSync(filePath, 'utf-8');
  });

  return {
    props: {
      snippets,
      totalCount: Object.keys(snippets).length,
    },
  };
}

const Examples = ({ snippets, totalCount }: Props) => {
  const [theme, setTheme] = useState('atom-one-dark');
  const [filter, setFilter] = useState('all');

  const handleRadio = (e: SyntheticEvent<HTMLSelectElement>) => {
    setFilter(e.currentTarget.value);
  };

  return (
    <MainLayout>
      <div className="container">
        <div className="md:grid grid-cols-4 gap-8">
          <div className="col-span-1 relative">
            <div className="sticky top-4">
              <h1 className="mb-3 text-3xl">Examples</h1>

              <div>
                <label htmlFor="language-category">Language Category</label>
                <select
                  id="language-category"
                  className="mb-4"
                  value={filter}
                  onChange={handleRadio}
                >
                  <option value="all">All ({totalCount})</option>
                  {Object.keys(LANG_CATS).map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category} ({LANG_CATS[category].length})
                    </option>
                  ))}
                </select>
              </div>

              <ThemeSelector
                className="mb-4"
                onChange={setTheme}
                value={theme}
              />
            </div>
          </div>

          <div className="col-span-3">
            <section className={styles[`show-${filter}`]}>
              {Object.keys(snippets).map((language) => (
                <div
                  key={language}
                  data-category={__LANG_LOOKUP[language]?.toLowerCase()}
                >
                  <CodeBlock
                    className="h-[400px] mb-6"
                    code={snippets[language]}
                    language={language}
                    theme={theme}
                  />
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Examples;
