export const DOT_COUNT = 140;

const WIDTH = 1440;
const HEIGHT = 900;
const DOT_COLOR = "#161d19";

type Dot = { x: number; y: number; r: number };

// Decor should vary a little, not look noisy.
const MIN_RADIUS = 0.8;
const MAX_RADIUS = 3.4;
const TICK_START_GAP = 3;
const TICK_MAX_LENGTH = 9;
const TICK_END_GAP = 3;

export function createDotBackdrop(random: () => number = Math.random) {
  const dots: Dot[] = Array.from({ length: DOT_COUNT }, () => ({
    x: random() * WIDTH,
    y: random() * HEIGHT,
    r: MIN_RADIUS + random() * (MAX_RADIUS - MIN_RADIUS),
  }));

  const circles = dots.map(
    (dot) =>
      `<circle cx="${dot.x.toFixed(1)}" cy="${dot.y.toFixed(1)}" r="${dot.r.toFixed(1)}"/>`,
  );

  const ticks = dots.map((dot, index) => {
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    dots.forEach((other, otherIndex) => {
      if (otherIndex === index) {
        return;
      }

      const distance = Math.hypot(other.x - dot.x, other.y - dot.y);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = otherIndex;
      }
    });

    const nearest = dots[nearestIndex];

    if (!nearest) {
      return "";
    }

    const start = dot.r + TICK_START_GAP;
    const end = Math.min(
      start + TICK_MAX_LENGTH,
      nearestDistance - nearest.r - TICK_END_GAP,
    );

    if (end <= start) {
      return "";
    }

    const ux = (nearest.x - dot.x) / nearestDistance;
    const uy = (nearest.y - dot.y) / nearestDistance;

    return `<line x1="${(dot.x + ux * start).toFixed(1)}" y1="${(dot.y + uy * start).toFixed(1)}" x2="${(dot.x + ux * end).toFixed(1)}" y2="${(dot.y + uy * end).toFixed(1)}"/>`;
  });

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">`,
    `<g fill="${DOT_COLOR}" fill-opacity="0.16">${circles.join("")}</g>`,
    `<g stroke="${DOT_COLOR}" stroke-opacity="0.16" stroke-width="1" stroke-linecap="round">${ticks.join("")}</g>`,
    `</svg>`,
  ].join("");
}
