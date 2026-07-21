import { marketStats, getTopGainers, getTopLosers } from "../../data/market";
import { formatChange, formatPrice } from "../../data/format";
import { renderKeyValue, renderTable } from "../table";
import type { ProgramMeta } from "../types";
import { fail, ok, pre } from "../types";

function snapshot(): string {
  const pairs: [string, string][] = marketStats.map((s) => {
    const ch =
      typeof s.change === "number" ? `  ${formatChange(s.change)}` : "";
    return [s.label.toLowerCase().replace(/\s+/g, "_"), `${s.value}${ch}`];
  });
  return "markets snapshot\n────────────────\n" + renderKeyValue(pairs, 18);
}

function movers(): string {
  const gainers = getTopGainers(5);
  const losers = getTopLosers(5);

  const mapRows = (list: typeof gainers) =>
    list.map((a, i) => ({
      "#": String(i + 1),
      symbol: a.symbol,
      class: a.assetClass,
      price: formatPrice(a.price),
      "24h": formatChange(a.change24h),
    }));

  const cols = [
    { key: "#", header: "#", align: "right" as const },
    { key: "symbol", header: "SYMBOL" },
    { key: "class", header: "CLASS" },
    { key: "price", header: "PRICE", align: "right" as const },
    { key: "24h", header: "24H", align: "right" as const },
  ];

  return [
    "top gainers (24h)",
    "─────────────────",
    renderTable(cols, mapRows(gainers)),
    "",
    "top losers (24h)",
    "────────────────",
    renderTable(cols, mapRows(losers)),
  ].join("\n");
}

export const marketsProgram: ProgramMeta = {
  name: "markets",
  summary: "Market snapshot and top movers",
  usage: "markets [snapshot|movers]",
  aliases: ["market", "mkt"],
  run: ({ args }) => {
    const sub = (args[0] ?? "all").toLowerCase();

    switch (sub) {
      case "all":
        return ok([
          pre(
            [
              snapshot(),
              "",
              movers(),
              "",
              "# mock indices · feed:static",
            ].join("\n"),
          ),
        ]);
      case "snapshot":
      case "snap":
      case "stats":
        return ok([pre(snapshot())]);
      case "movers":
      case "top":
        return ok([pre(movers())]);
      default:
        return fail(
          `markets: unknown subcommand '${sub}'\nusage: markets [snapshot|movers]`,
        );
    }
  },
};
