/* global hexo */

'use strict';

const fs = require('fs');
const path = require('path');

hexo.extend.generator.register('root-json-assets', function () {
  const filenames = ['words.json', 'status.json'];
  const generated = [];

  for (const filename of filenames) {
    const fullPath = path.join(hexo.base_dir, filename);
    try {
      if (!fs.existsSync(fullPath)) {
        hexo.log.warn(`[root-json-assets] Missing ${filename}, skip.`);
        continue;
      }
      generated.push({
        path: filename,
        data: fs.readFileSync(fullPath),
      });
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      hexo.log.warn(`[root-json-assets] Failed to read ${filename}, skip: ${msg}`);
    }
  }

  return generated;
});

