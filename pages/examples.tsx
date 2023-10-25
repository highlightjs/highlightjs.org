import * as fs from 'fs';
import * as path from 'path';

import { SyntheticEvent, useState } from 'react';

import { CodeBlock } from '../components/codeblock';
import { ThemeSelector } from '../components/theme-selector';
import LANG_CATS from '../data/categories.json';
import { MainLayout } from '../layouts/main';

const SNIPPETS_DIR = path.resolve(process.cwd(), 'data', 'snippets');
const SNIPPET_IGNORE = ['node-repl', 'sql_more'];

// This object will automatically be populated from data in `LANG_CATS`. Do not
// touch this object manually.
const __LANG_LOOKUP: Record<string, string[]> = {};
Object.keys(LANG_CATS).forEach((category) => {
  LANG_CATS[category].forEach((language) => {
    if (!(language in __LANG_LOOKUP)) {
      __LANG_LOOKUP[language] = [];
    }

    __LANG_LOOKUP[language].push(category.toLowerCase());
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
    <MainLayout
      title="Examples"
      description="With support for ~200 languages and themes, see how every language looks like in every theme"
    >
      <div className="container">
        <div className="md:grid grid-cols-4 gap-8">
          <div className="col-span-1 relative">
            <div className="sticky top-4">
              <div>
                <label htmlFor="language-category" className="mb-2">
                  Language Category
                </label>
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
            <section>
              {Object.keys(snippets).map((language) => {
                const showAll = filter === 'all';
                const langInFilter = __LANG_LOOKUP[language]?.includes(filter);
                const display = showAll || langInFilter ? 'block' : 'none';

                return (
                  <div key={language} style={{ display }}>
                    <CodeBlock
                      className="h-[400px] mb-6"
                      code={snippets[language]}
                      language={language}
                      theme={theme}
                    />
                  </div>
                );
              })}
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Examples;
