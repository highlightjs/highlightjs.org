import * as fs from 'fs';
import * as path from 'path';

import { useEffect, useState } from 'react';

import { HTMLTagsExample } from '../components/cdn-block';
import { CodeBlock } from '../components/codeblock';
import { LightBackground } from '../components/lightbackground';
import { Markdown } from '../components/markdown';
import { MainLayout } from '../layouts/main';
import styles from '../styles/Home.module.scss';

const SNIPPETS_DIR = path.resolve(process.cwd(), 'snippets');

interface Props {
  languages: string[];
  snippets: Record<string, string>;
}

function randInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export async function getStaticProps() {
  const snippets = {};

  fs.readdirSync(SNIPPETS_DIR).forEach((filename) => {
    const language = filename.replace('.txt', '');
    const filePath = path.resolve(SNIPPETS_DIR, filename);

    snippets[language] = fs.readFileSync(filePath, 'utf-8');
  });

  return {
    props: {
      languages: Object.keys(snippets),
      snippets,
    },
  };
}

const Home = ({ languages, snippets }: Props) => {
  const [snipIndex, setSnipIndex] = useState(0);
  const [lang, setLang] = useState(languages[snipIndex]);
  const [snippet, setSnippet] = useState(snippets[lang]);

  const randomizeSnippet = () => setSnipIndex(randInt(languages.length));

  useEffect(randomizeSnippet, []);
  useEffect(() => {
    const language = languages[snipIndex];

    setLang(language);
    setSnippet(snippets[language]);
  }, [snipIndex]);

  return (
    <MainLayout>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 order-2 order-lg-1">
            <ul className={styles.sellingPoints}>
              <li>189 languages and 95 styles</li>
              <li>Automatic language detection</li>
              <li>Multi-language code highlighting</li>
              <li>Available for Node.js</li>
              <li>Works with any markup</li>
              <li>Compatible with any js framework</li>
            </ul>
            <p>
              <strong>Current release:</strong> v10.2.1
            </p>
          </div>
          <div className="col-sm-10 offset-sm-1 offset-lg-0 col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0">
            <CodeBlock code={snippet} language={lang} />
          </div>
        </div>
      </div>

      <LightBackground>
        <h2 className="mb-4 text-center">Trusted by</h2>

        <ul className={styles.trustedBy}>
          <li>
            <img src="./stackoverflow.png" alt="Stackoverflow" />
          </li>
          <li>
            <img src="./discord.png" alt="Discord" />
          </li>
          <li>
            <img src="./vscode.png" alt="Visual Studio Code" />
          </li>
        </ul>
      </LightBackground>

      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <Markdown
              body={`
                ## Usage {.text-center #usage}

                highlight.js can be used in different ways such using CDNs, hosting the bundle yourself, as a Vue
                plug-in, as ES6 modules, with Node.js, and web workers.

                See [our README on GitHub](https://github.com/highlightjs/highlight.js#getting-started) for more details.

                ### As a Module {#as-a-module}

                Highlight.js can be used on the server. The package with all supported languages can be installed from
                NPM or Yarn:

                ~~~bash
                npm install highlight.js
                # or
                yarn add highlight.js
                ~~~

                ### As HTML Tags {#as-html-tags}
              `}
            />

            <HTMLTagsExample className="my-4" version="10.6.0" />

            <Markdown
              body={`
                This will find and highlight code inside of \`<pre><code>\` tags; it tries to detect the language
                automatically. If automatic detection doesn’t work for you, you can specify the language in the class
                attribute:

                ~~~html
                <pre><code class="html">...</code></pre>
                ~~~
              `}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
