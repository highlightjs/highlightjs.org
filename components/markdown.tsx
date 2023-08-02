import dedent from 'dedent';
import MarkdownIt from 'markdown-it';
import * as MarkdownItAttrs from 'markdown-it-attrs';
import ReactDOMServer from 'react-dom/server';

import { CodeBlock } from './codeblock';
import styles from './markdown.module.scss';

interface Props {
  body: string;
}

const md = MarkdownIt({
  highlight: (str, lang): string => {
    return ReactDOMServer.renderToStaticMarkup(
      <CodeBlock code={str} language={lang} className="mb-6" />,
    );
  },
});

md.use(MarkdownItAttrs, {
  leftDelimiter: '{',
  rightDelimiter: '}',
});

export const Markdown = ({ body }: Props) => {
  const source = dedent(body);
  const output = md.render(source);

  return (
    <div
      className={styles.markdown}
      dangerouslySetInnerHTML={{ __html: output }}
    />
  );
};
