import type { OutputBlock, ProgramMeta, ProgramResult } from "./types";
import { fail, ok, pre } from "./types";
import { helpProgram } from "./programs/help";
import { portfolioProgram } from "./programs/portfolio";
import { marketsProgram } from "./programs/markets";
import { cryptoProgram } from "./programs/crypto";
import { stocksProgram } from "./programs/stocks";
import {
  clearProgram,
  dateProgram,
  echoProgram,
  makeLsProgram,
  unameProgram,
  whoamiProgram,
} from "./programs/system";

const corePrograms: ProgramMeta[] = [
  helpProgram,
  portfolioProgram,
  marketsProgram,
  cryptoProgram,
  stocksProgram,
  clearProgram,
  echoProgram,
  whoamiProgram,
  dateProgram,
  unameProgram,
];

const byName = new Map<string, ProgramMeta>();

function register(p: ProgramMeta) {
  byName.set(p.name, p);
  for (const a of p.aliases ?? []) {
    byName.set(a.toLowerCase(), p);
  }
}

for (const p of corePrograms) register(p);

// ls needs the program name list
register(
  makeLsProgram(
    [...new Set(corePrograms.map((p) => p.name))].sort((a, b) =>
      a.localeCompare(b),
    ),
  ),
);

export function listPrograms(): ProgramMeta[] {
  const seen = new Set<string>();
  const out: ProgramMeta[] = [];
  for (const p of byName.values()) {
    if (seen.has(p.name)) continue;
    seen.add(p.name);
    out.push(p);
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function parseLine(raw: string): { cmd: string; args: string[] } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // simple whitespace split; no quotes for v1
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  return { cmd, args };
}

export function execute(raw: string): ProgramResult {
  const parsed = parseLine(raw);
  if (!parsed) {
    return ok([]);
  }

  const { cmd, args } = parsed;

  // help as flag: portfolio --help
  if (args[0] === "--help" || args[0] === "-h") {
    const prog = byName.get(cmd);
    if (prog?.usage) {
      return ok([pre(`${prog.name} — ${prog.summary}\n${prog.usage}`, "dim")]);
    }
  }

  const program = byName.get(cmd);
  if (!program) {
    return fail(`prototerm: command not found: ${cmd}\nTry 'help' or 'ls'.`);
  }

  try {
    return program.run({ args, raw: raw.trim() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return fail(`prototerm: ${cmd}: ${msg}`);
  }
}

/** Build boot banner + optional initial command output (for SSR / first paint). */
export function bootSession(initialCommand?: string): {
  blocks: OutputBlock[];
  command?: string;
} {
  const banner: OutputBlock[] = [
    pre(
      [
        "╔══════════════════════════════════════════╗",
        "║  prototerm  ·  portfolio shell  v0.1     ║",
        "║  type 'help'  ·  programs via tabs       ║",
        "╚══════════════════════════════════════════╝",
        "",
      ].join("\n"),
      "dim",
    ),
  ];

  if (!initialCommand?.trim()) {
    return { blocks: banner };
  }

  const result = execute(initialCommand);
  const cmdBlock: OutputBlock = {
    kind: "pre",
    text: `$ ${initialCommand.trim()}`,
    tone: "cmd",
  };

  return {
    command: initialCommand.trim(),
    blocks: [...banner, cmdBlock, ...result.blocks],
  };
}

export function resultToPlainText(result: ProgramResult): string {
  return result.blocks
    .map((b) => (b.kind === "pre" ? b.text : "[html]"))
    .join("\n");
}
