import React, { ReactNode } from 'react';

import { classList } from '../utilities/cssClasses';

interface Props {
  children: ReactNode | ReactNode[];
  className?: string;
}

export const BlurredBackground = ({ children, className }: Props) => (
  <div
    className={classList([
      'bg-black/40 rounded-xl backdrop-blur-xl',
      className,
    ])}
  >
    {children}
  </div>
);
