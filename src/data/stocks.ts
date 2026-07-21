import type { Asset } from "./types";

/**
 * Static mock data for the prototype.
 * Later: replace with build-time fetch or a static JSON feed.
 */
export const stockAssets: Asset[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 198.42,
    change24h: 0.86,
    marketCap: 3_050_000_000_000,
    volume24h: 52_000_000,
    assetClass: "stock",
    exchange: "NASDAQ",
    description:
      "Apple designs and sells consumer electronics, software, and services including the iPhone, Mac, and Apple Services ecosystem.",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 425.18,
    change24h: 1.24,
    marketCap: 3_160_000_000_000,
    volume24h: 18_500_000,
    assetClass: "stock",
    exchange: "NASDAQ",
    description:
      "Microsoft builds software, cloud infrastructure (Azure), productivity tools (Office/365), and AI platforms.",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 118.55,
    change24h: 3.92,
    marketCap: 2_910_000_000_000,
    volume24h: 210_000_000,
    assetClass: "stock",
    exchange: "NASDAQ",
    description:
      "NVIDIA designs GPUs and AI accelerators used in gaming, data centers, autonomous systems, and generative AI.",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 176.3,
    change24h: -0.42,
    marketCap: 2_180_000_000_000,
    volume24h: 22_000_000,
    assetClass: "stock",
    exchange: "NASDAQ",
    description:
      "Alphabet is the parent company of Google, spanning search, ads, cloud, Android, YouTube, and AI research.",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 186.75,
    change24h: 1.05,
    marketCap: 1_950_000_000_000,
    volume24h: 35_000_000,
    assetClass: "stock",
    exchange: "NASDAQ",
    description:
      "Amazon operates e-commerce, AWS cloud computing, advertising, and consumer devices and media services.",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.9,
    change24h: -2.18,
    marketCap: 795_000_000_000,
    volume24h: 98_000_000,
    assetClass: "stock",
    exchange: "NASDAQ",
    description:
      "Tesla designs electric vehicles, energy storage, and solar products, with growing software and autonomy ambitions.",
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 512.4,
    change24h: 0.55,
    marketCap: 1_300_000_000_000,
    volume24h: 14_200_000,
    assetClass: "stock",
    exchange: "NASDAQ",
    description:
      "Meta runs social platforms including Facebook, Instagram, and WhatsApp, and invests in VR/AR and AI.",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    price: 214.6,
    change24h: -0.31,
    marketCap: 610_000_000_000,
    volume24h: 8_400_000,
    assetClass: "stock",
    exchange: "NYSE",
    description:
      "JPMorgan Chase is a global financial services firm offering investment banking, asset management, and consumer banking.",
  },
];
