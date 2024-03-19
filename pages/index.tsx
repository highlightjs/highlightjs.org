import * as fs from 'fs';
import * as path from 'path';

import hljs from 'highlight.js';
import Image from 'next/image';
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

const description = `The Internet's favorite JavaScript syntax highlighter supporting Node.js and the web.`;

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
    <MainLayout description={description}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <p className="mb-8 text-lg md:text-xl lg:text-2xl">{description}</p>
            <ul className="mb-8 pl-8 lg:pl-6 text-lg md:text-xl lg:text-2xl list-disc md:columns-2 lg:columns-1">
              <li>
                {LANG_COUNT} languages and {THEME_COUNT} themes
              </li>
              <li>Automatic language detection</li>
              <li>Works with any HTML markup</li>
              <li>Zero dependencies</li>
              <li>Compatible with any JS framework</li>
              <li>Supports Node.js and Deno</li>
            </ul>
            <p className="text-lg lg:text-xl">
              <strong>Current release:</strong> {latestVersion}
            </p>
          </div>
          <CodeBlock
            code={snippet}
            language={lang}
            className="h-[400px] order-1 lg:order-2"
          />
        </div>
      </div>

      <LightBackground>
        <h2 className="mb-6 md:mb-10 font-bold text-2xl text-center">
          Trusted by
        </h2>

        <ul className="flex flex-col sm:flex-row align-items-center justify-center gap-8 mb-0 ml-0 text-center">
          <li className="flex">
            <Image
              src="./stackoverflow.svg"
              alt="Stack Overflow"
              className="m-auto"
              height={50}
              width={256}
            />
          </li>
          <li className="flex">
            <Image
              src="./discord.svg"
              alt="Discord"
              className="m-auto"
              height={47}
              width={173}
            />
          </li>
        </ul>
      </LightBackground>

      <div className="container py-10 lg:px-40">
        <Markdown
          body={`
            ## Usage {.font-bold .mb-6 .text-2xl .text-center #usage}

            highlight.js can be used in different ways such using CDNs, hosting the bundle yourself, as a Vue
            plug-in, as ES6 modules, with Node.js, and web workers.

            See [our README on GitHub](https://github.com/highlightjs/highlight.js#getting-started) for more details.

            ### As a Module {#as-a-module}

            Highlight.js can be used with Node on the server. The first step is to install the package from
            [npm](https://www.npmjs.com/package/highlight.js):

            ~~~bash
            npm install highlight.js
            # or
            yarn add highlight.js
            ~~~

            Now, it's possible to use the library using either \`require\` or \`import\`. By default, when you import the
            main package, all ${LANG_COUNT} languages will be loaded automatically.

            ~~~js
            // Using require
            const hljs = require('highlight.js');

            // Using ES6 import syntax
            import hljs from 'highlight.js';
            ~~~

            However, importing all our languages will increase the size of your bundle. If you only need a few languages,
            you can import them individually:

            ~~~js
            // Using require
            const hljs = require('highlight.js/lib/core');

            // Load any languages you need
            hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
            ~~~

            ~~~js
            // Using ES6 import syntax
            import hljs from 'highlight.js/lib/core';
            import javascript from 'highlight.js/lib/languages/javascript';

            // Then register the languages you need
            hljs.registerLanguage('javascript', javascript);
            ~~~

            And finally, regardless of how you imported the library, you can highlight code with the \`highlight\` or
            \`highlightAuto\` functions:

            ~~~js
            const highlightedCode = hljs.highlight(
              '<span>Hello World!</span>',
              { language: 'xml' }
            ).value
            ~~~

            For more details, see [the "Importing the Library" section of our README](https://github.com/highlightjs/highlight.js#importing-the-library).

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
            <pre><code class="language-html">...</code></pre>
            ~~~
          `}
        />
      </div>
    </MainLayout>
  );
};

export default Home;
