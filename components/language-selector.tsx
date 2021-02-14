import hljs from 'highlight.js';
import { SyntheticEvent } from "react";

interface Props {
  className?: string;
  onChange: (lang: string) => void;
}

export const LanguageSelector = ({ className, onChange }: Props) => {
  const handleOnChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    const language = event.currentTarget.value;
    onChange(language === '(auto)' ? null : language);
  };

  return (
    <div className={className}>
      <label
        htmlFor="language-selector"
      >
        Language
      </label>
      <select
        name="language-selector"
        onChangeCapture={handleOnChange}
      >
        {['(auto)', ...hljs.listLanguages()].map(language => (
          <option value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};
