'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const Hexo = require('hexo');

test('article routes and wikilinks use HTML paths', async () => {
  const hexo = new Hexo(path.resolve(__dirname, '..'), { silent: true });
  hexo.extend.filter.register('post_permalink', require('hexo/dist/plugins/filter/post_permalink'));
  hexo.config.titlebased_link = { enable: true };
  await hexo.loadPlugin(require.resolve('hexo-filter-titlebased-link'));
  await hexo.loadPlugin(path.resolve(__dirname, '../scripts/normalize-permalinks.js'));

  const cases = [
    ['CS61C', 'CS61C/', 'CS61C/index.html'],
    ['roi-flow', 'roi-flow/', 'roi-flow/index.html'],
    ['/roi-flow', 'roi-flow/', 'roi-flow/index.html'],
    ['notes/v1.2/example', 'notes/v1.2/example/', 'notes/v1.2/example/index.html'],
    ['CS61C/', 'CS61C/', 'CS61C/index.html'],
    ['example.html', 'example.html', 'example.html'],
    ['notes/example.htm', 'notes/example.htm', 'notes/example.htm'],
    [undefined, '2026/11/13/permalink-fixture/', '2026/11/13/permalink-fixture/index.html']
  ];

  for (const [permalink, expectedLink, expectedFile] of cases) {
    const post = await hexo.model('Post').insert({
      title: 'Permalink fixture',
      source: '_posts/permalink-fixture.md',
      slug: 'permalink-fixture',
      date: new Date(2026, 10, 13, 12),
      __permalink: permalink
    });

    assert.equal(post.path, expectedLink, `article path for ${permalink}`);
    assert.equal(hexo.route.format(post.path), expectedFile, `output file for ${permalink}`);

    const rendered = await hexo.execFilter('before_post_render', {
      content: '[[permalink-fixture]]'
    }, { context: hexo });
    assert.ok(rendered.content.includes(`href="/${expectedLink}"`), `wikilink for ${permalink}`);
  }
});
