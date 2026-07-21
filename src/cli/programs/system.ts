import { portfolioMeta } from "../../data/portfolio";
import type { ProgramMeta } from "../types";
import { ok, pre } from "../types";

export const clearProgram: ProgramMeta = {
  name: "clear",
  summary: "Clear the terminal screen",
  usage: "clear",
  aliases: ["cls", "reset"],
  run: () => ({ blocks: [], clear: true, exitCode: 0 }),
};

export const echoProgram: ProgramMeta = {
  name: "echo",
  summary: "Print arguments",
  usage: "echo <text>",
  run: ({ args, raw }) => {
    // strip leading "echo "
    const text = raw.replace(/^\s*echo\s+/i, "");
    return ok([pre(args.length ? text : "")]);
  },
};

export const whoamiProgram: ProgramMeta = {
  name: "whoami",
  summary: "Print current user",
  run: () => ok([pre(portfolioMeta.account.split("@")[0] ?? "demo")]),
};

export const dateProgram: ProgramMeta = {
  name: "date",
  summary: "Print date (mock feed asof + local)",
  run: () => {
    const local = new Date().toISOString();
    return ok([
      pre(`feed_asof  ${portfolioMeta.asOf}\nlocal      ${local}`),
    ]);
  },
};

export const unameProgram: ProgramMeta = {
  name: "uname",
  summary: "Print system info",
  aliases: ["neofetch", "about"],
  run: () =>
    ok([
      pre(
        [
          "prototerm 0.1.0",
          "shell     prototerm-sh",
          "host      portfolio",
          "data      mock/static",
          "ui        astro+cli",
          "theme     red/blue",
        ].join("\n"),
      ),
    ]),
};

export function makeLsProgram(names: string[]): ProgramMeta {
  return {
    name: "ls",
    summary: "List programs",
    aliases: ["bin", "programs", "cmds"],
    run: () =>
      ok([
        pre(
          names
            .map((n) => n.padEnd(12))
            .reduce<string[]>((acc, n, i) => {
              const col = i % 4;
              if (col === 0) acc.push(n);
              else acc[acc.length - 1] += n;
              return acc;
            }, [])
            .join("\n"),
        ),
      ]),
  };
}
