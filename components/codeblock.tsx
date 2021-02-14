import hljs from 'highlight.js';
import React from 'react';

import styles from './codeblock.module.scss';

interface Props {
  className?: string;
  code: string;
  language: string;
}

function createMarkup(code: string, language: string | null) {
  let result: HighlightResult;

  if (language === null) {
    result = hljs.highlightAuto(code);
  } else {
    result = hljs.highlight(language, code);
  }

  return { __html: result.value.trim() };
}

export const CodeBlock = ({ code, language, className }: Props) => (
  <pre className={`hljs p-4 ${className ?? ''} ${styles.codeBlock}`}>
    <code
      dangerouslySetInnerHTML={createMarkup(code, language)}
    />
  </pre>
);
