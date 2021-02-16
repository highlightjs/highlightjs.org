const fs = require('fs');

const snippetsDir = __dirname + '/../snippets/';
const snippets = {};

fs.readdirSync(snippetsDir).forEach((filename) => {
  const language = filename.replace('.txt', '');
  const filePath = snippetsDir + filename;

  snippets[language] = fs.readFileSync(filePath, 'utf-8');
});

const output = __dirname + '/../data/snippets.json';
fs.writeFileSync(output, JSON.stringify(snippets));
