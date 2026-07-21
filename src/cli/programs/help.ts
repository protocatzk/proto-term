import type { ProgramMeta } from "../types";
import { ok, pre } from "../types";

const HELP_TEXT = `prototerm — CLI portfolio shell

PROGRAMS
  portfolio [summary|ls|alloc|show <sym>]
      Portfolio NAV, holdings, allocation bars
  markets [snapshot|movers]
      Market KPIs and top movers
  crypto [ls|show <symbol>]
      Crypto list or detail
  stocks [ls|show <symbol>]
      Stock list or detail
  help | man [program]
      This help or program usage
  ls | bin
      List available programs
  clear | cls
      Clear the terminal
  echo <text>
      Print text
  whoami | date | uname
      Session / environment info

EXAMPLES
  portfolio
  portfolio show NVDA
  crypto ls
  crypto show btc
  stocks show aapl
  markets movers

TIPS
  Tabs above run programs
  Press / to focus the prompt
  ↑ / ↓ for command history
`;

export const helpProgram: ProgramMeta = {
  name: "help",
  summary: "Show help or program usage",
  usage: "help [program]",
  aliases: ["?", "man", "--help"],
  run: ({ args }) => {
    const topic = args[0]?.toLowerCase();
    if (!topic) {
      return ok([pre(HELP_TEXT)]);
    }

    // Deferred import-free usage strings for known programs
    const usages: Record<string, string> = {
      portfolio:
        "usage: portfolio [summary|ls|alloc|show <symbol>]\n  default: summary + ls + alloc",
      markets: "usage: markets [snapshot|movers]\n  default: snapshot + movers",
      crypto: "usage: crypto [ls|show <symbol>]\n  default: ls",
      stocks: "usage: stocks [ls|show <symbol>]\n  default: ls",
      help: "usage: help [program]",
      clear: "usage: clear",
      echo: "usage: echo <text>",
      ls: "usage: ls",
    };

    const u = usages[topic];
    if (!u) {
      return ok([pre(`no help for '${topic}' — try: help`, "error")]);
    }
    return ok([pre(u, "dim")]);
  },
};
