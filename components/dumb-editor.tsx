import { watch } from 'indent-textarea';
import { SyntheticEvent, useEffect, useRef } from "react";

import styles from './dumb-editor.module.scss';

interface Props {
  className?: string;
  value: string;
  onChange: (content: string) => void;
}

export const DumbEditor = ({ className, onChange, value }: Props) => {
  const ref = useRef<HTMLTextAreaElement>();
  const handleOnChange = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    onChange(event.currentTarget.value);
  };

  useEffect(() => watch(ref.current), [ref]);

  return (
    <div>
      <label className={styles.label} htmlFor="code-editor">Code</label>
      <textarea
        ref={ref}
        id="code-editor"
        className={[className ?? '', styles.textarea].join(' ')}
        onChange={handleOnChange}
        value={value}
      />
    </div>
  );
};
