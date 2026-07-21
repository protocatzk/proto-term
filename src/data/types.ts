export type AssetClass = "crypto" | "stock" | "cash";

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  assetClass: Exclude<AssetClass, "cash">;
  description?: string;
  exchange?: string;
  rank?: number;
}

export interface MarketStat {
  label: string;
  value: string;
  change?: number;
  hint?: string;
}

/** A position in the portfolio (quantity × live/mock price). */
export interface Holding {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  /** Units held (shares / coins) */
  quantity: number;
  /** Average cost per unit (USD) */
  costBasis: number;
  /** Current unit price (USD) — from mock market data or fixed for cash */
  price: number;
  change24h: number;
}

export interface HoldingComputed extends Holding {
  marketValue: number;
  costValue: number;
  pnl: number;
  pnlPct: number;
  weight: number;
}

export interface AllocationSlice {
  key: string;
  label: string;
  value: number;
  weight: number;
  color: string;
}

export interface PieSlice extends AllocationSlice {
  /** SVG path for the slice (viewBox 0 0 100 100, center 50,50) */
  path: string;
  /** Mid-angle in degrees (for optional labels) */
  midAngle: number;
}
