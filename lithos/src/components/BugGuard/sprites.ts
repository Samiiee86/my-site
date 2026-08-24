/**
 * Pixel sprites, sized in blocks so everything sits on one grid.
 * 'X' is ink, anything else is empty.
 */

export type Sprite = {
  cols: number;
  rows: number;
  /** cols * rows, row-major. 1 = ink. */
  filled: Uint8Array;
};

function sprite(rows: string[]): Sprite {
  const cols = rows[0].length;
  const filled = new Uint8Array(cols * rows.length);
  rows.forEach((row, y) => {
    for (let x = 0; x < cols; x++) {
      if (row[x] === "X") filled[y * cols + x] = 1;
    }
  });
  return { cols, rows: rows.length, filled };
}

/**
 * Kane, traced from the real KaneAI mark (kane-logo.svg) downsampled to a
 * 16-block grid and made symmetric: ears, brow, eyes, heavy body, two feet.
 */
const KANE_BODY = [
  "...XX......XX...",
  "..X..XXXXXX..X..",
  "..X....XX....X..",
  "..XXX......XXX..",
  "..XXXXXXXXXXXX..",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  ".XXXXXXXXXXXXXX.",
  "..XXXXXXXXXXXX..",
  "...XXXX..XXXX...",
  "....XX....XX....",
];

export const KANE_RUN: Sprite[] = [
  sprite([...KANE_BODY, "......XXXX......"]),
  sprite([...KANE_BODY, ".....XX..XX....."]),
];

/** Feet together while airborne. No spin — he stays the right way up. */
export const KANE_JUMP: Sprite = sprite([...KANE_BODY, ".....XXXXXX....."]);

/** A bug. Two frames shuffle its legs as it scuttles toward you. */
export const BUG_FRAMES: Sprite[] = [
  sprite(["X...X", ".XXX.", "XXXXX", ".XXX.", "X...X"]),
  sprite([".X.X.", ".XXX.", "XXXXX", ".XXX.", ".X.X."]),
];

/** Left behind for a beat where a bug was stomped. */
export const SPLAT: Sprite = sprite([
  ".....",
  "X.X.X",
  ".XXX.",
  "X.X.X",
  ".....",
]);

export const CLOUD: Sprite = sprite(["..XXX..", ".XXXXX.", "XXXXXXX"]);

export const KANE_W = KANE_RUN[0].cols;
export const KANE_H = KANE_RUN[0].rows;
export const BUG_W = BUG_FRAMES[0].cols;
export const BUG_H = BUG_FRAMES[0].rows;
/** Blank column between bugs in a cluster. */
export const BUG_GAP = 1;

export function clusterWidth(count: number): number {
  return count * BUG_W + (count - 1) * BUG_GAP;
}
