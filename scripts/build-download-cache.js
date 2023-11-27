const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const outputDir = path.resolve(__dirname + '/../data/');
const outputZip = path.resolve(outputDir + '/bundle-cache.zip');

const hljsSource = path.resolve(__dirname + '/../highlight.js/');
const buildSource = path.resolve(hljsSource + '/build/');

/**
 * Recursively walk a directory and return all file paths.
 *
 * @param directory {string} The directory to walk.
 * @param exclude {string[]} Filenames or directory names to exclude.
 * @param filePaths {string[]} The file paths collected so far.
 * @param options {object}
 *
 * @returns {string[]}
 */
function walkDir(directory, exclude = [], filePaths = [], options = {}) {
  const configuration = {
    onShouldIgnore: () => true,
    shouldRecurse: true,
    ...options,
  };

  fs.readdirSync(directory).forEach((filename) => {
    const filePath = path.join(directory, filename);

    if (exclude.includes(filename) && configuration.onShouldIgnore(filePath)) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      const shouldRecurse =
        configuration.shouldRecurse instanceof Function
          ? configuration.shouldRecurse(filePath)
          : configuration.shouldRecurse;

      if (shouldRecurse) {
        walkDir(filePath, exclude, filePaths, configuration);
      }
    } else {
      filePaths.push(filePath);
    }
  });

  return filePaths;
}

if (fs.existsSync(outputZip)) {
  fs.unlinkSync(outputZip);
}

const filesToZip = [];
walkDir(
  buildSource,
  ['highlight.js', 'highlight.min.js', 'languages'],
  filesToZip,
);

const archive = new JSZip().folder('highlight');

filesToZip.forEach((file) => {
  let zipPath = file.replace(buildSource, '').substring(1);
  const data = fs.readFileSync(file);

  archive.file(zipPath, data);
});

archive.file(
  'es/highlight.js',
  fs.readFileSync(path.resolve(buildSource, 'es/highlight.js'), 'utf-8'),
);
archive.file(
  'es/highlight.min.js',
  fs.readFileSync(path.resolve(buildSource, 'es/highlight.min.js'), 'utf-8'),
);

archive
  .generateNodeStream({
    type: 'nodebuffer',
    streamFiles: true,
  })
  .pipe(fs.createWriteStream(outputZip));
