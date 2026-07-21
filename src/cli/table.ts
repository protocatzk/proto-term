import { padLeft, padRight } from "../data/format";

export type Align = "left" | "right";

export interface Column {
  key: string;
  header: string;
  align?: Align;
  width?: number;
}

export function renderTable(
  columns: Column[],
  rows: Record<string, string>[],
  options: { maxWidth?: number } = {},
): string {
  const widths = columns.map((col) => {
    const contentMax = rows.reduce(
      (m, row) => Math.max(m, (row[col.key] ?? "").length),
      col.header.length,
    );
    return col.width ?? contentMax;
  });

  const line = (cells: string[], pad: boolean) =>
    cells
      .map((cell, i) => {
        const w = widths[i];
        const align = columns[i].align ?? "left";
        const clipped = cell.length > w ? cell.slice(0, Math.max(0, w - 1)) + "…" : cell;
        if (!pad) return clipped;
        return align === "right" ? padLeft(clipped, w) : padRight(clipped, w);
      })
      .join("  ");

  const header = line(
    columns.map((c) => c.header),
    true,
  );
  const rule = widths.map((w) => "─".repeat(w)).join("──");
  const body = rows.map((row) =>
    line(
      columns.map((c) => row[c.key] ?? ""),
      true,
    ),
  );

  const out = [header, rule, ...body].join("\n");
  if (options.maxWidth && options.maxWidth > 0) {
    // keep as-is; wrapping would break columns
    return out;
  }
  return out;
}

/** Horizontal bar: `████░░░░  42.1%` */
export function renderBar(fraction: number, width = 16): string {
  const f = Math.max(0, Math.min(1, fraction));
  const filled = Math.round(f * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

export function renderKeyValue(pairs: [string, string][], keyWidth = 14): string {
  return pairs
    .map(([k, v]) => `${padRight(k, keyWidth)} ${v}`)
    .join("\n");
}
