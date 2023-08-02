import { SyntheticEvent } from 'react';

import themes from '../data/themes.json';

interface Props {
  className?: string;
  onChange: (theme: string) => void;
  value: string;
}

export const ThemeSelector = ({ className, onChange, value }: Props) => {
  const handleOnChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <div className={className}>
      <label htmlFor="theme-selector" className="mb-2">
        Theme
      </label>
      <select id="theme-selector" onChange={handleOnChange} value={value}>
        {themes.map((theme) => (
          <option key={theme}>{theme}</option>
        ))}
      </select>
    </div>
  );
};
