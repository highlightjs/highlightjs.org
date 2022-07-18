import JSZip from 'jszip';

export interface ZipFileStructure {
  [key: string]: string | ZipFileStructure;
}

export function makeZip(contents: ZipFileStructure) {
  const zip = new JSZip();

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
