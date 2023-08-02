import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { HTMLProps } from 'react';

const ExternalLink = ({ children, ...props }: HTMLProps<HTMLAnchorElement>) => (
  <a
    {...props}
    className="inline-flex items-center whitespace-nowrap"
    target="_blank"
  >
    {children}
    <FontAwesomeIcon
      icon={faArrowUpRightFromSquare}
      className="h-3 mb-1 ml-2"
    />
  </a>
);

export default ExternalLink;
