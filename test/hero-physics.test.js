'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  resistedPull,
  inputSpeed,
  springStep,
  VELOCITY_THRESHOLD,
  COLLAPSE_PULL_THRESHOLD,
  RETURN_VELOCITY_THRESHOLD,
  RETURN_PULL_THRESHOLD,
} = require('../source/js/home-scroll');

test('hero resistance limits displacement and becomes stronger with distance', () => {
  assert.equal(resistedPull(-20), 0);
  assert(resistedPull(100) > 0);
  assert(resistedPull(10000) <= 96);
  assert(resistedPull(200) - resistedPull(100) < resistedPull(100));
});

test('slow wheel ticks stay below threshold while brisk scrolling triggers collapse', () => {
  let slow = 0;
  for (let i = 0; i < 6; i++) slow = inputSpeed(80, 100, slow);
  assert(slow < VELOCITY_THRESHOLD);

  const fast1 = inputSpeed(140, 24, 0);
  const fast2 = inputSpeed(140, 24, fast1);
  assert(fast2 > VELOCITY_THRESHOLD);
  assert(COLLAPSE_PULL_THRESHOLD > 0);
});

test('the released hero returns smoothly with damping and zero overshoot', () => {
  let position = 64;
  let velocity = 0;
  for (let i = 0; i < 180; i++) {
    ({ position, velocity } = springStep(position, velocity, 0, 1 / 60));
    assert(Number.isFinite(position));
    assert(position >= 0, `unexpected overshoot below 0: ${position}`);
  }
  assert(Math.abs(position) < .01);
  assert(Math.abs(velocity) < .01);
});

test('returning to the hero requires a distinctly stronger upward gesture', () => {
  assert(RETURN_VELOCITY_THRESHOLD > VELOCITY_THRESHOLD);
  assert(RETURN_PULL_THRESHOLD > COLLAPSE_PULL_THRESHOLD);
  let ordinary = 0;
  for (let i = 0; i < 10; i++) ordinary = inputSpeed(120, 80, ordinary);
  assert(ordinary < RETURN_VELOCITY_THRESHOLD);
  const fast = inputSpeed(260, 20, 0);
  assert(inputSpeed(260, 20, fast) > RETURN_VELOCITY_THRESHOLD);
});
