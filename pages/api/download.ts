import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

import { NextApiRequest, NextApiResponse } from 'next';

import { ZipFileStructure, makeZip } from '../../utilities/zip';

const DIGEST_TEMPLATE = fs
  .readFileSync(path.resolve('./data/DIGESTS.md'), 'utf-8')
  .replace(/^\n```\n[\s\S]+?```/m, '\n```\n<!-- $DIGEST_LIST -->\n```\n');
const HLJS_CACHE = path.resolve('./data/bundle-cache.zip');

type FileSystemNode = {
  [key: string]: string | FileSystemNode;
};

export const config = {
  api: {
    responseLimit: '15mb',
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let apiVersion: number | null;
  if (
    apiVersion === undefined &&
    req.body['csrfmiddlewaretoken'] !== undefined
  ) {
    apiVersion = 1;
  } else {
    apiVersion = +req.body['api'] ?? null;
  }

  if (apiVersion === null) {
    res.status(400).json({
      status: 400,
      message: 'Could not determine API Version from the request body',
    });

    return;
  }

  let languages: string[] = [];

  try {
    if (apiVersion === 1) {
      languages = getLanguagesV1(req);
    } else if (apiVersion === 2) {
      languages = getLanguagesV2(req);
    }

    // De-duplicate any possible languages
    languages = Array.from(new Set(languages)).sort();
  } catch (e) {
    res.status(400).json({
      status: 400,
      message: e instanceof Error ? e.message : String(e),
    });

    return;
  }

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=highlight.zip');

  const zip = await makeZip(getBundle(languages, apiVersion), HLJS_CACHE);

  await pipeline(zip, res);
};

function getLanguagesV1(request: NextApiRequest): string[] {
  const contentType = 'application/x-www-form-urlencoded';

  if (request.headers['content-type'] !== contentType) {
    throw new Error(`API v1 only supports "${contentType}" as a Content-Type`);
  }

  const keys = Object.keys(request.body);
  const languages = [];

  keys.forEach((key) => {
    if (key === 'csrfmiddlewaretoken') {
      return;
    }

    languages.push(key.replace('.js', ''));
  });

  return languages;
}

function getLanguagesV2(request: NextApiRequest): string[] {
  const contentType = 'application/json';

  if (request.headers['content-type'] !== contentType) {
    throw new Error(`API v2 only supports "${contentType}" as a Content-Type`);
  }

  return request.body['languages'];
}

function getBundle(languages: string[], apiVersion: number): ZipFileStructure {
  const zipFileStructure: ZipFileStructure = {
    es: {
      languages: {},
    },
    languages: {},
  };

  const langSrcPath = path.resolve('./data/downloads/');
  const hljsBasePath = path.join(langSrcPath, 'highlight.js');
  const hljsEsBasePath = path.join(langSrcPath, 'es', 'highlight.js');
  const hljsMinBasePath = path.join(langSrcPath, 'highlight.min.js');
  const hljsEsMinBasePath = path.join(langSrcPath, 'es', 'highlight.min.js');
  const prettyLanguageSources: string[] = [
    fs.readFileSync(hljsBasePath, 'utf8'),
  ];
  const prettyEsLanguageSources: string[] = [
    fs.readFileSync(hljsEsBasePath, 'utf8'),
  ];
  const minifiedLanguageSources: string[] = [
    fs.readFileSync(hljsMinBasePath, 'utf8'),
  ];
  const minifiedEsLanguageSources: string[] = [
    fs.readFileSync(hljsEsMinBasePath, 'utf8'),
  ];

  languages.forEach((lang) => {
    let prettySrc: string;
    let prettyEsSrc: string;
    let minifiedSrc: string;
    let minifiedEsSrc: string;

    try {
      prettySrc = fs.readFileSync(path.join(langSrcPath, lang + '.js'), 'utf8');
      prettyEsSrc = fs.readFileSync(
        path.join(langSrcPath, 'es', lang + '.js'),
        'utf8',
      );
      minifiedSrc = fs.readFileSync(
        path.join(langSrcPath, lang + '.min.js'),
        'utf8',
      );
      minifiedEsSrc = fs.readFileSync(
        path.join(langSrcPath, 'es', lang + '.min.js'),
        'utf8',
      );
    } catch (e) {
      console.error(`Requested language files ${lang} not found`);

      return;
    }

    prettyLanguageSources.push(prettySrc);
    minifiedLanguageSources.push(minifiedSrc);

    zipFileStructure['es']['languages'][lang + '.js'] = prettyEsSrc;
    zipFileStructure['es']['languages'][lang + '.min.js'] = minifiedEsSrc;
    zipFileStructure['languages'][lang + '.js'] = prettySrc;
    zipFileStructure['languages'][lang + '.min.js'] = minifiedSrc;
  });

  if (apiVersion === 1) {
    // Don't append languages to keep behavior of the Django website
    zipFileStructure['highlight.js'] = fs.readFileSync(hljsBasePath, 'utf8');
  } else {
    zipFileStructure['highlight.js'] = prettyLanguageSources.join('');
  }

  zipFileStructure['highlight.min.js'] = minifiedLanguageSources.join('');

  const digests = calculateDigests(zipFileStructure);
  zipFileStructure['DIGESTS.md'] = DIGEST_TEMPLATE.replaceAll(
    '<!-- $DIGEST_LIST -->',
    digests.join('\n'),
  );

  return zipFileStructure;
}

function calculateDigests(zipFileStructure: FileSystemNode) {
  const digests = [];

  const recurseDigests = (
    structure: FileSystemNode,
    prefix: string,
    storage: typeof digests,
  ) => {
    Object.entries(structure).forEach(([partialPath, contents]) => {
      const currPath = [prefix, partialPath].join('/');

      if (typeof contents === 'string') {
        const sha = sha384(contents);

        storage.push(`${sha} ${currPath}`);
      } else {
        recurseDigests(contents, currPath, storage);
      }
    });
  };

  recurseDigests(zipFileStructure, '', digests);

  return digests;
}

function sha384(contents: string): string {
  const hash = crypto.createHash('sha384');
  const data = hash.update(contents, 'utf-8');
  const gen_hash = data.digest('base64');

  return `sha384-${gen_hash}`;
}
