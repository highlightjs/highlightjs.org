import hljs from 'highlight.js';
import { SyntheticEvent } from 'react';

interface Props {
  className?: string;
  onChange: (lang: string) => void;
  value: string;
}

export const LanguageSelector = ({ className, onChange, value }: Props) => {
  const handleOnChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    const language = event.currentTarget.value;
    onChange(language === '(auto)' ? '' : language);
  };

  return (
    <div className={className}>
      <label htmlFor="lang-selector" className="mb-2">
        Language
      </label>
      <select id="lang-selector" onChange={handleOnChange} value={value}>
        {['(auto)', ...hljs.listLanguages()].map((language) => (
          <option key={language}>{language}</option>
        ))}
      </select>
    </div>
  );
};
