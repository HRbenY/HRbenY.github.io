/* global hexo */

'use strict';

function normalizeTag(tag) {
  if (tag == null) return '';
  let text = String(tag).trim();
  if (!text) return '';
  return text.replace(/^#+/, '');
}

function normalizeTags(tags) {
  const seen = new Set();
  const result = [];

  for (const tag of tags) {
    const normalized = normalizeTag(tag);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

hexo.extend.filter.register('before_generate', function () {
  const posts = hexo.locals.get('posts');
  if (!posts || posts.length === 0) return;

  const updates = [];

  posts.toArray().forEach((post) => {
    if (!post.tags || post.tags.length === 0) return;
    const rawTags = post.tags.toArray().map((tag) => tag.name);
    const normalized = normalizeTags(rawTags);
    const unchanged =
      normalized.length === rawTags.length &&
      normalized.every((tag, index) => tag === rawTags[index]);

    if (!unchanged) {
      updates.push(post.setTags(normalized));
    }
  });

  if (updates.length === 0) return;
  return Promise.all(updates);
});
