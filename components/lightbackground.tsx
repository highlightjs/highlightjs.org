import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode | ReactNode[];
}

export const LightBackground = ({ children }: Props) => (
  <div className="bg-brand-red-alt">
    <div className="container py-10">{children}</div>
  </div>
);
