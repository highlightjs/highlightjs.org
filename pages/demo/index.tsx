import React, { useEffect, useState } from 'react';

import { CodeBlock } from '../../components/codeblock';
import { DumbEditor } from '../../components/dumb-editor';
import { LanguageSelector } from '../../components/language-selector';
import { MainLayout } from '../../layouts/main';
import styles from '../../styles/Demo.module.scss';

interface Data {
  code: string;
  lang: string | null;
}

function persistToURL({ code, lang }: Data): void {
  const params = new URLSearchParams();

  if (lang !== null) {
    params.set('lang', lang);
  }

  params.set('code', btoa(code));

  window.location.hash = params.toString();
}

function parseURL(): Data {
  const params = new URLSearchParams(window.location.hash.substring(1));

  return {
    lang: params.get('lang'),
    code: atob(params.get('code') ?? ''),
  };
}

const Demo = () => {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState<string | null>(null);

  const handleShare = () => {
    persistToURL({ code, lang });
  };

  useEffect(() => {
    const { lang, code } = parseURL();

    setCode(code);
    setLang(lang);
  }, []);

  return (
    <MainLayout>
      <div className="container">
        <div className="row">
          <div className={`col-md-6 ${styles.editorSection}`}>
            <div className={styles.stickyWrapper}>
              <div className="d-flex mb-3">
                <LanguageSelector onChange={setLang} />

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
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Demo;
