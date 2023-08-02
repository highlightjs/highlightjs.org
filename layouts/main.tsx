import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

import { Footer } from '../components/footer';
import { Navigation } from '../components/navigation';

interface Props {
  children: ReactNode | ReactNode[];
  description?: string;
  title?: string;
}

export const MainLayout = ({ children, description, title }: Props) => {
  const pageName = title ? `${title} - highlight.js` : 'highlight.js';
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{pageName}</title>
        <link rel="icon" href="/icon.png" />
        <meta name="description" content={description} />
        <meta property="og:title" content={pageName} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${process.env.domain}${router.asPath}`}
        />
        <meta
          property="og:image"
          content={`${process.env.domain}/opengraph-image.png`}
        />
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
};
