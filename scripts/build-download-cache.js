const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const hljsSrc = path.resolve(__dirname + '/../highlight.js/build/');
const outputDir = path.resolve(__dirname + '/../data/');
const outputZip = path.resolve(outputDir + '/bundle-cache.zip');

function walkDir(directory, filePaths = []) {
  fs.readdirSync(directory).forEach((filename) => {
    const filePath = path.join(directory, filename);

    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, filePaths);
    } else {
      filePaths.push(filePath);
    }
  });

  return filePaths;
}

if (fs.existsSync(outputZip)) {
  fs.unlinkSync(outputZip);
}

const files = walkDir(hljsSrc);
const archive = new JSZip().folder('highlight');

files.forEach((file) => {
  const zipPath = file.replace(hljsSrc, '');
  const data = fs.readFileSync(file);

  archive.file(zipPath, data);
});

archive
  .generateNodeStream({
    type: 'nodebuffer',
    streamFiles: true,
  })
  .pipe(fs.createWriteStream(outputZip));
