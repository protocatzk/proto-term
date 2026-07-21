import type {
  AllocationSlice,
  Holding,
  HoldingComputed,
  PieSlice,
} from "./types";
import { cryptoAssets } from "./crypto";
import { stockAssets } from "./stocks";
import { buildPieSlices } from "./pie";

const priceMap = new Map(
  [...cryptoAssets, ...stockAssets].map((a) => [
    a.symbol,
    { price: a.price, change24h: a.change24h, name: a.name, assetClass: a.assetClass },
  ]),
);

/**
 * Mock portfolio holdings.
 * quantity × price = market value; costBasis is avg entry.
 */
const rawHoldings: Array<{
  symbol: string;
  quantity: number;
  costBasis: number;
  assetClass?: "cash";
  name?: string;
  price?: number;
  change24h?: number;
}> = [
  { symbol: "BTC", quantity: 0.42, costBasis: 48_200 },
  { symbol: "ETH", quantity: 4.5, costBasis: 2_890 },
  { symbol: "SOL", quantity: 65, costBasis: 92.4 },
  { symbol: "AAPL", quantity: 25, costBasis: 172.1 },
  { symbol: "NVDA", quantity: 40, costBasis: 68.5 },
  { symbol: "MSFT", quantity: 12, costBasis: 380.2 },
  { symbol: "TSLA", quantity: 8, costBasis: 210.0 },
  {
    symbol: "USD",
    quantity: 12_500,
    costBasis: 1,
    assetClass: "cash",
    name: "Cash (USD)",
    price: 1,
    change24h: 0,
  },
];

export const portfolioMeta = {
  account: "demo@prototerm",
  host: "portfolio",
  asOf: "2026-07-21T12:00:00Z",
  currency: "USD",
  label: "main",
};

function resolveHolding(raw: (typeof rawHoldings)[number]): Holding {
  if (raw.assetClass === "cash") {
    return {
      symbol: raw.symbol,
      name: raw.name ?? "Cash",
      assetClass: "cash",
      quantity: raw.quantity,
      costBasis: raw.costBasis,
      price: raw.price ?? 1,
      change24h: raw.change24h ?? 0,
    };
  }

  const market = priceMap.get(raw.symbol);
  if (!market) {
    throw new Error(`Unknown symbol in portfolio: ${raw.symbol}`);
  }

  return {
    symbol: raw.symbol,
    name: market.name,
    assetClass: market.assetClass,
    quantity: raw.quantity,
    costBasis: raw.costBasis,
    price: market.price,
    change24h: market.change24h,
  };
}

export function getHoldings(): Holding[] {
  return rawHoldings.map(resolveHolding);
}

export function computeHoldings(holdings = getHoldings()): HoldingComputed[] {
  const withValues = holdings.map((h) => {
    const marketValue = h.quantity * h.price;
    const costValue = h.quantity * h.costBasis;
    const pnl = marketValue - costValue;
    const pnlPct = costValue === 0 ? 0 : (pnl / costValue) * 100;
    return { ...h, marketValue, costValue, pnl, pnlPct, weight: 0 };
  });

  const total = withValues.reduce((s, h) => s + h.marketValue, 0) || 1;
  return withValues
    .map((h) => ({ ...h, weight: h.marketValue / total }))
    .sort((a, b) => b.marketValue - a.marketValue);
}

export function getPortfolioTotals(holdings = computeHoldings()) {
  const marketValue = holdings.reduce((s, h) => s + h.marketValue, 0);
  const costValue = holdings.reduce((s, h) => s + h.costValue, 0);
  const pnl = marketValue - costValue;
  const pnlPct = costValue === 0 ? 0 : (pnl / costValue) * 100;

  const dayPnl = holdings.reduce(
    (s, h) => s + h.marketValue * (h.change24h / 100),
    0,
  );
  // Approximate prior day value from 24h % change
  const prior = holdings.reduce((s, h) => {
    const factor = 1 + h.change24h / 100;
    return s + (factor === 0 ? h.marketValue : h.marketValue / factor);
  }, 0);
  const dayPnlPct = prior === 0 ? 0 : ((marketValue - prior) / prior) * 100;

  return { marketValue, costValue, pnl, pnlPct, dayPnl, dayPnlPct };
}

/** Colors for CLI-style charts — red / blue spectrum */
export const CHART_COLORS = {
  crypto: "#ff4d6d",
  stock: "#4d8dff",
  cash: "#7ab4ff",
  // per-symbol accents (cycle)
  palette: [
    "#ff4d6d",
    "#4d8dff",
    "#ff6b8a",
    "#6ea0ff",
    "#c44d6a",
    "#3d7aef",
    "#ff8a9a",
    "#8bb4ff",
    "#e23d5c",
    "#5b9dff",
  ],
};

export function allocationByClass(
  holdings = computeHoldings(),
): AllocationSlice[] {
  const buckets = new Map<string, number>();
  for (const h of holdings) {
    const key = h.assetClass;
    buckets.set(key, (buckets.get(key) ?? 0) + h.marketValue);
  }
  const total = [...buckets.values()].reduce((a, b) => a + b, 0) || 1;
  const labels: Record<string, string> = {
    crypto: "Crypto",
    stock: "Stocks",
    cash: "Cash",
  };
  const colors: Record<string, string> = {
    crypto: CHART_COLORS.crypto,
    stock: CHART_COLORS.stock,
    cash: CHART_COLORS.cash,
  };

  return [...buckets.entries()]
    .map(([key, value]) => ({
      key,
      label: labels[key] ?? key,
      value,
      weight: value / total,
      color: colors[key] ?? CHART_COLORS.palette[0],
    }))
    .sort((a, b) => b.value - a.value);
}

export function allocationBySymbol(
  holdings = computeHoldings(),
): AllocationSlice[] {
  const total = holdings.reduce((s, h) => s + h.marketValue, 0) || 1;
  return holdings.map((h, i) => ({
    key: h.symbol,
    label: h.symbol,
    value: h.marketValue,
    weight: h.marketValue / total,
    color: CHART_COLORS.palette[i % CHART_COLORS.palette.length],
  }));
}

export function getAllocationPies(holdings = computeHoldings()): {
  byClass: PieSlice[];
  bySymbol: PieSlice[];
} {
  return {
    byClass: buildPieSlices(allocationByClass(holdings)),
    bySymbol: buildPieSlices(allocationBySymbol(holdings)),
  };
}
