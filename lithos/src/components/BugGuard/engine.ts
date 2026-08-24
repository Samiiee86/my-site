/**
 * Kane runs, bugs come at him, and you jump *onto* them to squash them.
 *
 * The stomp rule is the classic one: touch a bug while falling and you kill it
 * and bounce; touch it on the way up or on the ground and the run is over.
 * That makes the timing generous — the whole descent counts — while still
 * punishing a jump left too late.
 *
 * Everything is in blocks and seconds, so the numbers hold at any screen size.
 */

import { BUG_H, BUG_W, KANE_W, clusterWidth } from "./sprites";

export type Phase = "idle" | "playing" | "over";

export type Bug = { x: number; count: number; dying: number };
export type Cloud = { x: number; row: number; drift: number };

export type World = {
  phase: Phase;
  /** blocks travelled — scrolls the ground and feeds the score */
  distance: number;
  stomps: number;
  score: number;
  best: number;
  speed: number;
  /** Kane's live column. -1 until the first frame gives us the layout. */
  x: number;
  /** -1, 0 or 1 — whichever way the player is holding */
  moveDir: number;
  /** blocks above the ground */
  lift: number;
  /** blocks per second, upward positive */
  vy: number;
  bugs: Bug[];
  clouds: Cloud[];
  spawnIn: number;
  cloudIn: number;
  clock: number;
  overFor: number;
  /** counts down after a stomp, for a flash of feedback */
  pop: number;
  /** a press made just before landing still jumps, so inputs never feel eaten */
  buffer: number;
};

export type Bounds = {
  cols: number;
  rows: number;
  groundY: number;
  /** Kane's left edge, lined up with the footer content above him. */
  kaneX: number;
  /** First row clouds may occupy — keeps them from drifting behind the score. */
  skyTop: number;
};

const START_SPEED = 56; // blocks per second
const MAX_SPEED = 104;
const SPEED_GAIN = 0.016; // per block travelled
/**
 * Twice the height of the old jump, with the airtime deliberately unchanged:
 * doubling gravity and the launch speed together keeps the arc feeling the
 * same while Kane clears roughly 19 blocks instead of 10.
 */
const GRAVITY = 190; // blocks per second squared
const JUMP_V = 84;
/** A stomp throws you back up, so bugs can be chained. */
const BOUNCE = 0.62;
/** Below this height a touch counts as running into the bug, not landing on it. */
const STOMP_FLOOR = 1;
const POINTS_PER_STOMP = 25;
const POINTS_PER_BLOCK = 0.15;
/** Fallback distance from the left edge, if there is nothing to line up with. */
export const KANE_X = 9;
/** Airtime is ~0.88s, so never drop bugs closer together than this. */
const MIN_SPAWN_GAP = 1.15;
const MAX_SPAWN_GAP = 2.0;
const SPLAT_TIME = 0.2;
const RESTART_LOCKOUT = 0.6;
const POP_TIME = 0.16;
const CLOUD_SPEED = 0.2; // as a fraction of world speed
/** How fast Kane walks himself left or right, in blocks per second. */
const MOVE_SPEED = 34;
/** He may roam the whole strip, but not off the edge of it. */
const EDGE_MARGIN = 1;
/** A press this long before touchdown still counts. */
const JUMP_BUFFER = 0.18;
export const AIRTIME = (2 * JUMP_V) / GRAVITY;

export function createWorld(best = 0): World {
  return {
    phase: "idle",
    distance: 0,
    stomps: 0,
    score: 0,
    best,
    speed: START_SPEED,
    x: -1,
    moveDir: 0,
    lift: 0,
    vy: 0,
    bugs: [],
    clouds: [],
    spawnIn: 1.4,
    cloudIn: 0,
    clock: 0,
    overFor: 0,
    pop: 0,
    buffer: 0,
  };
}

function reset(world: World): void {
  world.phase = "playing";
  world.distance = 0;
  world.stomps = 0;
  world.score = 0;
  world.speed = START_SPEED;
  world.x = -1;
  world.moveDir = 0;
  world.lift = 0;
  world.vy = 0;
  world.bugs = [];
  world.spawnIn = 1.4;
  world.overFor = 0;
  world.pop = 0;
  world.buffer = 0;
}

/** Space, arrow-up or a tap. Starts, jumps or restarts depending on the phase. */
export function press(world: World): void {
  if (world.phase === "idle") {
    reset(world);
    return;
  }
  if (world.phase === "over") {
    if (world.overFor >= RESTART_LOCKOUT) reset(world);
    return;
  }
  if (world.lift === 0) {
    world.vy = JUMP_V;
  } else {
    world.buffer = JUMP_BUFFER; // remember it and fire the moment he lands
  }
}

function spawnBug(world: World, bounds: Bounds): void {
  world.bugs.push({
    x: bounds.cols + 2,
    count: Math.random() < 0.72 ? 1 : 2,
    dying: 0,
  });
  world.spawnIn =
    MIN_SPAWN_GAP + Math.random() * (MAX_SPAWN_GAP - MIN_SPAWN_GAP);
}

function driftClouds(world: World, dt: number, bounds: Bounds): void {
  world.cloudIn -= dt;
  if (world.cloudIn <= 0) {
    const span = Math.max(1, bounds.groundY - 18 - bounds.skyTop);
    world.clouds.push({
      x: bounds.cols + 2,
      row: bounds.skyTop + Math.random() * span,
      drift: 0.7 + Math.random() * 0.6,
    });
    world.cloudIn = 2.2 + Math.random() * 3.4;
  }
  const speed = world.phase === "over" ? 0 : world.speed;
  for (let i = world.clouds.length - 1; i >= 0; i--) {
    const cloud = world.clouds[i];
    cloud.x -= speed * CLOUD_SPEED * cloud.drift * dt;
    if (cloud.x < -10) world.clouds.splice(i, 1);
  }
}

/** His ears and shoulders do not count — only the body does. */
const FORGIVE = 3;

function collide(world: World): void {
  const left = world.x + FORGIVE;
  const right = world.x + KANE_W - FORGIVE;
  for (const bug of world.bugs) {
    if (bug.dying > 0) continue;
    const bLeft = bug.x;
    const bRight = bug.x + clusterWidth(bug.count);
    if (right <= bLeft || left >= bRight) continue;
    // the bug only occupies the bottom BUG_H blocks
    if (world.lift >= BUG_H) continue;

    if (world.vy < 0 && world.lift > STOMP_FLOOR) {
      bug.dying = SPLAT_TIME;
      world.stomps += 1;
      world.pop = POP_TIME;
      world.vy = JUMP_V * BOUNCE;
      world.lift = Math.max(world.lift, BUG_H - 1);
    } else {
      world.phase = "over";
      world.overFor = 0;
      world.best = Math.max(world.best, world.score);
      return;
    }
  }
}

export function update(world: World, dt: number, bounds: Bounds): void {
  if (world.x < 0) world.x = bounds.kaneX;
  world.clock += dt;
  if (world.pop > 0) world.pop = Math.max(0, world.pop - dt);
  driftClouds(world, dt, bounds);

  if (world.phase === "idle") {
    // the ground keeps scrolling so the footer never looks frozen
    world.distance += START_SPEED * 0.4 * dt;
    return;
  }
  if (world.phase === "over") {
    world.overFor += dt;
    return;
  }

  world.speed = Math.min(MAX_SPEED, START_SPEED + world.distance * SPEED_GAIN);
  world.distance += world.speed * dt;

  // walk left or right; he keeps whatever ground he takes
  if (world.moveDir !== 0) {
    world.x += world.moveDir * MOVE_SPEED * dt;
  }
  world.x = Math.max(
    EDGE_MARGIN,
    Math.min(bounds.cols - KANE_W - EDGE_MARGIN, world.x),
  );

  if (world.buffer > 0) world.buffer = Math.max(0, world.buffer - dt);

  if (world.lift > 0 || world.vy > 0) {
    world.lift += world.vy * dt;
    world.vy -= GRAVITY * dt;
    if (world.lift <= 0) {
      world.lift = 0;
      world.vy = 0;
      if (world.buffer > 0) {
        world.vy = JUMP_V; // the buffered press lands as a fresh jump
        world.buffer = 0;
      }
    }
  }

  world.spawnIn -= dt;
  if (world.spawnIn <= 0) spawnBug(world, bounds);

  for (let i = world.bugs.length - 1; i >= 0; i--) {
    const bug = world.bugs[i];
    if (bug.dying > 0) {
      bug.dying -= dt;
      if (bug.dying <= 0) world.bugs.splice(i, 1);
      continue;
    }
    bug.x -= world.speed * dt;
    if (bug.x + clusterWidth(bug.count) < -2) world.bugs.splice(i, 1);
  }

  collide(world);
  world.score =
    world.stomps * POINTS_PER_STOMP +
    Math.floor(world.distance * POINTS_PER_BLOCK);
}

/** Which leg frame Kane or a bug is on right now. */
export function legFrame(clock: number, speed: number): number {
  return Math.floor(clock * Math.max(7, speed * 0.55)) % 2;
}

export { BUG_W, BUG_H };
