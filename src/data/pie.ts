import type { AllocationSlice, PieSlice } from "./types";

const TAU = Math.PI * 2;

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

/**
 * Build SVG arc paths for a donut/pie chart.
 * viewBox-friendly: center 50,50 radius ~40.
 */
export function buildPieSlices(
  slices: AllocationSlice[],
  options: { innerRadius?: number; outerRadius?: number } = {},
): PieSlice[] {
  const outer = options.outerRadius ?? 40;
  const inner = options.innerRadius ?? 22;
  const cx = 50;
  const cy = 50;

  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return [];

  let angle = -Math.PI / 2; // start at 12 o'clock

  return slices
    .filter((s) => s.value > 0)
    .map((slice) => {
      const fraction = slice.value / total;
      const sweep = fraction * TAU;
      const start = angle;
      const end = angle + sweep;
      const mid = start + sweep / 2;
      angle = end;

      // Full circle edge case
      if (fraction >= 0.9999) {
        const top = polar(cx, cy, outer, -Math.PI / 2);
        const bottom = polar(cx, cy, outer, Math.PI / 2);
        const topIn = polar(cx, cy, inner, -Math.PI / 2);
        const bottomIn = polar(cx, cy, inner, Math.PI / 2);
        const path = [
          `M ${top.x} ${top.y}`,
          `A ${outer} ${outer} 0 1 1 ${bottom.x} ${bottom.y}`,
          `A ${outer} ${outer} 0 1 1 ${top.x} ${top.y}`,
          `M ${topIn.x} ${topIn.y}`,
          `A ${inner} ${inner} 0 1 0 ${bottomIn.x} ${bottomIn.y}`,
          `A ${inner} ${inner} 0 1 0 ${topIn.x} ${topIn.y}`,
          "Z",
        ].join(" ");

        return {
          ...slice,
          weight: fraction,
          path,
          midAngle: (mid * 180) / Math.PI,
        };
      }

      const large = sweep > Math.PI ? 1 : 0;
      const p0 = polar(cx, cy, outer, start);
      const p1 = polar(cx, cy, outer, end);
      const p2 = polar(cx, cy, inner, end);
      const p3 = polar(cx, cy, inner, start);

      const path = [
        `M ${p0.x} ${p0.y}`,
        `A ${outer} ${outer} 0 ${large} 1 ${p1.x} ${p1.y}`,
        `L ${p2.x} ${p2.y}`,
        `A ${inner} ${inner} 0 ${large} 0 ${p3.x} ${p3.y}`,
        "Z",
      ].join(" ");

      return {
        ...slice,
        weight: fraction,
        path,
        midAngle: (mid * 180) / Math.PI,
      };
    });
}
