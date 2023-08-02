import { watch } from 'indent-textarea';
import { SyntheticEvent, useEffect, useRef } from 'react';

import { classList } from '../utilities/cssClasses';

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
      <label htmlFor="code-editor" className="mb-2">
        Code
      </label>
      <textarea
        ref={ref}
        id="code-editor"
        className={classList([
          'font-mono',
          'text-base',
          'h-[500px]',
          'min-h-[500px]',
          className,
        ])}
        onChange={handleOnChange}
        value={value}
      />
    </div>
  );
};
