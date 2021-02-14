import { KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from "react";

import styles from './dumb-editor.module.scss';

interface Props {
  value: string;
  onChange: (content: string) => void;
}

export const DumbEditor = ({ value, onChange }: Props) => {
  const ref = useRef<HTMLTextAreaElement>();
  const [selection, setSelection] = useState(-1);
  const handleOnChange = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    onChange(event.currentTarget.value);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === 9 || event.which === 9) {
      event.preventDefault();

      const selectionStart = ref.current.selectionStart;
      const selectionEnd = ref.current.selectionEnd;
      const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);

      setSelection(selectionStart + 1);
      onChange(newValue);
    }
  };

  // If we are updated the textarea's content after a Tab, then restore our
  // previous cursor position.
  useEffect(() => {
    if (selection >= 0) {
      ref.current.selectionStart = selection;
      ref.current.selectionEnd = selection;

      setSelection(-1);
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      className={styles.textarea}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
      value={value}
    />
  );
};
