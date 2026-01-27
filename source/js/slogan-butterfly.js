;(function (window, document) {
  'use strict'

  function isHome() {
    return (
      window.GLOBAL_CONFIG_SITE &&
      window.GLOBAL_CONFIG_SITE.pageType === 'home'
    )
  }

  function getSubtitleEl() {
    return document.getElementById('subtitle')
  }

  function applySubtitle(text) {
    var t = typeof text === 'string' ? text.trim() : ''
    if (!t) {
      var el = getSubtitleEl()
      if (el) el.textContent = ''
      return
    }

    if (!window.typedJSFn || typeof window.typedJSFn.run !== 'function') {
      var fallbackEl = getSubtitleEl()
      if (fallbackEl) fallbackEl.textContent = t
      return
    }

    window.typedJSFn.run(function () {
      if (window.typedJSFn && typeof window.typedJSFn.processSubtitle === 'function') {
        window.typedJSFn.processSubtitle(t)
      }
    })
  }

  function run() {
    if (!isHome()) return
    if (!getSubtitleEl()) return

    var pool = window.SpaMasterSloganPool
    if (!pool || typeof pool.getRandomText !== 'function') {
      applySubtitle('')
      return
    }

    pool
      .getRandomText({ fallbackText: '' })
      .then(function (text) {
        applySubtitle(text)
      })
      .catch(function () {
        applySubtitle('')
      })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run)
  } else {
    run()
  }

  document.addEventListener('pjax:complete', run)
})(window, document)
