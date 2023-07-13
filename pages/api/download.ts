import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

import { NextApiRequest, NextApiResponse } from 'next';

import { makeZip } from '../../utilities/zip';

const HLJS_CACHE = path.resolve('./data/bundle-cache.zip');

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

  const langBundle = getMinifiedBundle(languages);
  const zip = await makeZip(
    {
      '/highlight.min.js': langBundle,
    },
    HLJS_CACHE,
  );

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

function getMinifiedBundle(languages: string[]): string {
  const langSrcPath = path.resolve('./data/downloads/');
  const hljsBasePath = path.join(langSrcPath, 'highlight.min.js');
  const languageSources: string[] = [fs.readFileSync(hljsBasePath, 'utf8')];

  languages.forEach((lang) => {
    let src: string;

    try {
      src = fs.readFileSync(path.join(langSrcPath, lang + '.min.js'), 'utf8');
    } catch (e) {
      console.error(`Requested language not found: ${lang}`);

      return;
    }

    languageSources.push(src);
  });

  return languageSources.join('');
}
