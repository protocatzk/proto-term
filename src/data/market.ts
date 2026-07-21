import type { MarketStat } from "./types";
import { cryptoAssets } from "./crypto";
import { stockAssets } from "./stocks";

export const marketStats: MarketStat[] = [
  {
    label: "Crypto Market Cap",
    value: "$2.48T",
    change: 1.82,
    hint: "Mock aggregate",
  },
  {
    label: "24h Crypto Volume",
    value: "$92.4B",
    change: -3.4,
    hint: "Mock aggregate",
  },
  {
    label: "S&P 500",
    value: "5,428.10",
    change: 0.42,
    hint: "Mock index",
  },
  {
    label: "Fear & Greed",
    value: "64 · Greed",
    hint: "Mock sentiment",
  },
];

export function getTopGainers(limit = 3) {
  return [...cryptoAssets, ...stockAssets]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, limit);
}

export function getTopLosers(limit = 3) {
  return [...cryptoAssets, ...stockAssets]
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, limit);
}

export function getAssetBySymbol(symbol: string) {
  const upper = symbol.toUpperCase();
  return (
    cryptoAssets.find((a) => a.symbol === upper) ??
    stockAssets.find((a) => a.symbol === upper)
  );
}
