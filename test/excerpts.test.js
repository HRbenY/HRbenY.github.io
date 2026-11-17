'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { excerptContent, postDesc } = require('../themes/butterfly/scripts/common/postDesc');

test('article summaries omit nested KaTeX output, code, headings and callout titles', () => {
  const rendered = '<h2>推导</h2><p>概率密度<span class="katex"><span>x</span><math><mi>x</mi></math></span>用于描述分布。</p>' +
    '<figure class="highlight"><table><tr><td><pre>const secret = 42;</pre></td></tr></table></figure>' +
    '<details><summary class="callout-title">Note</summary><div><p>核函数控制相关性。</p></div></details>';
  assert.equal(excerptContent(rendered, 110), '概率密度用于描述分布。 核函数控制相关性。');
});

test('summaries preserve readable entities without introducing HTML', () => {
  assert.equal(excerptContent('<p>A &amp; B &lt;img src=x onerror=alert(1)&gt;</p>', 110), 'A &amp; B &lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;');
});

test('descriptions take precedence and encrypted articles remain private', () => {
  const hexo = { theme: { config: { index_post_content: { method: 2, length: 110 } } } };
  assert.equal(postDesc({ description: '作者摘要', content: '<p>自动摘要</p>' }, hexo), '作者摘要');
  assert.equal(postDesc({ content: '<p>私密正文</p>', encrypt: true }, hexo), '');
  assert.equal(excerptContent('<p><img src="plot.png"><span class="katex">equation</span></p>', 110), '');
});
