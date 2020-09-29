import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import styles from './navigation.module.scss';

const links = [
  <Link href="#">Usage</Link>,
  <Link href="#">News</Link>,
  <Link href="#">Docs</Link>,
  <Link href="#">Demo</Link>,
  <Link href="#">GitHub</Link>,
];

export const Navigation = () => (
  <header className="container py-5">
    <Head>
      <title>highlight.js</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <nav className="row">
      <div className="col-md-6">
        <span className={styles.wordMark}>
          <Link href="/">highlight.js</Link>
        </span>
      </div>
      <div className="col-md-6">
        <ul className={`mb-0 ${styles.navigation}`}>
          {links.map(link => <li>{link}</li>)}
        </ul>
      </div>
    </nav>
  </header>
);
