import dedent from 'dedent';
import MarkdownIt from "markdown-it";
import * as MarkdownItAttrs from 'markdown-it-attrs';

import styles from './markdown.module.scss';

interface Props {
  body: string;
}

const md = MarkdownIt();
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
