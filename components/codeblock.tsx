import React from 'react';
import hljs from 'highlight.js';

import styles from './codeblock.module.scss';

interface Props {
  code: string;
  language: string;
}

function createMarkup(code: string, language: string) {
  return { __html: hljs.highlight(language, code).value.trim() };
}

export const CodeBlock = (props: Props) => {
  const { code, language } = props;

  return (
    <pre className={`hljs p-4 ${styles.codeBlock}`}>
      <code 
        dangerouslySetInnerHTML={createMarkup(code, language)} 
      />
    </pre>
  );  
};
