import {
  allocationByClass,
  allocationBySymbol,
  computeHoldings,
  getPortfolioTotals,
  portfolioMeta,
} from "../../data/portfolio";
import {
  formatChange,
  formatMoney,
  formatPrice,
  formatQty,
  formatWeight,
} from "../../data/format";
import { renderBar, renderKeyValue, renderTable } from "../table";
import type { ProgramMeta, ProgramResult } from "../types";
import { fail, ok, pre, usage } from "../types";

function summaryBlock(): string {
  const holdings = computeHoldings();
  const t = getPortfolioTotals(holdings);
  const lines = [
    `account  ${portfolioMeta.account}`,
    `book     ${portfolioMeta.label} · ${portfolioMeta.currency}`,
    `asof     ${portfolioMeta.asOf}`,
    "",
    renderKeyValue(
      [
        ["NAV", formatMoney(t.marketValue)],
        ["cost", formatMoney(t.costValue)],
        ["pnl", `${formatMoney(t.pnl, true)}  (${formatChange(t.pnlPct)})`],
        ["day", `${formatMoney(t.dayPnl, true)}  (${formatChange(t.dayPnlPct)})`],
        ["positions", String(holdings.length)],
      ],
      12,
    ),
  ];
  return lines.join("\n");
}

function holdingsTable(filter?: string): string {
  let holdings = computeHoldings();
  if (filter) {
    const q = filter.toUpperCase();
    holdings = holdings.filter(
      (h) => h.symbol.includes(q) || h.name.toUpperCase().includes(q),
    );
  }

  if (holdings.length === 0) {
    return "no positions matched";
  }

  const rows = holdings.map((h) => ({
    symbol: h.symbol,
    class: h.assetClass,
    qty: formatQty(h.quantity),
    price: formatPrice(h.price),
    value: formatMoney(h.marketValue),
    pnl: formatMoney(h.pnl, true),
    "pnl%": formatChange(h.pnlPct),
    wgt: formatWeight(h.weight),
    "24h": formatChange(h.change24h),
  }));

  return renderTable(
    [
      { key: "symbol", header: "SYMBOL" },
      { key: "class", header: "CLASS" },
      { key: "qty", header: "QTY", align: "right" },
      { key: "price", header: "PRICE", align: "right" },
      { key: "value", header: "VALUE", align: "right" },
      { key: "pnl", header: "PNL", align: "right" },
      { key: "pnl%", header: "PNL%", align: "right" },
      { key: "wgt", header: "WGT", align: "right" },
      { key: "24h", header: "24H", align: "right" },
    ],
    rows,
  );
}

function allocBlock(mode: "class" | "symbol" = "class"): string {
  const slices =
    mode === "class" ? allocationByClass() : allocationBySymbol();
  const title = mode === "class" ? "ALLOCATION BY CLASS" : "ALLOCATION BY SYMBOL";
  const lines = [
    title,
    ...slices.map((s) => {
      const bar = renderBar(s.weight, 18);
      const label = s.label.padEnd(8);
      const pct = formatWeight(s.weight).padStart(7);
      const val = formatMoney(s.value).padStart(12);
      return `${label} ${bar} ${pct}  ${val}`;
    }),
  ];
  return lines.join("\n");
}

function showPosition(symbol: string): ProgramResult {
  const h = computeHoldings().find(
    (x) => x.symbol.toUpperCase() === symbol.toUpperCase(),
  );
  if (!h) {
    return fail(`portfolio: position not found: ${symbol}`);
  }

  const text = [
    `POSITION  ${h.symbol}  (${h.name})`,
    `class     ${h.assetClass}`,
    "",
    renderKeyValue(
      [
        ["qty", formatQty(h.quantity)],
        ["price", formatPrice(h.price)],
        ["avg cost", formatPrice(h.costBasis)],
        ["value", formatMoney(h.marketValue)],
        ["cost", formatMoney(h.costValue)],
        ["pnl", `${formatMoney(h.pnl, true)}  (${formatChange(h.pnlPct)})`],
        ["weight", formatWeight(h.weight)],
        ["24h", formatChange(h.change24h)],
      ],
      10,
    ),
  ].join("\n");

  return ok([pre(text)]);
}

function fullReport(): ProgramResult {
  const text = [
    "portfolio — summary",
    "───────────────────",
    summaryBlock(),
    "",
    "holdings",
    "────────",
    holdingsTable(),
    "",
    allocBlock("class"),
    "",
    allocBlock("symbol"),
    "",
    "# mock data · not investment advice",
  ].join("\n");
  return ok([pre(text)]);
}

export const portfolioProgram: ProgramMeta = {
  name: "portfolio",
  summary: "Portfolio NAV, holdings, allocation",
  usage: "portfolio [summary|ls|alloc|show <symbol>]",
  aliases: ["pf", "holdings", "nav"],
  run: ({ args }) => {
    const sub = (args[0] ?? "all").toLowerCase();

    switch (sub) {
      case "all":
      case "full":
        return fullReport();
      case "summary":
      case "sum":
      case "stat":
      case "stats":
        return ok([
          pre("portfolio — summary\n───────────────────\n" + summaryBlock()),
        ]);
      case "ls":
      case "list":
      case "positions": {
        const filter = args[1];
        return ok([
          pre("portfolio ls\n────────────\n" + holdingsTable(filter)),
        ]);
      }
      case "alloc":
      case "allocation": {
        const mode = args[1]?.toLowerCase() === "symbol" ? "symbol" : "class";
        return ok([pre(allocBlock(mode))]);
      }
      case "show":
      case "get": {
        if (!args[1]) return usage("usage: portfolio show <symbol>");
        return showPosition(args[1]);
      }
      case "help":
      case "--help":
      case "-h":
        return usage(
          "usage: portfolio [summary|ls|alloc|show <symbol>]\n  default: full report",
        );
      default: {
        // treat bare symbol as show
        if (args.length === 1 && args[0].length <= 5) {
          const hit = computeHoldings().find(
            (h) => h.symbol.toUpperCase() === args[0].toUpperCase(),
          );
          if (hit) return showPosition(args[0]);
        }
        return fail(
          `portfolio: unknown subcommand '${sub}'\ntry: help portfolio`,
        );
      }
    }
  },
};
