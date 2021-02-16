import hljs from 'highlight.js';
import React from 'react';

import styles from './codeblock.module.scss';

interface Props {
  className?: string;
  code: string;
  language: string | null;
}

function createMarkup(result: HighlightResult): { __html: string } {
  return { __html: result.value.trim() };
}

function highlight(code: string, language: string | null): HighlightResult {
  if (language === null) {
    return hljs.highlightAuto(code);
  }

  return hljs.highlight(language, code);
}

export const CodeBlock = ({ code, language = null, className }: Props) => {
  const result = highlight(code, language);
  const markup = createMarkup(result);

  return (
    <div>
      <pre className={`hljs p-4 ${className ?? ''} ${styles.codeBlock}`}>
        <code
          dangerouslySetInnerHTML={markup}
        />
      </pre>
      <div>
        Language: {result.language ?? language}
      </div>
    </div>
  );
};
