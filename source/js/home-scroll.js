;(function () {
  'use strict'

  const VELOCITY_THRESHOLD = 2.8
  const RETURN_VELOCITY_THRESHOLD = 5.5

  function resistedPull(distance) {
    return 64 * (1 - Math.exp(-Math.max(0, distance) / 240))
  }

  function inputSpeed(delta, elapsed, previous) {
    return previous * .65 + .35 * delta / Math.max(16, Math.min(80, elapsed))
  }

  function springStep(position, velocity, target, dt) {
    velocity += (180 * (target - position) - 20 * velocity) * dt
    return { position: position + velocity * dt, velocity }
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { resistedPull, inputSpeed, springStep, VELOCITY_THRESHOLD, RETURN_VELOCITY_THRESHOLD }
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
  let fullHeight = window.innerHeight
  let state = 'hero'
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
  let lastScroll = window.scrollY
  let returnSpeed = 0
  let lastReturnInput = 0
  let returnReadyAt = 0

  hero.classList.add('hero-interactive')
  hero.dataset.heroState = state

  function setState(next) {
    state = next
    hero.dataset.heroState = next
  }

  function stopSpring() {
    window.cancelAnimationFrame(frame)
    window.clearTimeout(releaseTimer)
    frame = 0
    position = velocity = target = distance = speed = lastInput = 0
  }

  function springFrame(now) {
    const dt = Math.min((now - lastFrame) / 1000, 1 / 30)
    lastFrame = now
    const next = springStep(position, velocity, target, dt)
    position = next.position
    velocity = next.velocity
    gsap.set(hero, { height: fullHeight - position })
    gsap.set(info, { y: -position * .25 })
    if (Math.abs(position - target) < .05 && Math.abs(velocity) < .1) {
      gsap.set(hero, { height: fullHeight - target })
      gsap.set(info, { y: -target * .25 })
      frame = 0
    } else {
      frame = window.requestAnimationFrame(springFrame)
    }
  }

  function startSpring() {
    if (frame) return
    lastFrame = performance.now()
    frame = window.requestAnimationFrame(springFrame)
  }

  function collapseHero() {
    if (state !== 'hero') return
    stopSpring()
    setState('collapsing')
    gsap.set(content, { autoAlpha: 0, y: 42 })
    gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: function () {
        hero.classList.add('hero-collapsed')
        gsap.set(hero, { height: nav.offsetHeight })
        gsap.set(content, { clearProps: 'transform,opacity,visibility' })
        lastScroll = window.scrollY
        returnSpeed = lastReturnInput = 0
        returnReadyAt = performance.now() + 220
        setState('content')
      }
    })
      .to([info, cue], { autoAlpha: 0, y: -38, duration: reducedMotion ? 0 : .24 }, 0)
      .to(hero, { height: nav.offsetHeight, duration: reducedMotion ? 0 : 1.18, ease: 'back.out(0.6)' }, 0)
      .to(content, { autoAlpha: 1, y: 0, duration: reducedMotion ? 0 : .8 }, reducedMotion ? 0 : .24)
      .add(function () { hero.classList.add('hero-collapsed') }, reducedMotion ? 0 : .45)
  }

  function expandHero() {
    if (state !== 'content') return
    stopSpring()
    setState('expanding')
    hero.classList.remove('hero-collapsed')
    gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: function () {
        gsap.set(hero, { height: fullHeight })
        gsap.set([content, info, cue], { clearProps: 'transform,opacity,visibility' })
        setState('hero')
      }
    })
      .to(content, { autoAlpha: 0, y: 28, duration: reducedMotion ? 0 : .2 }, 0)
      .to(hero, { height: fullHeight, duration: reducedMotion ? 0 : 1.18, ease: 'back.out(0.6)' }, 0)
      .to([info, cue], { autoAlpha: 1, y: 0, duration: reducedMotion ? 0 : .75 }, reducedMotion ? 0 : .24)
  }

  function applyInput(delta) {
    const now = performance.now()
    if (now - lastInput > 180) speed = distance = 0
    const elapsed = lastInput ? now - lastInput : 50
    lastInput = now
    speed = inputSpeed(delta, elapsed, speed)
    distance = Math.max(0, distance + delta)
    if (delta > 0 && (reducedMotion || speed > VELOCITY_THRESHOLD)) {
      collapseHero()
      return
    }
    target = resistedPull(distance)
    startSpring()
    window.clearTimeout(releaseTimer)
    releaseTimer = window.setTimeout(function () {
      distance = speed = lastInput = target = 0
      if (state === 'hero') startSpring()
    }, 100)
  }

  function tryReturnToHero(delta) {
    const now = performance.now()
    if (now < returnReadyAt) return
    const elapsed = lastReturnInput ? now - lastReturnInput : 50
    if (elapsed > 180) returnSpeed = 0
    returnSpeed = inputSpeed(-delta, elapsed, returnSpeed)
    lastReturnInput = now
    if (returnSpeed > RETURN_VELOCITY_THRESHOLD) expandHero()
  }

  window.addEventListener('wheel', function (event) {
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    if (document.body.style.overflow === 'hidden') return
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? fullHeight : 1
    if (state === 'content') {
      if (event.deltaY < 0 && window.scrollY <= 1) {
        event.preventDefault()
        tryReturnToHero(event.deltaY * unit)
      }
      return
    }
    if (state === 'collapsing' || state === 'expanding') {
      event.preventDefault()
      return
    }
    if (window.scrollY > 1 || !hero.contains(event.target)) return
    event.preventDefault()
    applyInput(event.deltaY * unit)
  }, { passive: false })

  window.addEventListener('touchstart', function (event) {
    touchY = event.touches.length === 1 && window.scrollY <= 1 ? event.touches[0].clientY : null
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
      if (delta < 0) { event.preventDefault(); tryReturnToHero(delta) }
      return
    }
    event.preventDefault()
    applyInput(delta)
  }, { passive: false })
  window.addEventListener('touchend', function () { touchY = null }, { passive: true })
  window.addEventListener('touchcancel', function () { touchY = null }, { passive: true })

  cue.addEventListener('click', function (event) { event.preventDefault(); collapseHero() })
  window.addEventListener('scroll', function () {
    const y = window.scrollY
    if (state === 'content') {
      if (y <= 1 && lastScroll > 1) returnReadyAt = performance.now() + 220
      if (y > 1 || lastScroll > 1) returnSpeed = lastReturnInput = 0
    }
    lastScroll = y
  }, { passive: true })
  window.addEventListener('resize', function () {
    fullHeight = window.innerHeight
    if (state === 'hero') {
      stopSpring()
      gsap.set(hero, { height: fullHeight })
      gsap.set(info, { y: 0 })
    } else if (state === 'content') {
      gsap.set(hero, { height: nav.offsetHeight })
    }
  }, { passive: true })
})()
