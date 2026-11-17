;(function () {
  'use strict'

  const VELOCITY_THRESHOLD = 1.45
  const COLLAPSE_PULL_THRESHOLD = 220
  const RETURN_VELOCITY_THRESHOLD = 2.6
  const RETURN_PULL_THRESHOLD = 380
  const RETURN_SETTLE_MS = 450
  const INERTIA_GAP_MS = 140
  const TRANSITION_DURATION = 1.5

  function resistedPull(distance, maxPull = 96) {
    return maxPull * (1 - Math.exp(-Math.max(0, distance) / 220))
  }

  function inputSpeed(delta, elapsed, previous) {
    return previous * .65 + .35 * Math.max(0, delta) / Math.max(16, Math.min(80, elapsed))
  }

  function springStep(position, velocity, target, dt) {
    // Slightly overdamped spring (zeta > 1) keeps elastic pull without tail bounce.
    velocity += (180 * (target - position) - 32 * velocity) * dt
    const next = position + velocity * dt
    if (target === 0 && next <= 0) {
      return { position: 0, velocity: 0 }
    }
    return { position: next, velocity }
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = {
      resistedPull,
      inputSpeed,
      springStep,
      VELOCITY_THRESHOLD,
      COLLAPSE_PULL_THRESHOLD,
      RETURN_VELOCITY_THRESHOLD,
      RETURN_PULL_THRESHOLD,
    }
    return
  }

  const hero = document.querySelector('#page-header.full_page')
  const content = document.getElementById('content-inner')
  const gsap = window.gsap
  if (!hero || !content || !gsap) return

  const info = document.getElementById('site-info')
  const cue = document.getElementById('home-scroll-cue')
  const nav = document.getElementById('nav')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function navHeight() {
    return nav ? nav.offsetHeight : 70
  }

  let fullHeight = window.innerHeight
  let state = 'hero'
  let springMode = 'hero'
  let position = 0
  let velocity = 0
  let target = 0
  let distance = 0
  let speed = 0
  let lastInput = 0
  let lastFrame = 0
  let frame = 0
  let releaseTimer
  let touchY = null
  let touchStartedAtTop = false
  let lastScroll = window.scrollY
  let returnDistance = 0
  let returnSpeed = 0
  let lastReturnInput = 0
  let topReachedAt = 0
  let lastTopWheelAt = 0
  let inertiaBlocking = false

  hero.classList.add('hero-interactive')

  function setState(next) {
    state = next
    hero.dataset.heroState = next
  }

  if (window.scrollY > 1 || location.hash === '#content-inner' || location.hash === '#recent-posts') {
    hero.classList.add('hero-collapsed')
    gsap.set(hero, { height: navHeight() })
    if (info || cue) gsap.set([info, cue].filter(Boolean), { autoAlpha: 0 })
    setState('content')
  } else {
    setState('hero')
  }

  function stopSpring() {
    window.cancelAnimationFrame(frame)
    window.clearTimeout(releaseTimer)
    frame = 0
    position = velocity = target = 0
    distance = speed = lastInput = 0
    returnDistance = returnSpeed = lastReturnInput = 0
  }

  function applySpringVisual(pos) {
    if (springMode === 'peek') {
      gsap.set(hero, { height: navHeight() + pos })
      return
    }
    gsap.set(hero, { height: fullHeight - pos })
    if (info) gsap.set(info, { y: -pos * .25 })
  }

  function springFrame(now) {
    const dt = Math.min((now - lastFrame) / 1000, 1 / 30)
    lastFrame = now
    const next = springStep(position, velocity, target, dt)
    position = next.position
    velocity = next.velocity
    applySpringVisual(position)
    if (Math.abs(position - target) < .05 && Math.abs(velocity) < .1) {
      position = target
      velocity = 0
      applySpringVisual(target)
      frame = 0
    } else {
      frame = window.requestAnimationFrame(springFrame)
    }
  }

  function startSpring(mode) {
    if (mode) springMode = mode
    if (frame) return
    lastFrame = performance.now()
    frame = window.requestAnimationFrame(springFrame)
  }

  function releasePullNow() {
    window.clearTimeout(releaseTimer)
    if (state === 'hero') {
      distance = speed = lastInput = target = 0
      if (position > 0 || frame) startSpring('hero')
    } else if (state === 'content') {
      returnDistance = returnSpeed = lastReturnInput = target = 0
      if (position > 0 || frame) startSpring('peek')
    }
  }

  function collapseHero() {
    if (state !== 'hero') return
    stopSpring()
    setState('collapsing')
    const dur = reducedMotion ? 0 : TRANSITION_DURATION
    const fadeElems = [info, cue].filter(Boolean)
    gsap.set(content, { autoAlpha: 0, y: 28 })
    const tl = gsap.timeline({
      onComplete: function () {
        hero.classList.add('hero-collapsed')
        gsap.set(hero, { height: navHeight() })
        gsap.set(content, { clearProps: 'transform,opacity,visibility' })
        lastScroll = window.scrollY
        inertiaBlocking = false
        setState('content')
      }
    })
    if (fadeElems.length) {
      tl.to(fadeElems, { autoAlpha: 0, y: -28, duration: reducedMotion ? 0 : .32, ease: 'power3.out' }, 0)
    }
    tl.to(hero, { height: navHeight(), duration: dur, ease: 'power4.out' }, 0)
      .to(content, { autoAlpha: 1, y: 0, duration: reducedMotion ? 0 : .95, ease: 'power3.out' }, reducedMotion ? 0 : .15)
      .add(function () { hero.classList.add('hero-collapsed') }, reducedMotion ? 0 : .38)
  }

  function expandHero() {
    if (state !== 'content') return
    stopSpring()
    setState('expanding')
    hero.classList.remove('hero-collapsed')
    const dur = reducedMotion ? 0 : TRANSITION_DURATION
    const fadeElems = [info, cue].filter(Boolean)
    const tl = gsap.timeline({
      onComplete: function () {
        gsap.set(hero, { height: fullHeight })
        gsap.set([content].concat(fadeElems), { clearProps: 'transform,opacity,visibility' })
        lastScroll = window.scrollY
        setState('hero')
      }
    })
    tl.to(content, { autoAlpha: 0, y: 24, duration: reducedMotion ? 0 : .28, ease: 'power2.out' }, 0)
      .to(hero, { height: fullHeight, duration: dur, ease: 'power4.out' }, 0)
    if (fadeElems.length) {
      tl.to(fadeElems, { autoAlpha: 1, y: 0, duration: reducedMotion ? 0 : .85, ease: 'power3.out' }, reducedMotion ? 0 : .28)
    }
  }

  function applyInput(delta) {
    const now = performance.now()
    if (now - lastInput > 200) speed = distance = 0
    const elapsed = lastInput ? now - lastInput : 50
    lastInput = now
    if (delta > 0) {
      speed = inputSpeed(delta, elapsed, speed)
    } else {
      speed *= .65
    }
    distance = Math.max(0, distance + delta)
    if (delta > 0 && (reducedMotion || speed > VELOCITY_THRESHOLD || distance >= COLLAPSE_PULL_THRESHOLD)) {
      collapseHero()
      return
    }
    target = resistedPull(distance, 96)
    startSpring('hero')
    window.clearTimeout(releaseTimer)
    releaseTimer = window.setTimeout(releasePullNow, 160)
  }

  function applyReturnInput(pullDelta) {
    const now = performance.now()
    if (now - lastReturnInput > 220) returnSpeed = returnDistance = 0
    const elapsed = lastReturnInput ? now - lastReturnInput : 50
    lastReturnInput = now
    if (pullDelta > 0) {
      returnSpeed = inputSpeed(pullDelta, elapsed, returnSpeed)
    } else {
      returnSpeed *= .65
    }
    returnDistance = Math.max(0, returnDistance + pullDelta)
    if (pullDelta > 0 && (returnSpeed > RETURN_VELOCITY_THRESHOLD || returnDistance >= RETURN_PULL_THRESHOLD)) {
      expandHero()
      return
    }
    target = resistedPull(returnDistance, 84)
    startSpring('peek')
    window.clearTimeout(releaseTimer)
    releaseTimer = window.setTimeout(releasePullNow, 160)
  }

  function markTopArrival(now) {
    topReachedAt = now
    lastTopWheelAt = now
    inertiaBlocking = true
  }

  window.addEventListener('wheel', function (event) {
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    if (document.body.style.overflow === 'hidden') return
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? fullHeight : 1
    const rawDelta = event.deltaY * unit

    if (state === 'content') {
      const now = performance.now()
      if (window.scrollY > 1) {
        lastScroll = window.scrollY
        return
      }
      if (lastScroll > 1) {
        lastScroll = window.scrollY
        markTopArrival(now)
      }
      if (rawDelta < 0) {
        if (inertiaBlocking) {
          if (now - topReachedAt >= RETURN_SETTLE_MS && now - lastTopWheelAt >= INERTIA_GAP_MS) {
            inertiaBlocking = false
          } else {
            lastTopWheelAt = now
            event.preventDefault()
            return
          }
        }
        event.preventDefault()
        applyReturnInput(-rawDelta)
      } else if (rawDelta > 0 && (position > .5 || target > .5)) {
        event.preventDefault()
        applyReturnInput(-rawDelta)
      }
      return
    }

    if (state === 'collapsing' || state === 'expanding') {
      event.preventDefault()
      return
    }

    if (window.scrollY > 1) return
    if (rawDelta < 0 && position <= .5 && target <= .5) return
    event.preventDefault()
    applyInput(rawDelta)
  }, { passive: false })

  window.addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1) {
      touchY = null
      touchStartedAtTop = false
      return
    }
    touchStartedAtTop = window.scrollY <= 1
    touchY = touchStartedAtTop ? event.touches[0].clientY : null
  }, { passive: true })

  window.addEventListener('touchmove', function (event) {
    if (event.touches.length !== 1 || document.body.style.overflow === 'hidden') return
    if (state === 'collapsing' || state === 'expanding') {
      event.preventDefault()
      return
    }
    if (touchY === null || window.scrollY > 1) return
    const nextY = event.touches[0].clientY
    const delta = touchY - nextY
    touchY = nextY
    if (state === 'content') {
      if (!touchStartedAtTop) return
      if (delta < 0 || position > .5 || target > .5) {
        event.preventDefault()
        applyReturnInput(-delta)
      }
      return
    }
    if (delta < 0 && position <= .5 && target <= .5) return
    event.preventDefault()
    applyInput(delta)
  }, { passive: false })

  function endTouch() {
    touchY = null
    touchStartedAtTop = false
    releasePullNow()
  }

  window.addEventListener('touchend', endTouch, { passive: true })
  window.addEventListener('touchcancel', endTouch, { passive: true })

  window.addEventListener('keydown', function (event) {
    if (state !== 'hero' || window.scrollY > 1) return
    const tag = event.target && event.target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (event.target && event.target.isContentEditable)) return
    if (event.key === 'PageDown' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      collapseHero()
    }
  })

  if (cue) {
    cue.addEventListener('click', function (event) {
      event.preventDefault()
      collapseHero()
    })
  }

  window.addEventListener('scroll', function () {
    const y = window.scrollY
    if (state === 'content') {
      if (y <= 1 && lastScroll > 1) {
        markTopArrival(performance.now())
      } else if (y > 1) {
        inertiaBlocking = false
        if (position > 0 || target > 0) releasePullNow()
      }
    }
    lastScroll = y
  }, { passive: true })

  window.addEventListener('resize', function () {
    fullHeight = window.innerHeight
    if (state === 'hero') {
      stopSpring()
      gsap.set(hero, { height: fullHeight })
      if (info) gsap.set(info, { y: 0 })
    } else if (state === 'content') {
      stopSpring()
      gsap.set(hero, { height: navHeight() })
    }
  }, { passive: true })
})()
