import React, { useState } from "react";

import { CodeBlock } from "../../components/codeblock";
import { DumbEditor } from "../../components/dumb-editor";
import { LanguageSelector } from "../../components/language-selector";
import { MainLayout } from "../../layouts/main";

import styles from '../../styles/Demo.module.scss';

const Demo = () => {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState<string | null>(null);

  return (
    <MainLayout>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex">
              <LanguageSelector className="mb-3" onChange={setLang} />
            </div>

            <DumbEditor
              className={styles.tabStyle}
              onChange={setCode}
              value={code}
            />
          </div>
          <div className="col-md-6">
            <CodeBlock
              className={styles.tabStyle}
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
