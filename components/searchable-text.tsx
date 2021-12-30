import escapeRegExp from 'lodash.escaperegexp';
import React, { useEffect, useState } from 'react';

enum FilterResultType {
  RegExp,
  Alias,
  None,
}

interface Props {
  aliases?: string[];
  filter: string;
  onMatch?: (matched: boolean) => void;
  text: string;
}

const SearchableText = ({ aliases, filter, onMatch, text }: Props) => {
  const [matchesFilter, setMatchesFilter] = useState(FilterResultType.None);
  const re = new RegExp(`(${escapeRegExp(filter)})`, 'gi');

  useEffect(() => {
    if (text.match(re)) {
      onMatch(true);
      setMatchesFilter(FilterResultType.RegExp);
    } else if (aliases?.indexOf(filter.toLocaleLowerCase()) >= 0) {
      onMatch(true);
      setMatchesFilter(FilterResultType.Alias);
    } else {
      onMatch(false);
      setMatchesFilter(FilterResultType.None);
    }
  }, [filter]);

  const defaultRender = <span>{text}</span>;

  if (!filter) {
    return defaultRender;
  }

  if (matchesFilter === FilterResultType.RegExp) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(re, '<mark>$1</mark>'),
        }}
      />
    );
  }

  if (matchesFilter === FilterResultType.Alias) {
    return <mark>{text}</mark>;
  }

  return defaultRender;
};

export default SearchableText;
