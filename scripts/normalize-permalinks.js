/* global hexo */

'use strict';

const { extname } = require('path');

// Run before hexo-filter-titlebased-link caches URLs at priority 25.
hexo.extend.filter.register('post_permalink', (permalink) => {
  if (permalink.endsWith('/') || extname(permalink)) return permalink;
  return `${permalink}/`;
}, 20);
