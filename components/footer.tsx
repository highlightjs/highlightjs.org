import Link from 'next/link';
import React from 'react';

import { LightBackground } from './lightbackground';

export const Footer = () => (
  <footer>
    <LightBackground>
      <div className="md:grid grid-cols-2">
        <div className="text-center md:text-left">
          Copyright &copy; {new Date().getFullYear()}
        </div>
        <div>
          <ul className="grid grid-cols-2 mb-0 mt-4 p-0 text-left md:block md:mt-0 md:text-right">
            <li className="inline-block list-none mr-8 last:mr-0">
              <Link
                className="focus:underline hover:underline focus:text-cyan-300 hover:text-cyan-300"
                href="/examples"
              >
                Code Samples
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </LightBackground>
  </footer>
);
