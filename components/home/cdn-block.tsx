import dedent from 'dedent';
import {HTMLAttributes, useState} from "react";
import { CodeBlock } from "../codeblock";

interface Props extends HTMLAttributes<HTMLDivElement>{
  version: string;
}

export const HTMLTagsExample = ({ version, ...props }: Props) => {
  const [cdn, setCDN] = useState('cdnjs');
  const links = {
    cdnjs: {
      link: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/{version}/styles/default.min.css',
      script: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/{version}/highlight.min.js',
      lang: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/{version}/languages/go.min.js',
    },
    jsDeliver: {
      link: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@{version}/build/styles/default.min.css',
      script: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@{version}/build/highlight.min.js',
      lang: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@{version}/build/languages/go.min.js',
    },
    unpkg: {
      link: 'https://unpkg.com/@highlightjs/cdn-assets@{version}/styles/default.min.css',
      script: 'https://unpkg.com/@highlightjs/cdn-assets@{version}/highlight.min.js',
      lang: 'https://unpkg.com/@highlightjs/cdn-assets@{version}/languages/go.min.js',
    },
    'Self hosted': {
      link: '/path/to/styles/default.css',
      script: '/path/to/highlight.min.js',
    },
  };

  const codeBlockSource = [
    dedent`
      <link rel="stylesheet" href="${links[cdn].link}">
      <script src="${links[cdn].script}"></script>
    `
  ];

  if (links[cdn].lang) {
    codeBlockSource.push(dedent`
      <!-- and it's easy to individually load additional languages -->
      <script src="${links[cdn].lang}"></script>
    `);
  }

  codeBlockSource.push('<script>hljs.highlightAll();</script>');

  const codeBlock = codeBlockSource
    .join('\n\n')
    .replaceAll('{version}', version)
    .trim()
  ;

  return (
    <div {...props}>
      <div>
        {Object.keys(links).map((name, index) => (
          <button key={index} onClick={() => setCDN(name)}>
            {name}
          </button>
        ))}
      </div>

      <CodeBlock code={codeBlock} language="html" />
    </div>
  );
}
