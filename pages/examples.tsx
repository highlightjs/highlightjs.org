import * as fs from 'fs';
import * as path from 'path';

import { SyntheticEvent, useState } from 'react';

import { CodeBlock } from '../components/codeblock';
import { ThemeSelector } from '../components/theme-selector';
import { MainLayout } from '../layouts/main';
import styles from '../styles/Examples.module.scss';

const SNIPPETS_DIR = path.resolve(process.cwd(), 'data', 'snippets');
const SNIPPET_IGNORE = ['node-repl', 'sql_more'];

const LANG_CATS = {
  Assembler: ['armasm', 'avrasm', 'llvm', 'mipsasm', 'x86asm'],
  Common: [
    'apache',
    'xml',
    'bash',
    'coffeescript',
    'cpp',
    'csharp',
    'css',
    'markdown',
    'diff',
    'ruby',
    'go',
    'http',
    'ini',
    'java',
    'javascript',
    'json',
    'kotlin',
    'less',
    'lua',
    'makefile',
    'perl',
    'nginx',
    'objectivec',
    'php',
    'php-template',
    'properties',
    'python',
    'python-repl',
    'r',
    'rust',
    'scss',
    'shell',
    'sql',
    'swift',
    'yaml',
    'typescript',
    'vbnet',
  ],
  Config: [
    'apache',
    'crmsh',
    'dns',
    'dockerfile',
    'dsconfig',
    'dts',
    'ini',
    'jboss-cli',
    'ldif',
    'nginx',
    'pf',
    'properties',
    'puppet',
    'roboconf',
    'yaml',
  ],
  CSS: ['css', 'less', 'scss', 'stylus'],
  Database: ['sql_more', 'sql'],
  Enterprise: [
    '1c',
    'axapta',
    'cos',
    'dsconfig',
    'isbl',
    'java',
    'ldif',
    'livecodeserver',
    'ruleslanguage',
  ],
  Functional: [
    'clean',
    'coq',
    'elixir',
    'elm',
    'erlang-repl',
    'erlang',
    'flix',
    'fsharp',
    'haskell',
    'ocaml',
    'reasonml',
    'scala',
    'sml',
    'xquery',
  ],
  Graphics: ['glsl', 'mel', 'processing', 'rib', 'rsl'],
  Lisp: ['clojure', 'clojure-repl', 'hy', 'lisp', 'scheme'],
  Markup: ['asciidoc', 'markdown', 'latex'],
  Misc: [
    'abnf',
    'accesslog',
    'ada',
    'arduino',
    'aspectj',
    'awk',
    'basic',
    'bnf',
    'brainfuck',
    'cal',
    'ceylon',
    'cmake',
    'crystal',
    'csp',
    'd',
    'delphi',
    'dos',
    'ebnf',
    'excel',
    'fix',
    'gcode',
    'gherkin',
    'golo',
    'gradle',
    'groovy',
    'haxe',
    'inform7',
    'julia',
    'julia-repl',
    'lasso',
    'leaf',
    'mercury',
    'monkey',
    'n1ql',
    'nix',
    'nsis',
    'oxygene',
    'pgsql',
    'pony',
    'powershell',
    'profile',
    'prolog',
    'purebasic',
    'q',
    'routeros',
    'sas',
    'smali',
    'smalltalk',
    'step21',
    'subunit',
    'taggerscript',
    'tap',
    'tcl',
    'tp',
    'vala',
    'verilog',
    'vhdl',
    'xl',
    'zephir',
  ],
  Protocols: ['capnproto', 'http', 'json', 'protobuf', 'thrift'],
  Scientific: [
    'fortran',
    'gams',
    'gauss',
    'irpf90',
    'mathematica',
    'matlab',
    'maxima',
    'mizar',
    'openscad',
    'r',
    'scilab',
    'stan',
    'stata',
  ],
  Scripting: [
    'actionscript',
    'angelscript',
    'applescript',
    'arcade',
    'autohotkey',
    'autoit',
    'coffeescript',
    'cos',
    'dart',
    'gml',
    'hsp',
    'javascript',
    'livescript',
    'lsl',
    'lua',
    'moonscript',
    'node-repl',
    'qml',
    'sqf',
    'typescript',
    'vbscript',
    'vbscript-html',
    'vim',
  ],
  System: ['cpp', 'go', 'nim', 'rust', 'swift'],
  Template: [
    'django',
    'dust',
    'erb',
    'haml',
    'handlebars',
    'mojolicious',
    'parser3',
    'twig',
  ],
};

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
        <div className="row">
          <div className="col-lg-3 position-relative">
            <div className={styles.sidebar}>
              <h1>Examples</h1>

              <div>
                <label htmlFor="language-category">Language Category</label>
                <select
                  id="language-category"
                  className={styles.languageCategories}
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
                className="mb-3"
                onChange={setTheme}
                value={theme}
              />
            </div>
          </div>

          <div className="col-lg-9">
            <section className={styles[`show-${filter}`]}>
              {Object.keys(snippets).map((language) => (
                <div
                  key={language}
                  data-category={__LANG_LOOKUP[language]?.toLowerCase()}
                >
                  <CodeBlock
                    className={styles.sampleSnippet}
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
