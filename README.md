# highlightjs.org

Welcome to the second iteration of our beloved highlightjs.org website! This is a standard [Next.js](https://nextjs.org/) website with server-side functionality.

## Development

This website requires the highlight.js repo to be cloned and a few extra things to be built, such as an inventory of all the languages and themes that are supported.

```bash
npm install

# Download and build any dependencies (e.g. source of hljs)
npm run build

# Server on localhost:3000
npm run dev
```

## Production

The production version of this website is hosted on Heroku since server-side functionality was needed to support our custom build functionality.

```bash
npm install
npm run build
npm start
```
