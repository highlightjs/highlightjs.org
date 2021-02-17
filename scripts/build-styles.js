const fs = require('fs');
const sass = require('sass');

const stylesDir = __dirname + '/../highlight.js/build/styles/';
const outputDir = __dirname + '/../data/';
const outputCss = outputDir + 'themes.css';
const outputThemes = outputDir + 'themes.json';

const themes = [];

if (fs.existsSync(outputCss)) {
  fs.unlinkSync(outputCss);
}

fs.readdirSync(stylesDir).forEach((filename) => {
  const filePath = stylesDir + filename;

  if (filename.substr(-4, 4) !== '.css') {
    fs.copyFileSync(filePath, outputDir + filename);

    return;
  }

  const themeName = filename.replace('.css', '');
  const contents = fs.readFileSync(filePath, 'utf-8');

  const wrapped = `
    .${themeName} {
      ${contents}
    }
  `;
  const compiled = sass.renderSync({ data: wrapped, outputStyle: 'compressed' })
    .css;

  fs.appendFileSync(outputCss, compiled.toString());

  themes.push(themeName);
});

fs.writeFileSync(outputThemes, JSON.stringify(themes));
