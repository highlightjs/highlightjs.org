import React, { useEffect, useState } from 'react';

import { CodeBlock } from '../../components/codeblock';
import { DumbEditor } from '../../components/dumb-editor';
import { LanguageSelector } from '../../components/language-selector';
import { ThemeSelector } from '../../components/theme-selector';
import { MainLayout } from '../../layouts/main';
import styles from '../../styles/Demo.module.scss';

interface Data {
  code: string;
  lang: string | null;
  theme: string;
}

const DEFAULT_THEME = 'atom-one-dark';

function persistToURL({ code, lang, theme }: Data): void {
  const params = new URLSearchParams();

  if (lang !== null) {
    params.set('lang', lang);
  }

  params.set('theme', theme);

  if (code.length > 0) {
    params.set('code', btoa(code));
  }

  window.location.hash = params.toString();
}

function parseURL(): Data {
  const params = new URLSearchParams(window.location.hash.substring(1));

  return {
    lang: params.get('lang'),
    code: atob(params.get('code') ?? ''),
    theme: params.get('theme') ?? DEFAULT_THEME,
  };
}

const Demo = () => {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);

  const handleShare = () => {
    persistToURL({ code, lang, theme });
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
          <div className={`col-md-6 ${styles.editorSection}`}>
            <div className={styles.stickyWrapper}>
              <div className="d-flex mb-3">
                <div className="row w-100">
                  <div className="col-md-6">
                    <LanguageSelector
                      className="w-100"
                      onChange={setLang}
                      value={lang}
                    />
                  </div>
                  <div className="col-md-6">
                    <ThemeSelector
                      className="w-100"
                      onChange={setTheme}
                      value={theme}
                    />
                  </div>
                </div>

                <div className="ml-auto mt-auto">
                  <button className={styles.shareButton} onClick={handleShare}>
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
          <div className="col-md-6">
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
