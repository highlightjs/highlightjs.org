const withTM = require('next-transpile-modules')([
  'indent-textarea',
  'text-field-edit',
]);

module.exports = {
  ...withTM(),
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
};
