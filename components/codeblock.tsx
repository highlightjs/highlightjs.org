import hljs, { HighlightResult } from 'highlight.js';
import React from 'react';

import themes from '../data/themes.json';

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

  return hljs.highlight(code, { language });
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
  const name = hljs.getLanguage(result.language);

  return (
    <pre
      className={`theme-${hljsTheme} shadow-3xl text-sm relative overflow-hidden max-w-full ${className}`}
    >
      <span className="hljs mb-0 p-4 block min-h-full overflow-auto">
        <code dangerouslySetInnerHTML={markup} />
      </span>
      <small className="bg-black/30 absolute top-0 right-0 uppercase font-bold text-xs rounded-bl-md px-2 py-1">
        <span className="sr-only">Language:</span>
        {name?.name || language || 'text'}
      </small>
    </pre>
  );
};
