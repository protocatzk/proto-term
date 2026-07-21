/** Format USD prices with adaptive precision for crypto pennies vs large stocks. */
export function formatPrice(value: number): string {
  if (value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }
  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

/** Compact market caps / volumes: $1.3T, $28.4B, $420M */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatChange(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function isPositive(value: number): boolean {
  return value >= 0;
}

/** Fixed-width-ish money for CLI columns */
export function formatMoney(value: number, signed = false): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);

  if (!signed) {
    return value < 0 ? `-${formatted}` : formatted;
  }
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

export function formatQty(value: number): string {
  if (Number.isInteger(value)) return value.toLocaleString("en-US");
  if (value >= 100) return value.toFixed(2);
  if (value >= 1) return value.toFixed(4);
  return value.toFixed(6);
}

export function formatWeight(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function padRight(text: string, width: number): string {
  if (text.length >= width) return text.slice(0, width);
  return text + " ".repeat(width - text.length);
}

export function padLeft(text: string, width: number): string {
  if (text.length >= width) return text.slice(0, width);
  return " ".repeat(width - text.length) + text;
}
