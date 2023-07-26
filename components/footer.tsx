import Link from 'next/link';
import React from 'react';

import styles from './footer.module.scss';
import { LightBackground } from './lightbackground';

export const Footer = () => (
  <footer>
    <LightBackground>
      <div className="row">
        <div className="col-md-6 text-center text-md-left">
          Copyright &copy; {new Date().getFullYear()}
        </div>
        <div className="col-md-6">
          <ul className={styles.extraLinks}>
            <li>
              <Link href="/examples">Code Samples</Link>
            </li>
          </ul>
        </div>
      </div>
    </LightBackground>
  </footer>
);
