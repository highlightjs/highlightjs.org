import * as fs from 'fs';
import * as path from 'path';

import hljs from 'highlight.js';
import { useEffect, useState } from 'react';

import { HTMLTagsExample } from '../components/cdn-block';
import { CodeBlock } from '../components/codeblock';
import { LightBackground } from '../components/lightbackground';
import { Markdown } from '../components/markdown';
import themes from '../data/themes.json';
import { MainLayout } from '../layouts/main';

const SNIPPETS_DIR = path.resolve(process.cwd(), 'data', 'snippets');
const THEME_COUNT = themes.length;
const LANG_COUNT = hljs.listLanguages().length;

const GH_API = 'https://api.github.com/repos/highlightjs/highlight.js/releases';
const SNIPPETS = [
  'bash',
  'clojure',
  'coffeescript',
  'cpp',
  'csharp',
  'css',
  'elm',
  'go',
  'handlebars',
  'http',
  'ini',
  'java',
  'javascript',
  'json',
  'makefile',
  'objectivec',
  'prolog',
  'python',
  'ruby',
  'rust',
  'sql',
  'swift',
  'typescript',
  'xml',
];

interface Props {
  languages: string[];
  latestVersion: string;
  snippets: Record<string, string>;
}

function randInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export async function getStaticProps() {
  // Load our sample code snippets
  const snippets = {};

  SNIPPETS.forEach((language) => {
    const filePath = path.resolve(SNIPPETS_DIR, `${language}.txt`);
    snippets[language] = fs.readFileSync(filePath, 'utf-8');
  });

  // Load the latest version from GitHub
  let currRelease = 'Unknown';
  const ghResponse = await (await fetch(GH_API)).json();

  if (ghResponse.length >= 1) {
    currRelease = ghResponse[0].tag_name.replace('v', '');
  }

  return {
    props: {
      languages: Object.keys(snippets),
      latestVersion: currRelease,
      snippets,
    },
  };
}

const Home = ({ languages, latestVersion, snippets }: Props) => {
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
      <div className="lg:container">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <ul className="mb-8 pl-4 text-2xl list-disc md:columns-2 lg:columns-1">
              <li>
                {LANG_COUNT} languages and {THEME_COUNT} themes
              </li>
              <li>Automatic language detection</li>
              <li>Works with any HTML markup</li>
              <li>Zero dependencies</li>
              <li>Compatible with any JS framework</li>
              <li>Supports Node.js and Deno</li>
            </ul>
            <p className="text-xl">
              <strong>Current release:</strong> {latestVersion}
            </p>
          </div>
          <div className="mx-auto order-1 lg:order-2 w-full">
            <CodeBlock
              code={snippet}
              language={lang}
              className="max-h-[400px]"
            />
          </div>
        </div>
      </div>

      <LightBackground>
        <div className="lg:container">
          <h2 className="mb-10 font-bold text-2xl text-center">Trusted by</h2>

          <ul className="flex flex-col sm:flex-row align-items-center justify-center gap-8 mb-0 ml-0 text-center">
            <li>
              <img src="./stackoverflow.png" alt="Stackoverflow" />
            </li>
            <li>
              <img src="./discord.png" alt="Discord" />
            </li>
          </ul>
        </div>
      </LightBackground>

      <div className="lg:container py-10 lg:px-40">
        <Markdown
          body={`
            ## Usage {.font-bold .mb-6 .text-2xl .text-center #usage}

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

        <HTMLTagsExample className="my-4" version={latestVersion} />

        <Markdown
          body={`
            This will find and highlight code inside \`<pre><code>\` tags; it tries to detect the language
            automatically. If automatic detection does not work for you, you can specify the language in the class
            attribute:

            ~~~html
            <pre><code class="html">...</code></pre>
            ~~~
          `}
        />
      </div>
    </MainLayout>
  );
};

export default Home;
