import React, { ReactNode } from 'react';

import styles from './lightbackground.module.scss';

interface Props {
  children: ReactNode | ReactNode[];
}

export const LightBackground = ({ children }: Props) => (
  <div className={`my-4 ${styles.lightBackground}`}>
    <div className="container py-4">{children}</div>
  </div>
);
