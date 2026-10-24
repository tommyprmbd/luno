import { describe, expect, it } from "vitest";
import { createDotBackdrop, DOT_COUNT } from "./backdrop";

// Deterministic LCG so the geometry is reproducible.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const numbers = (svg: string, tag: string, attrs: string[]) =>
  [...svg.matchAll(new RegExp(`<${tag}[^>]*>`, "g"))].map(([match]) =>
    Object.fromEntries(
      attrs.map((attr) => [
        attr,
        Number(match.match(new RegExp(`${attr}="([^"]+)"`))?.[1]),
      ]),
    ),
  );

describe("createDotBackdrop", () => {
  it("should draw a dot per point, plus short ticks that do not touch", () => {
    const svg = createDotBackdrop(seeded(7));
    const circles = numbers(svg, "circle", ["cx", "cy", "r"]);
    const lines = numbers(svg, "line", ["x1", "y1", "x2", "y2"]);

    expect(circles).toHaveLength(DOT_COUNT);
    expect(lines.length).toBeGreaterThan(0);

    for (const line of lines) {
      const length = Math.hypot(line.x2 - line.x1, line.y2 - line.y1);

      expect(length).toBeGreaterThan(0);
      // Coordinates are rounded to one decimal in the SVG.
      expect(length).toBeLessThanOrEqual(9.2);
    }
  });

  it("should keep every tick clear of the nearest dot", () => {
    const svg = createDotBackdrop(seeded(11));
    const circles = numbers(svg, "circle", ["cx", "cy", "r"]);
    const lines = numbers(svg, "line", ["x1", "y1", "x2", "y2"]);

    for (const line of lines) {
      const origin = circles.find(
        (circle) =>
          Math.hypot(circle.cx - line.x1, circle.cy - line.y1) <
          circle.r + 4,
      );

      expect(origin).toBeDefined();

      const nearest = circles
        .filter((circle) => circle !== origin)
        .map((circle) => ({
          circle,
          distance: Math.hypot(circle.cx - line.x2, circle.cy - line.y2),
        }))
        .sort((a, b) => a.distance - b.distance)[0];

      expect(nearest.distance).toBeGreaterThan(nearest.circle.r);
    }
  });
});
