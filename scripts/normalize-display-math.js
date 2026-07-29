/* global hexo */

'use strict';

/**
 * Normalize Obsidian-style display math so markdown-it-katex can parse it.
 *
 * Problems this fixes:
 * - Mid-paragraph:  text$$E=mc^2$$more
 * - Opening mid-line, closing next line:  公式是$$...\n$$
 *
 * Strategy: outside fenced code blocks, rewrite every $$...$$ pair into a
 * standalone display block with surrounding blank lines.
 */
function protectFences(text) {
  const fences = [];
  // Fenced code: ``` or ~~~ with matching closer
  const protectedText = text.replace(
    /(^|\n)([`~]{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g,
    (match) => {
      const token = `\n%%MATH_FENCE_${fences.length}%%\n`;
      fences.push(match);
      return token;
    }
  );
  return { text: protectedText, fences };
}

function restoreFences(text, fences) {
  return text.replace(/%%MATH_FENCE_(\d+)%%/g, (_, idx) => fences[Number(idx)] || '');
}

function normalizeDisplayMath(content) {
  if (!content || content.indexOf('$$') === -1) return content;

  const { text, fences } = protectFences(content);

  // Non-greedy match of display math pairs (allows internal newlines)
  const normalized = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, inner) => {
    const math = String(inner).trim();
    if (!math) return match;
    // Already a clean multi-line block with only whitespace around? Still OK to normalize.
    return `\n\n$$\n${math}\n$$\n\n`;
  });

  // Collapse excessive blank lines introduced by normalization
  const collapsed = normalized.replace(/\n{3,}/g, '\n\n');
  return restoreFences(collapsed, fences);
}

hexo.extend.filter.register('before_post_render', (data) => {
  if (data.content) {
    data.content = normalizeDisplayMath(data.content);
  }
  return data;
});
