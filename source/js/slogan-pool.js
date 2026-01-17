;(function (window) {
  'use strict'

  var GLOBAL_KEY = 'SpaMasterSloganPool'

  function nowMs() {
    return Date.now ? Date.now() : new Date().getTime()
  }

  function toArray(value) {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }

  function quoteId(value) {
    return String(value || '').trim()
  }

  function withTimeout(promise, timeoutMs) {
    if (!timeoutMs || timeoutMs <= 0) return promise
    var timeout
    return Promise.race([
      promise,
      new Promise(function (resolve) {
        timeout = setTimeout(function () {
          resolve(null)
        }, timeoutMs)
      })
    ]).finally(function () {
      if (timeout) clearTimeout(timeout)
    })
  }

  function safeGetTexts(provider, ctx) {
    return Promise.resolve()
      .then(function () {
        return withTimeout(Promise.resolve(provider.getTexts(ctx)), provider.timeoutMs)
      })
      .then(function (result) {
        if (!result) return []
        return toArray(result).filter(function (t) {
          return typeof t === 'string' && t.trim()
        })
      })
      .catch(function () {
        return []
      })
  }

  function pickRandom(items) {
    if (!items || items.length === 0) return ''
    return items[Math.floor(Math.random() * items.length)]
  }

  var existing = window[GLOBAL_KEY] || {}
  var providers = existing._providers || []

  function registerProvider(provider) {
    if (!provider || typeof provider !== 'object') return false
    var id = quoteId(provider.id)
    if (!id) return false
    if (typeof provider.getTexts !== 'function') return false

    var normalized = {
      id: id,
      enable: provider.enable !== false,
      timeoutMs: typeof provider.timeoutMs === 'number' ? provider.timeoutMs : 2500,
      weight: typeof provider.weight === 'number' ? provider.weight : 1,
      getTexts: provider.getTexts,
    }

    var idx = providers.findIndex(function (p) {
      return p && p.id === id
    })
    if (idx >= 0) {
      providers[idx] = normalized
    } else {
      providers.push(normalized)
    }
    return true
  }

  async function buildPool(ctx) {
    var enabled = providers.filter(function (p) {
      return p && p.enable !== false
    })
    if (enabled.length === 0) return []

    var results = await Promise.all(
      enabled.map(function (p) {
        return safeGetTexts(p, ctx)
      })
    )

    return results.reduce(function (acc, cur) {
      return acc.concat(cur || [])
    }, [])
  }

  async function getRandomText(ctx) {
    var ctxObj = ctx || {}
    var fallbackText = typeof ctxObj.fallbackText === 'string' ? ctxObj.fallbackText : ''
    var pool = await buildPool(ctxObj)
    return pickRandom(pool) || fallbackText
  }

  window[GLOBAL_KEY] = Object.assign(existing, {
    _providers: providers,
    registerProvider: registerProvider,
    buildPool: buildPool,
    getRandomText: getRandomText,
    nowMs: nowMs,
  })

  function storageGet(key) {
    try {
      var raw = window.localStorage && window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  }

  function storageSet(key, value) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (e) {}
  }

  function cacheGetText(key) {
    var cached = storageGet(key)
    if (!cached || typeof cached !== 'object') return ''
    if (!cached.expiresAt || cached.expiresAt <= nowMs()) return ''
    return typeof cached.text === 'string' ? cached.text : ''
  }

  function cacheSetText(key, text, ttlMs) {
    storageSet(key, {
      text: text,
      expiresAt: nowMs() + ttlMs,
    })
  }

  function fetchJson(url) {
    if (!('fetch' in window)) return Promise.reject(new Error('fetch unavailable'))
    return window.fetch(url, { method: 'GET', cache: 'no-store' }).then(function (res) {
      if (!res || !res.ok) throw new Error('http ' + (res ? res.status : 'unknown'))
      return res.json()
    })
  }

  function pickGeo(result) {
    if (!result || typeof result !== 'object') return null
    var lat = result.latitude
    var lon = result.longitude
    var city = typeof result.city === 'string' ? result.city.trim() : ''
    var region = typeof result.region === 'string' ? result.region.trim() : ''
    var country = typeof result.country === 'string' ? result.country.trim() : ''
    var countryName = typeof result.country_name === 'string' ? result.country_name.trim() : ''
    if (typeof lat !== 'number') lat = parseFloat(lat)
    if (typeof lon !== 'number') lon = parseFloat(lon)
    if (!isFinite(lat) || !isFinite(lon)) return null
    return { latitude: lat, longitude: lon, place: city || region || country || countryName || '' }
  }

  function fetchIpGeo() {
    var endpoints = [
      'https://ipwho.is/?fields=success,city,region,country,latitude,longitude',
      'https://ipapi.co/json/',
    ]
    var idx = 0
    function next() {
      if (idx >= endpoints.length) return Promise.resolve(null)
      var url = endpoints[idx++]
      return fetchJson(url)
        .then(function (result) {
          if (result && result.success === false) return null
          return pickGeo(result)
        })
        .catch(function () {
          return null
        })
        .then(function (geo) {
          return geo || next()
        })
    }
    return next()
  }

  function windDirText(deg) {
    var d = typeof deg === 'number' ? deg : parseFloat(deg)
    if (!isFinite(d)) return ''
    d = ((d % 360) + 360) % 360
    var dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
    return dirs[Math.round(d / 45) % 8] + '风'
  }

  function weatherCodeText(code) {
    var c = typeof code === 'number' ? code : parseInt(code, 10)
    switch (c) {
      case 0:
        return '晴'
      case 1:
        return '大部晴朗'
      case 2:
        return '多云'
      case 3:
        return '阴'
      case 45:
      case 48:
        return '雾'
      case 51:
      case 53:
      case 55:
        return '毛毛雨'
      case 56:
      case 57:
        return '冻毛毛雨'
      case 61:
        return '小雨'
      case 63:
        return '中雨'
      case 65:
        return '大雨'
      case 66:
      case 67:
        return '冻雨'
      case 71:
        return '小雪'
      case 73:
        return '中雪'
      case 75:
        return '大雪'
      case 77:
        return '雪粒'
      case 80:
        return '阵雨'
      case 81:
        return '强阵雨'
      case 82:
        return '暴雨'
      case 85:
        return '阵雪'
      case 86:
        return '强阵雪'
      case 95:
        return '雷暴'
      case 96:
      case 99:
        return '雷暴伴冰雹'
      default:
        return ''
    }
  }

  function fetchWeather(geo) {
    var lat = geo.latitude
    var lon = geo.longitude
    var url =
      'https://api.open-meteo.com/v1/forecast?latitude=' +
      encodeURIComponent(lat) +
      '&longitude=' +
      encodeURIComponent(lon) +
      '&current=temperature_2m,weather_code,wind_direction_10m&timezone=auto'
    return fetchJson(url).then(function (result) {
      var current = result && result.current
      if (!current) return null
      return {
        temperature: current.temperature_2m,
        weatherCode: current.weather_code,
        windDirection: current.wind_direction_10m,
      }
    })
  }

  registerProvider({
    id: 'weather-ip-open-meteo',
    timeoutMs: 3500,
    getTexts: function () {
      var cacheKey = 'sm_slogan_weather_v2'
      var cached = cacheGetText(cacheKey)
      if (cached && !/^天气[:：]/.test(cached)) return [cached]

      return fetchIpGeo()
        .then(function (geo) {
          if (!geo) return []
          return fetchWeather(geo)
            .then(function (w) {
              if (!w) return []
              var t = typeof w.temperature === 'number' ? Math.round(w.temperature) : parseFloat(w.temperature)
              if (!isFinite(t)) return []
              var weather = weatherCodeText(w.weatherCode)
              var wind = windDirText(w.windDirection)
              var place = geo.place || '当地'
              var text = place + '：' + t + 'C' + (weather ? ' ' + weather : '') + (wind ? ' ' + wind : '')
              cacheSetText(cacheKey, text, 20 * 60 * 1000)
              return [text]
            })
        })
        .catch(function () {
          return []
        })
    },
  })

  registerProvider({
    id: 'daily-word',
    timeoutMs: 1500,
    getTexts: function () {
      return fetchJson('/words.json?ts=' + nowMs())
        .then(function (result) {
          if (!Array.isArray(result) || result.length === 0) return []
          var item = result[Math.floor(Math.random() * result.length)]
          if (!item || typeof item !== 'object') return []
          var word = typeof item.word === 'string' ? item.word.trim() : ''
          var meaning = typeof item.meaning === 'string' ? item.meaning.trim() : ''
          if (!word) return []
          var text = word + (meaning ? '（' + meaning + '）' : '')
          return [text]
        })
        .catch(function () {
          return []
        })
    },
  })

  registerProvider({
    id: 'my-status',
    timeoutMs: 1200,
    getTexts: function () {
      return fetchJson('/status.json?ts=' + nowMs())
        .then(function (result) {
          if (!result || typeof result !== 'object') return []
          var texts = []
          if (Array.isArray(result.texts)) {
            texts = result.texts
          } else if (typeof result.text === 'string') {
            texts = [result.text]
          }
          texts = texts
            .filter(function (t) {
              return typeof t === 'string' && t.trim()
            })
            .map(function (t) {
              return t.trim()
            })
          if (texts.length === 0) return []
          var picked = texts[Math.floor(Math.random() * texts.length)]
          return [picked]
        })
        .catch(function () {
          return []
        })
    },
  })
})(window)
