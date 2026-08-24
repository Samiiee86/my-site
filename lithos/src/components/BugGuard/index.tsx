import { useEffect, useRef, useState } from "react";
import { KANE_X, createWorld, legFrame, press, update } from "./engine";
import type { Bounds, World } from "./engine";
import { drawText, fitText, textWidth } from "./pixelText";
import type { Sprite } from "./sprites";
import {
  BUG_FRAMES,
  BUG_GAP,
  BUG_H,
  BUG_W,
  CLOUD,
  KANE_H,
  KANE_JUMP,
  KANE_RUN,
  SPLAT,
} from "./sprites";

/** Notion's game canvas is 1280x455 — this is that ratio, with a ceiling so a
 *  wide monitor does not turn the footer into a billboard. */
const ASPECT = 0.4;
const MIN_HEIGHT = 240;
const MAX_HEIGHT = 520;
/**
 * Block size follows the canvas *height*, not its width, so text and sprites
 * stay the same fraction of the scene on every screen. The row target rises
 * with the height above so the extra room becomes breathing space rather than
 * bigger type — a line stays around 30px on a desktop either way.
 */
const TARGET_ROWS = 82;
const MIN_CELL = 4;
const MAX_CELL = 8;
/** Rows of dirt below the ground line. */
const DIRT_ROWS = 5;
/** Cap heights in blocks. 5 puts a line of type at Notion's ~7% of the scene. */
const HUD_CAP = 5;
const TITLE_CAP = 10;
const PROMPT_CAP = 5;
const SUB_CAP = PROMPT_CAP - 1;
/**
 * Blank rows between the stacked lines of the title screen. The button row is
 * placed from these too, so spacing only ever needs changing in one place.
 */
const GAP_AFTER_TITLE = 6;
const GAP_BETWEEN_LINES = 5;
const GAP_BEFORE_BUTTONS = 7;
/**
 * Height of the title-screen text stack, measured for the tallest case (the
 * game-over screen). Both screens centre on it, so the title does not jump
 * when a run ends.
 */
const TITLE_BLOCK_ROWS =
  TITLE_CAP + GAP_AFTER_TITLE + PROMPT_CAP + GAP_BETWEEN_LINES + SUB_CAP;
/** Rows the two HUD lines sit on, and the first row free beneath them. */
const HUD_LABEL_ROW = 3;
const HUD_NUM_ROW = HUD_LABEL_ROW + HUD_CAP + 2;
const BAND_TOP = HUD_NUM_ROW + HUD_CAP + 3;
/** Selector for the footer content Kane should line up with. */
const ALIGN_TO = "[data-game-align]";
/**
 * Game-over copy. Kept here so it is easy to reword without touching the game.
 * Deliberately makes no claim about what the product does — it just points at
 * the difference between these bugs and real ones.
 */
const RESULT_LINE = (bugs: number) =>
  `YOU SQUASHED ${bugs} BUG${bugs === 1 ? "" : "S"}`;
/** Longest first; a narrow phone falls back to a shorter wording. */
const RESULT_SUB = [
  "REAL ONES DON'T LINE UP SO NEATLY",
  "REAL ONES ARE HARDER",
  "REAL ONES ARE HARDER",
];
const BEST_KEY = "testmu-kanerun-best";

// one ink colour at four strengths
const DIM = 0.22; // clouds, dirt
const FAINT = 0.4; // the game-over tagline — secondary, but still readable
const MID = 0.45; // ground line, score
const SOFT = 0.62; // prompt
const BRIGHT = 0.95; // Kane, bugs, title

type Layout = {
  cell: number;
  cols: number;
  edgeCols: number;
  cssW: number;
  cssH: number;
  bounds: Bounds;
};

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(value: number): void {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // private mode — the score just does not persist
  }
}

/**
 * A full-bleed runner across the bottom of the footer. Kane runs, bugs come,
 * and space or a tap jumps — land on a bug to squash it and bounce.
 *
 * The loop only runs while the footer is on screen, and not at all for readers
 * who have asked for reduced motion.
 */
type Finished = {
  score: number;
  stomps: number;
  /** Where to overlay the buttons, or null to sit them below the strip. */
  topPx: number | null;
};
/** Roughly one row of buttons, used to decide if they fit inside the canvas. */
const BUTTON_ROW_PX = 48;

export default function BugGuard({
  className = "",
  signUpHref = "#top",
}: {
  className?: string;
  /** Point this at the real sign-up URL. */
  signUpHref?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [best, setBest] = useState(0);
  const [finished, setFinished] = useState<Finished | null>(null);
  const [copied, setCopied] = useState(false);
  const restartRef = useRef<(() => void) | null>(null);
  const shareRef = useRef<(() => { score: number; stomps: number }) | null>(null);

  /** Fires a DOM event per CTA so analytics can pick it up without this file knowing how. */
  const track = (action: string, detail: Record<string, unknown> = {}) => {
    window.dispatchEvent(
      new CustomEvent("kanerun:cta", { detail: { action, ...detail } }),
    );
  };

  const onShare = async () => {
    const stats = shareRef.current?.() ?? { score: 0, stomps: 0 };
    const text = `TestMu Run — score ${String(stats.score).padStart(5, "0")}, ${stats.stomps} bugs squashed.`;
    const url = `${window.location.origin}${window.location.pathname}`;
    track("share", stats);
    try {
      if (navigator.share) {
        await navigator.share({ title: "TestMu Run", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // the share sheet was dismissed, or the clipboard was refused — nothing to do
    }
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const world: World = createWorld(readBest());
    setBest(world.best);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    let layout: Layout | null = null;
    let cancelled = false;
    let onScreen = false;
    let raf = 0;
    let last = 0;
    let ink = "#fff";
    let shownPhase: World["phase"] | null = null;

    const measure = () => {
      const width = Math.round(wrap.clientWidth);
      if (width < 200) return;

      const wanted = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, width * ASPECT));
      const cell = Math.min(
        MAX_CELL,
        Math.max(MIN_CELL, Math.round(wanted / TARGET_ROWS)),
      );
      // full bleed: cover the whole width even if it means a part-cell overhang
      const cols = Math.ceil(width / cell);
      const rows = Math.round(wanted / cell);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = width;
      const cssH = rows * cell;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ink = getComputedStyle(canvas).color;

      // line Kane up with the footer's content column, so he does not sit in a
      // pool of empty space at the far left
      let kaneX = KANE_X;
      let edgeCols = 3;
      const anchor = document.querySelector(ALIGN_TO);
      if (anchor) {
        const a = anchor.getBoundingClientRect();
        const c = canvas.getBoundingClientRect();
        kaneX = Math.max(1, Math.round((a.left - c.left) / cell));
        edgeCols = Math.max(3, Math.round((c.right - a.right) / cell));
      }

      layout = {
        cell,
        cols,
        edgeCols,
        cssW,
        cssH,
        bounds: {
          cols,
          rows,
          groundY: rows - DIRT_ROWS - 1,
          kaneX,
          skyTop: BAND_TOP,
        },
      };
      render();
    };

    const cellAt = (col: number, row: number) => {
      if (!layout) return;
      const { cell } = layout;
      ctx.rect(col * cell, row * cell, cell, cell);
    };
    const open = (alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
    };
    const close = () => {
      ctx.fill();
      ctx.globalAlpha = 1;
    };
    const blit = (grid: Sprite | null, atCol: number, atRow: number) => {
      if (!grid) return;
      const c0 = Math.round(atCol);
      const r0 = Math.round(atRow);
      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
          if (grid.filled[row * grid.cols + col]) cellAt(c0 + col, r0 + row);
        }
      }
    };

    /** Deterministic speckle so the dirt is stable frame to frame. */
    const speckle = (n: number) => {
      const x = Math.sin(n * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };

    const render = () => {
      if (!layout) return;
      const { cell, cols, cssW, cssH, bounds } = layout;
      const { groundY } = bounds;
      const scroll = world.distance;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = ink;

      // sky
      open(DIM);
      for (const cloud of world.clouds) blit(CLOUD, cloud.x, cloud.row);
      close();

      // ground line
      open(MID);
      for (let col = 0; col < cols; col++) cellAt(col, groundY + 1);
      close();

      // dirt, scrolling with the world
      open(DIM);
      const first = Math.floor(scroll / 9);
      for (let i = first; i < first + Math.ceil(cols / 9) + 2; i++) {
        const x = i * 9 - scroll;
        const row = groundY + 3 + Math.floor(speckle(i) * 2);
        const len = 2 + Math.floor(speckle(i + 99) * 3);
        for (let k = 0; k < len; k++) cellAt(Math.round(x) + k, row);
        cellAt(Math.round(x + 3 + speckle(i + 7) * 3), groundY + 5);
      }
      close();

      // bugs
      open(BRIGHT);
      const bugArt = BUG_FRAMES[legFrame(world.clock, world.speed)];
      for (const bug of world.bugs) {
        const art = bug.dying > 0 ? SPLAT : bugArt;
        for (let i = 0; i < bug.count; i++) {
          blit(art, bug.x + i * (BUG_W + BUG_GAP), groundY - BUG_H + 1);
        }
      }
      close();

      // On a short strip the title screen has nowhere to go, so Kane steps
      // aside for it and comes back the moment a run starts.
      const titleScreen = world.phase !== "playing";
      const blockRows = TITLE_BLOCK_ROWS;
      const bandBottom = groundY - KANE_H - 1;
      const roomy = bandBottom - BAND_TOP >= blockRows;

      // Kane is gone once he crashes — that clears the ground for the buttons.
      const showKane =
        world.phase === "playing" || (world.phase === "idle" && roomy);
      if (showKane) {
        const art =
          world.lift > 0
            ? KANE_JUMP
            : KANE_RUN[legFrame(world.clock, world.speed)];
        open(world.pop > 0 ? SOFT : BRIGHT);
        blit(art, world.x, groundY - world.lift - KANE_H + 1);
        close();
      }

      // SCORE / BEST stacked in the top right, the way the reference does it
      const pad = (n: number) => String(n).padStart(5, "0");
      const numW = textWidth(ctx, pad(0), HUD_CAP, cell);
      const bestX = cols - numW - (layout.edgeCols ?? 3);
      const scoreX = bestX - numW - 6;
      ctx.globalAlpha = MID;
      const label = (text: string, atCol: number) => {
        const w = textWidth(ctx, text, HUD_CAP, cell);
        drawText(
          ctx,
          text,
          atCol + (numW - w) / 2,
          HUD_LABEL_ROW,
          HUD_CAP,
          cell,
        );
      };
      label("SCORE", scoreX);
      label("BEST", bestX);
      drawText(ctx, pad(world.score), scoreX, HUD_NUM_ROW, HUD_CAP, cell);
      drawText(ctx, pad(world.best), bestX, HUD_NUM_ROW, HUD_CAP, cell);
      ctx.globalAlpha = 1;

      // title and prompt while not running
      if (titleScreen) {
        const over = world.phase === "over";
        const titleRow = roomy
          ? BAND_TOP + Math.floor((bandBottom - BAND_TOP - blockRows) / 2)
          : Math.max(
              BAND_TOP,
              BAND_TOP + Math.floor((groundY - BAND_TOP - blockRows) / 2),
            );

        ctx.globalAlpha = BRIGHT;
        const title = fitText(
          ctx,
          over ? ["GAME OVER", "OVER"] : ["> KANE RUN", "KANE RUN", "KANE"],
          TITLE_CAP,
          cell,
          Math.floor(cols * 0.7),
        );
        if (title) {
          drawText(ctx, title.text, (cols - title.cols) / 2, titleRow, title.cap, cell);
        }

        const belowTitle = titleRow + (title ? title.cap : 0) + GAP_AFTER_TITLE;

        if (over) {
          // what you did, then a nudge — never a gate, and never mid-play
          ctx.globalAlpha = SOFT;
          const line = fitText(
            ctx,
            [RESULT_LINE(world.stomps), `${world.stomps} BUGS`],
            PROMPT_CAP,
            cell,
            Math.floor(cols * 0.85),
          );
          if (line) {
            drawText(ctx, line.text, (cols - line.cols) / 2, belowTitle, line.cap, cell);
          }
          ctx.globalAlpha = FAINT;
          const sub = fitText(ctx, RESULT_SUB, SUB_CAP, cell, Math.floor(cols * 0.8));
          if (sub) {
            drawText(
              ctx,
              sub.text,
              (cols - sub.cols) / 2,
              belowTitle + PROMPT_CAP + GAP_BETWEEN_LINES,
              sub.cap,
              cell,
            );
          }
        } else {
          ctx.globalAlpha = SOFT;
          const verb = coarse.matches ? "TAP" : "PRESS SPACE";
          const prompt = fitText(
            ctx,
            [`${verb} TO CONTINUE`, `${verb} TO PLAY`, verb],
            PROMPT_CAP,
            cell,
            Math.floor(cols * 0.85),
          );
          if (prompt) {
            const blink = Math.floor(world.clock * 2) % 2 === 0;
            const text = blink ? `${prompt.text} _` : prompt.text;
            const w = textWidth(ctx, text, prompt.cap, cell);
            drawText(ctx, text, (cols - w) / 2, belowTitle, prompt.cap, cell);
          }
        }
        ctx.globalAlpha = 1;
      }
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (layout) {
        const wasBest = world.best;
        update(world, dt, layout.bounds);

        // Drive the overlay off the phase itself rather than off a transition,
        // so a remount mid-run still shows the right thing.
        if (world.phase !== shownPhase) {
          shownPhase = world.phase;
          if (world.phase === "over") {
            const blockRows = TITLE_BLOCK_ROWS;
            const bandBottom = layout.bounds.groundY - KANE_H - 1;
            const roomy = bandBottom - BAND_TOP >= blockRows;
            const titleRow = roomy
              ? BAND_TOP + Math.floor((bandBottom - BAND_TOP - blockRows) / 2)
              : BAND_TOP;
            // sits below the last line, using the same gaps the drawing uses
            const lastLineEnd =
              titleRow +
              TITLE_CAP +
              GAP_AFTER_TITLE +
              PROMPT_CAP +
              GAP_BETWEEN_LINES +
              SUB_CAP;
            const topPx = (lastLineEnd + GAP_BEFORE_BUTTONS) * layout.cell;
            // a short strip has no room to overlay them, so they go underneath
            const fits = topPx + BUTTON_ROW_PX <= layout.cssH;
            setFinished({
              score: world.score,
              stomps: world.stomps,
              topPx: fits ? topPx : null,
            });
          } else {
            setFinished(null);
            setCopied(false);
          }
        }
        if (world.best !== wasBest) {
          writeBest(world.best);
          setBest(world.best);
        }
        render();
      }
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      const wanted = onScreen && !document.hidden && !still.matches;
      if (wanted && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!wanted && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const jump = () => {
      press(world);
      if (!raf) render();
    };
    restartRef.current = () => {
      world.overFor = 99; // clear the restart lock-out
      press(world);
      if (!raf) render();
    };
    shareRef.current = () => ({ score: world.score, stomps: world.stomps });

    const onPointerDown = () => jump();

    // track held keys so releasing one while the other is down still works
    const held = new Set<string>();
    const LEFT_KEYS = ["ArrowLeft", "KeyA"];
    const RIGHT_KEYS = ["ArrowRight", "KeyD"];
    const JUMP_KEYS = ["Space", "ArrowUp", "KeyW"];

    const applyDir = () => {
      const left = LEFT_KEYS.some((k) => held.has(k));
      const right = RIGHT_KEYS.some((k) => held.has(k));
      world.moveDir = Number(right) - Number(left);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      // a focused button handles its own Space/Enter
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("[data-game-ui]")) return;
      const code = event.code;
      const known =
        JUMP_KEYS.includes(code) ||
        LEFT_KEYS.includes(code) ||
        RIGHT_KEYS.includes(code);
      if (!known) return;
      // only swallow the key while the footer is the thing on screen
      if (!onScreen || still.matches) return;
      // arrows are how people scroll — leave them alone until a run is underway
      if (!JUMP_KEYS.includes(code) && world.phase !== "playing") return;
      event.preventDefault();
      if (JUMP_KEYS.includes(code)) {
        jump();
        return;
      }
      held.add(code);
      applyDir();
      if (!raf) render();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (!held.delete(event.code)) return;
      applyDir();
    };

    // a key held while the tab loses focus would otherwise stick forever
    const releaseAll = () => {
      held.clear();
      world.moveDir = 0;
    };

    // ResizeObserver already batches to one call per frame, so measure straight
    // from it — deferring to rAF would leave the canvas stale in a hidden tab.
    const onResize = () => {
      if (!cancelled) measure();
    };

    // text metrics are wrong until Geist Pixel lands
    document.fonts.ready.then(onResize).catch(onResize);

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(wrap);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.intersectionRatio > 0.15;
        run();
      },
      { threshold: [0, 0.15, 1] },
    );
    visibility.observe(canvas);

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", run);
    still.addEventListener("change", run);

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseAll);
      document.removeEventListener("visibilitychange", run);
      still.removeEventListener("change", run);
    };
  }, []);

  const btn =
    "border-2 border-background/70 px-4 py-2 text-background transition-colors " +
    "hover:bg-background hover:text-foreground focus-visible:outline " +
    "focus-visible:outline-2 focus-visible:outline-offset-2";
  const btnFont = { fontFamily: '"VCR OSD Mono", monospace', letterSpacing: "0.08em" };

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Kane Run — a small game. Arrow keys move Kane, space jumps, and landing on a bug squashes it."
        className="block touch-manipulation select-none text-background"
      />

      {finished && (
        <div
          data-game-ui
          style={finished.topPx === null ? undefined : { top: `${finished.topPx}px` }}
          className={`flex flex-wrap items-center justify-center gap-3 px-4 text-sm ${
            finished.topPx === null ? "py-5" : "absolute inset-x-0"
          }`}
        >
          <a
            href={signUpHref}
            style={btnFont}
            className={`${btn} bg-background text-foreground hover:opacity-90`}
            onClick={() =>
              track("start-free", {
                score: finished.score,
                stomps: finished.stomps,
              })
            }
          >
            START FREE
          </a>
          <button type="button" style={btnFont} className={btn} onClick={onShare}>
            {copied ? "COPIED" : "SHARE SCORE"}
          </button>
          <button
            type="button"
            style={btnFont}
            className={btn}
            onClick={() => {
              track("play-again", {
                score: finished.score,
                stomps: finished.stomps,
              });
              restartRef.current?.();
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {finished
          ? `Game over. Score ${finished.score}, ${finished.stomps} bugs squashed. Best ${best}.`
          : `Best score: ${best}`}
      </p>
    </div>
  );
}


