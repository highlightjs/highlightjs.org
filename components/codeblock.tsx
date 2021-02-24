import hljs from 'highlight.js';
import React from 'react';

import themes from '../data/themes.json';
import styles from './codeblock.module.scss';

interface Props {
  className?: string;
  code: string;
  language: string | null;
  theme?: string;
}

function createMarkup(result: HighlightResult): { __html: string } {
  return { __html: result.value.trim() };
}

function highlight(code: string, language: string | null): HighlightResult {
  if (language === null || language.trim() === '') {
    return hljs.highlightAuto(code);
  }

  return hljs.highlight(language, code);
}

export const CodeBlock = ({
  code,
  language = null,
  theme,
  className,
}: Props) => {
  const result = highlight(code, language);
  const markup = createMarkup(result);
  const hljsTheme = themes.indexOf(theme) >= 0 ? theme : 'atom-one-dark';

  return (
    <pre className={[hljsTheme, styles.codeBlock, className].join(' ')}>
      <span className={`hljs mb-0 p-4 ${styles.hljsBlock}`}>
        <code dangerouslySetInnerHTML={markup} />
      </span>
      <small className={styles.tagLang}>
        <span className="sr-only">Language:</span>
        {result.language ?? language ?? 'text'}
      </small>
    </pre>
  );
};
