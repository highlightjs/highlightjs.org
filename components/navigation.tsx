import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const links = [
  <Link href="/#usage">Usage</Link>,
  <Link href="/news">News</Link>,
  <Link href="https://highlightjs.readthedocs.io/">Docs</Link>,
  <Link href="/demo/">Demo</Link>,
  <Link href="/download/">Download</Link>,
  <Link href="https://github.com/highlightjs/highlight.js">GitHub</Link>,
];

export const Navigation = () => (
  <header className="container py-12">
    <Head>
      <title>highlight.js</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <nav className="md:grid grid-cols-3">
      <div className="col-span-1 text-center sm:text-left">
        <span className="text-4xl font-bold">
          <Link
            className="no-underline hover:text-cyan-300 focus:text-cyan-300"
            href="/"
          >
            highlight.js
          </Link>
        </span>
      </div>
      <div className="col-span-2 flex">
        <ul className="m-auto pl-0 text-center sm:mr-0 sm:text-right">
          {links.map((link, i) => (
            <li
              key={i}
              className="inline-block text-xl font-bold ml-4 first:ml-0"
            >
              {link}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </header>
);
