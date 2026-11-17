'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { resistedPull, inputSpeed, springStep, VELOCITY_THRESHOLD, RETURN_VELOCITY_THRESHOLD } = require('../source/js/home-scroll');

test('hero resistance limits displacement and becomes stronger with distance', () => {
  assert.equal(resistedPull(-20), 0);
  assert(resistedPull(100) > 0);
  assert(resistedPull(10000) <= 64);
  assert(resistedPull(200) - resistedPull(100) < resistedPull(100));
});

test('the same wheel distance triggers the gate only when input is fast', () => {
  const first = inputSpeed(100, 50, 0);
  const second = inputSpeed(100, 16, first);
  assert(first < VELOCITY_THRESHOLD);
  assert(second < VELOCITY_THRESHOLD);
  assert(inputSpeed(100, 16, second) > VELOCITY_THRESHOLD);
  assert(inputSpeed(100, 80, first) < VELOCITY_THRESHOLD);
});

test('the released hero springs back with a small overshoot and settles', () => {
  let position = 40;
  let velocity = 0;
  let overshoot = false;
  for (let i = 0; i < 180; i++) {
    ({ position, velocity } = springStep(position, velocity, 0, 1 / 60));
    if (position < 0) overshoot = true;
    assert(Number.isFinite(position));
  }
  assert(overshoot);
  assert(Math.abs(position) < .01);
  assert(Math.abs(velocity) < .01);
});

test('returning to the hero requires a much stronger upward gesture', () => {
  assert(RETURN_VELOCITY_THRESHOLD > VELOCITY_THRESHOLD);
  let ordinary = 0;
  for (let i = 0; i < 10; i++) ordinary = inputSpeed(120, 80, ordinary);
  assert(ordinary < RETURN_VELOCITY_THRESHOLD);
  const fast = inputSpeed(480, 50, 0);
  assert(fast < RETURN_VELOCITY_THRESHOLD);
  assert(inputSpeed(480, 16, fast) > RETURN_VELOCITY_THRESHOLD);
});
