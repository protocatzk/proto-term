import { cryptoAssets } from "../../data/crypto";
import { formatChange, formatCompact, formatPrice } from "../../data/format";
import { renderKeyValue, renderTable } from "../table";
import type { ProgramMeta } from "../types";
import { fail, ok, pre, usage } from "../types";

function listAssets(filter?: string): string {
  let list = [...cryptoAssets];
  if (filter) {
    const q = filter.toLowerCase();
    list = list.filter(
      (a) =>
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q),
    );
  }

  if (list.length === 0) return "no crypto assets matched";

  const rows = list.map((a) => ({
    rank: String(a.rank ?? "—"),
    symbol: a.symbol,
    name: a.name,
    price: formatPrice(a.price),
    "24h": formatChange(a.change24h),
    mcap: formatCompact(a.marketCap),
    vol: formatCompact(a.volume24h),
  }));

  return (
    "crypto ls\n─────────\n" +
    renderTable(
      [
        { key: "rank", header: "#", align: "right" },
        { key: "symbol", header: "SYMBOL" },
        { key: "name", header: "NAME" },
        { key: "price", header: "PRICE", align: "right" },
        { key: "24h", header: "24H", align: "right" },
        { key: "mcap", header: "MCAP", align: "right" },
        { key: "vol", header: "VOL24H", align: "right" },
      ],
      rows,
    )
  );
}

function showAsset(symbol: string) {
  const a = cryptoAssets.find(
    (x) => x.symbol.toLowerCase() === symbol.toLowerCase(),
  );
  if (!a) return fail(`crypto: not found: ${symbol}`);

  const text = [
    `CRYPTO  ${a.symbol}  ·  ${a.name}`,
    a.rank ? `rank    #${a.rank}` : "",
    "",
    renderKeyValue(
      [
        ["price", formatPrice(a.price)],
        ["24h", formatChange(a.change24h)],
        ["mcap", formatCompact(a.marketCap)],
        ["vol24h", formatCompact(a.volume24h)],
      ],
      8,
    ),
    a.description ? `\nabout\n─────\n${a.description}` : "",
    "\n# mock data · not investment advice",
  ]
    .filter(Boolean)
    .join("\n");

  return ok([pre(text)]);
}

export const cryptoProgram: ProgramMeta = {
  name: "crypto",
  summary: "List or show cryptocurrencies",
  usage: "crypto [ls|show <symbol>]",
  aliases: ["coin", "coins"],
  run: ({ args }) => {
    if (args.length === 0) {
      return ok([pre(listAssets())]);
    }

    const sub = args[0].toLowerCase();

    if (sub === "ls" || sub === "list") {
      return ok([pre(listAssets(args[1]))]);
    }

    if (sub === "show" || sub === "get" || sub === "info") {
      if (!args[1]) return usage("usage: crypto show <symbol>");
      return showAsset(args[1]);
    }

    // bare symbol
    const hit = cryptoAssets.find(
      (a) => a.symbol.toLowerCase() === sub,
    );
    if (hit) return showAsset(sub);

    return fail(
      `crypto: unknown '${args[0]}'\nusage: crypto [ls|show <symbol>]`,
    );
  },
};
