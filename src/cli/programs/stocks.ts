import { stockAssets } from "../../data/stocks";
import { formatChange, formatCompact, formatPrice } from "../../data/format";
import { renderKeyValue, renderTable } from "../table";
import type { ProgramMeta } from "../types";
import { fail, ok, pre, usage } from "../types";

function listAssets(filter?: string): string {
  let list = [...stockAssets];
  if (filter) {
    const q = filter.toLowerCase();
    list = list.filter(
      (a) =>
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q),
    );
  }

  if (list.length === 0) return "no stocks matched";

  const rows = list.map((a) => ({
    symbol: a.symbol,
    name: a.name,
    exch: a.exchange ?? "—",
    price: formatPrice(a.price),
    "24h": formatChange(a.change24h),
    mcap: formatCompact(a.marketCap),
    vol: formatCompact(a.volume24h),
  }));

  return (
    "stocks ls\n─────────\n" +
    renderTable(
      [
        { key: "symbol", header: "SYMBOL" },
        { key: "name", header: "NAME" },
        { key: "exch", header: "EXCH" },
        { key: "price", header: "PRICE", align: "right" },
        { key: "24h", header: "24H", align: "right" },
        { key: "mcap", header: "MCAP", align: "right" },
        { key: "vol", header: "VOL", align: "right" },
      ],
      rows,
    )
  );
}

function showAsset(symbol: string) {
  const a = stockAssets.find(
    (x) => x.symbol.toLowerCase() === symbol.toLowerCase(),
  );
  if (!a) return fail(`stocks: not found: ${symbol}`);

  const text = [
    `STOCK  ${a.symbol}  ·  ${a.name}`,
    a.exchange ? `exch   ${a.exchange}` : "",
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

export const stocksProgram: ProgramMeta = {
  name: "stocks",
  summary: "List or show equities",
  usage: "stocks [ls|show <symbol>]",
  aliases: ["stock", "equities", "eq"],
  run: ({ args }) => {
    if (args.length === 0) {
      return ok([pre(listAssets())]);
    }

    const sub = args[0].toLowerCase();

    if (sub === "ls" || sub === "list") {
      return ok([pre(listAssets(args[1]))]);
    }

    if (sub === "show" || sub === "get" || sub === "info") {
      if (!args[1]) return usage("usage: stocks show <symbol>");
      return showAsset(args[1]);
    }

    const hit = stockAssets.find((a) => a.symbol.toLowerCase() === sub);
    if (hit) return showAsset(sub);

    return fail(
      `stocks: unknown '${args[0]}'\nusage: stocks [ls|show <symbol>]`,
    );
  },
};
