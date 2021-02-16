import React, { ReactNode } from 'react';

import { Footer } from '../components/footer';
import { Navigation } from '../components/navigation';
import styles from './main.module.scss';

interface Props {
  children: ReactNode | ReactNode[];
}

export const MainLayout = (props: Props) => {
  return (
    <div>
      <Navigation />

      <main>{props.children}</main>

      <Footer />
    </div>
  );
};
