const fs = require('fs');
const glob = require('glob');
const path = require('path');
const { Language } = require('../highlight.js/tools/lib/language');

const langSrcDir = path.join(__dirname, '../highlight.js/src/languages/*.js');
const outputDir = __dirname + '/../data/';
const outputCategories = outputDir + 'categories.json';

if (fs.existsSync(outputCategories)) {
  fs.unlinkSync(outputCategories);
}

let categories = {
  Miscellaneous: [],
};

glob.sync(langSrcDir).forEach((filePath) => {
  const language = Language.fromFile(filePath);

  if (language.categories.length === 0) {
    categories['Miscellaneous'].push(language.name);

    return;
  }

  language.categories.forEach((category) => {
    // A poor man's "to title case;" all our categories are single words
    const stylizedCategory =
      category.charAt(0).toUpperCase() + category.substring(1);

    if (!(stylizedCategory in categories)) {
      categories[stylizedCategory] = [];
    }

    categories[stylizedCategory].push(language.name);
  });
});

// Sort by keys alphabetically
categories = Object.fromEntries(Object.entries(categories).sort());

fs.writeFileSync(outputCategories, JSON.stringify(categories));
