import Link from 'next/link';
import React from 'react';

import ExternalLink from './external-link';

const links = [
  <Link href="/#usage">Usage</Link>,
  <Link href="/news">News</Link>,
  <Link href="/demo/">Demo</Link>,
  <Link href="/download/">Download</Link>,
  <ExternalLink href="https://highlightjs.readthedocs.io/">Docs</ExternalLink>,
  <ExternalLink href="https://github.com/highlightjs/highlight.js">
    GitHub
  </ExternalLink>,
];

export const Navigation = () => (
  <header className="container py-8 md:py-12">
    <nav className="md:flex items-center">
      <div className="text-center sm:text-left mb-4 md:mb-0">
        <span className="text-4xl font-bold">
          <Link
            className="no-underline hover:text-cyan-300 focus:text-cyan-300"
            href="/"
          >
            highlight.js
          </Link>
        </span>
      </div>
      <div className="ml-auto">
        <ul className="flex flex-wrap gap-x-3 gap-y-1 justify-center pl-0">
          {links.map((link, i) => (
            <li key={i} className="text-xl font-bold">
              {link}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </header>
);
