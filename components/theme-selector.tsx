import { SyntheticEvent } from 'react';

import themes from '../data/themes.json';

interface Props {
  className?: string;
  onChange: (theme: string) => void;
}

export const ThemeSelector = ({ className, onChange }: Props) => {
  const handleOnChange = (event: SyntheticEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <div className={className}>
      <label htmlFor="theme-selector">Theme</label>
      <select name="theme-selector" onChangeCapture={handleOnChange}>
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
};
