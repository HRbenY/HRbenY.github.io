'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { appendAssetHashes, createHashResolver } = require('../scripts/cache-bust-assets');

test('appendAssetHashes appends versions to local unversioned css and js assets only', () => {
  const html = [
    '<link rel="stylesheet" href="/css/index.css?v=5.5.4-b1">',
    '<link rel="stylesheet" href="/css/theme-palette.css">',
    '<link rel="stylesheet" href="/css/callout_blocks.css">',
    '<script src="https://cdn.example.com/lib.js"></script>',
    '<script src="/js/home-scroll.js"></script>',
    '<script src="/js/missing.js"></script>',
  ].join('\n');

  const out = appendAssetHashes(html, (url) => {
    if (url === '/css/theme-palette.css') return '1111aaaa';
    if (url === '/css/callout_blocks.css') return '2222bbbb';
    if (url === '/js/home-scroll.js') return '3333cccc';
    return '';
  });

  assert(out.includes('href="/css/index.css?v=5.5.4-b1"'));
  assert(out.includes('href="/css/theme-palette.css?v=1111aaaa"'));
  assert(out.includes('href="/css/callout_blocks.css?v=2222bbbb"'));
  assert(out.includes('src="https://cdn.example.com/lib.js"'));
  assert(out.includes('src="/js/home-scroll.js?v=3333cccc"'));
  assert(out.includes('src="/js/missing.js"'));
});

test('createHashResolver computes deterministic hashes for source assets and gsap', () => {
  const resolveHash = createHashResolver(path.resolve(__dirname, '../source'), {
    '/js/gsap.min.js': require.resolve('gsap/dist/gsap.min.js'),
  });

  assert.match(resolveHash('/css/theme-palette.css'), /^[0-9a-f]{8}$/);
  assert.match(resolveHash('/js/home-scroll.js'), /^[0-9a-f]{8}$/);
  assert.match(resolveHash('/js/gsap.min.js'), /^[0-9a-f]{8}$/);
  assert.equal(resolveHash('/css/../package.json'), '');
});
