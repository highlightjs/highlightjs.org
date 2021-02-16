import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'highlight.js/styles/atom-one-dark.css';

import '../styles/globals.scss';

import React from 'react';

function HighlightJsSite({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default HighlightJsSite;
