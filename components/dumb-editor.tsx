import { watch } from 'indent-textarea';
import { SyntheticEvent, useEffect, useRef } from "react";

import styles from './dumb-editor.module.scss';

interface Props {
  value: string;
  onChange: (content: string) => void;
}

export const DumbEditor = ({ value, onChange }: Props) => {
  const ref = useRef<HTMLTextAreaElement>();
  const handleOnChange = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    onChange(event.currentTarget.value);
  };

  useEffect(() => watch(ref.current), [ref]);

  return (
    <textarea
      ref={ref}
      className={styles.textarea}
      onChange={handleOnChange}
      value={value}
    />
  );
};
