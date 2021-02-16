import React from 'react';

import styles from '../styles/Home.module.scss';
import { LightBackground } from './lightbackground';

export const Footer = () => (
  <footer>
    <LightBackground>
      <div className="row">
        <div className="col-md-6">
          Copyright &copy; {new Date().getFullYear()}
        </div>
        <div className="col-md-6"></div>
      </div>
    </LightBackground>
  </footer>
);
