import React, { ReactNode } from 'react';

import styles from './lightbackground.module.scss';

interface Props {
  children: ReactNode | ReactNode[];
}

export const LightBackground = ({ children }: Props) => (
  <div className={styles.lightBackground}>
    <div className="container py-10">{children}</div>
  </div>
);
