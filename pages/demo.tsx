import * as lz from 'lzutf8';
import React, { useEffect, useState } from 'react';

import { CodeBlock } from '../components/codeblock';
import { DumbEditor } from '../components/dumb-editor';
import { LanguageSelector } from '../components/language-selector';
import { ThemeSelector } from '../components/theme-selector';
import { MainLayout } from '../layouts/main';
import styles from '../styles/Demo.module.scss';

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
    <MainLayout>
      <div className="container">
        <div className="row">
          <div className={`col-lg-6 mb-3 mb-lg-0 ${styles.editorSection}`}>
            <div className={styles.stickyWrapper}>
              <div className="d-md-flex mb-3">
                <div className="flex-md-grow-1 mb-3 mb-md-0 pr-md-3">
                  <LanguageSelector
                    className="w-100"
                    onChange={setLang}
                    value={lang}
                  />
                </div>
                <div className="flex-md-grow-1 mb-3 mb-md-0 pr-md-3">
                  <ThemeSelector
                    className="w-100"
                    onChange={setTheme}
                    value={theme}
                  />
                </div>

                <div className="ml-auto mt-auto">
                  <button
                    className={['button', styles.shareButton].join(' ')}
                    onClick={handleShare}
                  >
                    Share
                  </button>
                </div>
              </div>

              <DumbEditor
                className={styles.tabStyle}
                onChange={setCode}
                value={code}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <CodeBlock
              className={[styles.codeEditor, styles.tabStyle].join(' ')}
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
