module.exports = {
  env: {
    domain: 'https://highlightjs.org',
  },
  redirects: async () => [
    {
      source: '/usage',
      destination: '/#usage',
      permanent: false,
    },
    {
      source: '/contribute',
      destination: 'https://github.com/highlightjs/highlight.js',
      permanent: true,
    },
    {
      source: '/static/demo',
      destination: '/examples',
      permanent: true,
    },
  ],
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
};
