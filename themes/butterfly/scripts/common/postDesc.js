'use strict'

const { stripHTML, truncate, escapeHTML } = require('hexo-util')
const { Parser } = require('htmlparser2')

const truncateContent = (content, length, encrypt = false) => {
  if (!content || encrypt) return ''
  return truncate(stripHTML(content).replace(/\n/g, ' '), { length })
}

// Ignore rendered math and code so excerpts contain prose rather than KaTeX internals.
const excerptContent = (content, length, encrypt = false) => {
  if (!content || encrypt) return ''
  const excluded = new Set(['script', 'style', 'pre', 'figure', 'svg', 'math', 'table', 'summary', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
  let skipped = 0
  let text = ''
  const parser = new Parser({
    onopentag (name, attrs) {
      if (skipped || excluded.has(name) || /\b(katex|callout-title)\b/.test(attrs.class || '')) {
        skipped++
      } else if (['p', 'li', 'br', 'div'].includes(name)) {
        text += ' '
      }
    },
    ontext (value) {
      if (!skipped) text += value
    },
    onclosetag (name) {
      if (skipped) skipped--
      else if (['p', 'li', 'div'].includes(name)) text += ' '
    }
  }, { decodeEntities: true })
  parser.end(content)
  return escapeHTML(truncate(text.replace(/\s+/g, ' ').trim(), { length }))
}

const postDesc = (data, hexo) => {
  const { description, content, postDesc, encrypt } = data
  if (postDesc) return postDesc
  const { length, method } = hexo.theme.config.index_post_content
  if (method === false) return

  const source = method === 1 ? description : method === 2 ? description || content : content
  const result = excerptContent(source, length, encrypt)
  data.postDesc = result
  return result
}

module.exports = { truncateContent, excerptContent, postDesc }
