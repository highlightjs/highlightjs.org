const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const hljsSrc = path.resolve(__dirname + '/../highlight.js/build/');
const outputDir = path.resolve(__dirname + '/../data/');
const outputZip = path.resolve(outputDir + '/bundle-cache.zip');

/**
 * Recursively walk a directory and return all file paths.
 *
 * @param directory {string} The directory to walk.
 * @param exclude {string[]} Filenames or directory names to exclude.
 * @param filePaths {string[]} The file paths collected so far.
 *
 * @returns {string[]}
 */
function walkDir(directory, exclude = [], filePaths = []) {
  fs.readdirSync(directory).forEach((filename) => {
    const filePath = path.join(directory, filename);

    if (exclude.includes(filename)) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, exclude, filePaths);
    } else {
      filePaths.push(filePath);
    }
  });

  return filePaths;
}

if (fs.existsSync(outputZip)) {
  fs.unlinkSync(outputZip);
}

const files = walkDir(hljsSrc, ['languages']);
const archive = new JSZip().folder('highlight');

files.forEach((file) => {
  const zipPath = file.replace(hljsSrc, '').substring(1);
  const data = fs.readFileSync(file);

  archive.file(zipPath, data);
});

archive
  .generateNodeStream({
    type: 'nodebuffer',
    streamFiles: true,
  })
  .pipe(fs.createWriteStream(outputZip));
