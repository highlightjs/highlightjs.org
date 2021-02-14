import React from 'react';
import hljs from 'highlight.js';

import styles from './codeblock.module.scss';

interface Props {
  className?: string;
  code: string;
  language: string;
}

function createMarkup(code: string, language: string) {
  return { __html: hljs.highlight(language, code).value.trim() };
}

export const CodeBlock = ({ code, language, className }: Props) => (
  <pre className={`hljs p-4 ${className ?? ''} ${styles.codeBlock}`}>
    <code
      dangerouslySetInnerHTML={createMarkup(code, language)}
    />
  </pre>
);
