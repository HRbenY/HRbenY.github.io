/* global hexo */

'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function hashFile(filePath) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(filePath))
    .digest('hex')
    .slice(0, 8);
}

function appendAssetHashes(html, resolveHash) {
  if (!html) return html;
  return html.replace(
    /(<(?:link|script)\b[^>]*?\b(?:href|src)=["'])(\/(?:css|js)\/[^"'?\s#]+\.(?:css|js))(["'][^>]*>)/gi,
    (match, prefix, assetUrl, suffix) => {
      const version = resolveHash(assetUrl);
      return version ? `${prefix}${assetUrl}?v=${version}${suffix}` : match;
    }
  );
}

function createHashResolver(sourceDir, extraAssets = {}) {
  const root = path.resolve(sourceDir);
  const cache = new Map();

  return (assetUrl) => {
    let targetPath = extraAssets[assetUrl];
    if (!targetPath) {
      const rel = assetUrl.replace(/^\/+/, '');
      const candidate = path.resolve(root, rel);
      if (!candidate.startsWith(root + path.sep)) return '';
      targetPath = candidate;
    }

    try {
      const stat = fs.statSync(targetPath);
      if (!stat.isFile()) return '';
      const cached = cache.get(targetPath);
      if (cached && cached.mtimeMs === stat.mtimeMs) return cached.hash;
      const hash = hashFile(targetPath);
      cache.set(targetPath, { mtimeMs: stat.mtimeMs, hash });
      return hash;
    } catch {
      return '';
    }
  };
}

if (typeof hexo !== 'undefined') {
  const extraAssets = {
    '/js/gsap.min.js': require.resolve('gsap/dist/gsap.min.js'),
  };
  const resolveHash = createHashResolver(hexo.source_dir, extraAssets);

  hexo.extend.filter.register('after_render:html', (html) => appendAssetHashes(html, resolveHash));
}

module.exports = { appendAssetHashes, createHashResolver, hashFile };
