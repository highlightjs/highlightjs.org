# highlightjs.org

Welcome to the second iteration of our beloved highlightjs.org website! This website is built using Next.js and is designed to be an entirely static website that can be hosted on GitHub pages.

## Development

This website requires the highlight.js repo to be cloned and a few extra things to be built.

```bash
# Initial Setup
yarn install
yarn clone
yarn themes

# Future development
yarn dev
```

## Production

The production version of the website will be built into the `out` folder.

```bash
yarn install
yarn dist
```
