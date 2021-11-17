const fs = require('fs');
const path = require('path');
const sass = require('sass');

const stylesDir = __dirname + '/../node_modules/highlight.js/styles/';
const outputDir = __dirname + '/../data/';
const outputCss = outputDir + 'themes.css';
const outputThemes = outputDir + 'themes.json';

const themes = [];

if (fs.existsSync(outputCss)) {
  fs.unlinkSync(outputCss);
}

function walkStylesDir(directory, prefix = '') {
  fs.readdirSync(directory).forEach((filename) => {
    const filePath = path.join(directory, filename);

    if (fs.lstatSync(filePath).isDirectory()) {
      walkStylesDir(filePath, (prefix ? prefix + '-' : '') + filename);

      return;
    }

    if (filename.substr(-4, 4) !== '.css') {
      fs.copyFileSync(filePath, path.join(outputDir, filename));

      return;
    }

    let themeName = filename
      .replace('.css', '')
      .replace(/[^\w-]+/, '-')
      .replace(/-$/, '');
    if (prefix) {
      themeName = `${prefix}-${themeName}`;
    }
    const contents = fs.readFileSync(filePath, 'utf-8');
    const compiled = sass.renderSync({
      data: `
        .theme-${themeName} {
          ${contents}
        }
      `,
      outputStyle: 'compressed',
    }).css;

    fs.appendFileSync(outputCss, compiled.toString());

    themes.push(themeName);
  });
}

walkStylesDir(stylesDir);

fs.writeFileSync(outputThemes, JSON.stringify(themes));
