import * as lz from 'lzutf8';
import React, { useEffect, useState } from 'react';

import { CodeBlock } from '../components/codeblock';
import { DumbEditor } from '../components/dumb-editor';
import { LanguageSelector } from '../components/language-selector';
import { ThemeSelector } from '../components/theme-selector';
import { MainLayout } from '../layouts/main';

interface Data {
  v: number;
  code: string;
  lang: string | null;
  theme: string;
}

const URL_FMT_VER = 1;
const DEFAULT_THEME = 'atom-one-dark';

function persistToURL({ code, lang, theme }: Data): void {
  const params = new URLSearchParams();

  if (lang !== null) {
    params.set('lang', lang);
  }

  params.set('v', '' + URL_FMT_VER);
  params.set('theme', theme);

  if (code.length > 0) {
    params.set('code', lz.compress(code, { outputEncoding: 'Base64' }));
  }

  window.location.hash = params.toString();
}

function parseURL(): Data {
  const params = new URLSearchParams(window.location.hash.substring(1));

  return {
    v: +params.get('v') ?? URL_FMT_VER,
    lang: params.get('lang') ?? '',
    code: lz.decompress(params.get('code') ?? '', { inputEncoding: 'Base64' }),
    theme: params.get('theme') ?? DEFAULT_THEME,
  };
}

const Demo = () => {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState<string>('');
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);

  const handleShare = () => {
    persistToURL({ v: 1, code, lang, theme });
  };

  useEffect(() => {
    const { lang, code, theme } = parseURL();

    setCode(code);
    setLang(lang);
    setTheme(theme);
  }, []);

  return (
    <MainLayout
      title="Demo"
      description="Preview how highlight.js will highlight your code snippets and share them with other syntax highlighting nerds"
    >
      <div className="container">
        <div className="grid grid-cols-6 gap-8 mb-8">
          <div className="col-span-6 md:col-span-3 xl:col-span-2 relative">
            <div className="sticky top-4">
              <div className="d-md-flex mb-3">
                <div className="flex-md-grow-1 mb-3 mb-md-0 pr-md-3">
                  <LanguageSelector
                    className="relative"
                    onChange={setLang}
                    value={lang}
                  />
                </div>
                <div className="flex-md-grow-1 mb-3 mb-md-0 pr-md-3">
                  <ThemeSelector
                    className="w-full"
                    onChange={setTheme}
                    value={theme}
                  />
                </div>

                <div className="ml-auto mt-auto">
                  <button className="button" onClick={handleShare}>
                    Share
                  </button>
                </div>
              </div>

              <DumbEditor
                className="tab-size"
                onChange={setCode}
                value={code}
              />
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 xl:col-span-4 min-h-[6rem]">
            <CodeBlock
              className="tab-size h-full"
              code={code}
              language={lang}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Demo;
