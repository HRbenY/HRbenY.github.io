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

  function getTitleEl() {
    return document.getElementById('site-title')
  }

  function greetingByHour(hour) {
    if (hour >= 5 && hour < 8) return '早上好'
    if (hour >= 8 && hour < 11) return '上午好'
    if (hour >= 11 && hour < 13) return '中午好'
    if (hour >= 13 && hour < 18) return '下午好'
    if (hour >= 18 && hour < 23) return '晚上好'
    return '夜深了'
  }

  function applyGreetingTitle() {
    var titleEl = getTitleEl()
    if (!titleEl) return
    var hour = new Date().getHours()
    titleEl.textContent = greetingByHour(hour)
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
    applyGreetingTitle()
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
