import Head from 'next/head';
import React, { ReactNode } from 'react';

import { Footer } from '../components/footer';
import { Navigation } from '../components/navigation';

interface Props {
  children: ReactNode | ReactNode[];
  title?: string;
}

export const MainLayout = ({ children, title }: Props) => (
  <div>
    <Head>
      <title>
        {title ? `${title} - ` : ''}
        highlight.js
      </title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Navigation />

    <main>
      {title && (
        <div className="container mb-4">
          <h1 className="text-3xl leading-tight">{title}</h1>
        </div>
      )}
      {children}
    </main>

    <Footer />
  </div>
);
