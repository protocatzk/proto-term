import type { Asset } from "./types";

/**
 * Static mock data for the prototype.
 * Later: replace with build-time fetch or a static JSON feed.
 */
export const cryptoAssets: Asset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 67420.55,
    change24h: 2.34,
    marketCap: 1_328_000_000_000,
    volume24h: 28_400_000_000,
    assetClass: "crypto",
    rank: 1,
    description:
      "Bitcoin is the original cryptocurrency and the largest digital asset by market capitalization. It operates as a decentralized peer-to-peer payment network.",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3521.8,
    change24h: -1.12,
    marketCap: 423_000_000_000,
    volume24h: 14_200_000_000,
    assetClass: "crypto",
    rank: 2,
    description:
      "Ethereum is a smart-contract platform that powers DeFi, NFTs, and decentralized applications through its native token Ether.",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 148.62,
    change24h: 5.87,
    marketCap: 68_500_000_000,
    volume24h: 3_800_000_000,
    assetClass: "crypto",
    rank: 3,
    description:
      "Solana is a high-throughput blockchain optimized for speed and low fees, popular for DeFi and consumer crypto apps.",
  },
  {
    symbol: "XRP",
    name: "XRP",
    price: 0.62,
    change24h: 0.45,
    marketCap: 34_800_000_000,
    volume24h: 1_100_000_000,
    assetClass: "crypto",
    rank: 4,
    description:
      "XRP is designed for fast, low-cost cross-border payments and is the native asset of the XRP Ledger.",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.48,
    change24h: -2.91,
    marketCap: 17_100_000_000,
    volume24h: 420_000_000,
    assetClass: "crypto",
    rank: 5,
    description:
      "Cardano is a research-driven proof-of-stake blockchain focused on security, scalability, and formal methods.",
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: 36.14,
    change24h: 3.21,
    marketCap: 14_600_000_000,
    volume24h: 510_000_000,
    assetClass: "crypto",
    rank: 6,
    description:
      "Avalanche is a smart-contracts platform with subnets, aiming for high throughput and customizable blockchains.",
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    price: 7.28,
    change24h: -0.64,
    marketCap: 10_400_000_000,
    volume24h: 280_000_000,
    assetClass: "crypto",
    rank: 7,
    description:
      "Polkadot connects specialized blockchains (parachains) into one network, enabling cross-chain interoperability.",
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    price: 14.92,
    change24h: 1.78,
    marketCap: 9_100_000_000,
    volume24h: 390_000_000,
    assetClass: "crypto",
    rank: 8,
    description:
      "Chainlink provides decentralized oracles that bring real-world data on-chain for smart contracts.",
  },
];
