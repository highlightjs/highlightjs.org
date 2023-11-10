import fs from 'fs';
import JSZip from 'jszip';

export interface ZipFileStructure {
  [key: string]: string | ZipFileStructure;
}

export async function makeZip(contents: ZipFileStructure, baseZipFile = null) {
  let zip: JSZip;

  if (baseZipFile === null) {
    zip = new JSZip();
  } else {
    zip = await JSZip.loadAsync(fs.readFileSync(baseZipFile));
  }

  recurseZip(contents, zip);

  return zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true });
}

function recurseZip(directory: ZipFileStructure, zip: JSZip) {
  Object.entries(directory).forEach(([name, content]) => {
    if (typeof content === 'string') {
      zip.file(name, content);
    } else {
      recurseZip(content, zip.folder(name));
    }
  });
}
