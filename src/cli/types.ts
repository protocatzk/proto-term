export type OutputBlock =
  | { kind: "pre"; text: string; tone?: "dim" | "error" | "ok" | "cmd" }
  | { kind: "html"; html: string };

export interface ProgramResult {
  blocks: OutputBlock[];
  /** Wipe the terminal scrollback before rendering */
  clear?: boolean;
  exitCode?: number;
}

export interface ProgramContext {
  args: string[];
  raw: string;
}

export type Program = (ctx: ProgramContext) => ProgramResult;

export interface ProgramMeta {
  name: string;
  summary: string;
  usage?: string;
  aliases?: string[];
  run: Program;
}

export function pre(
  text: string,
  tone?: OutputBlock extends { tone?: infer T } ? T : never,
): OutputBlock {
  return { kind: "pre", text, tone };
}

export function html(html: string): OutputBlock {
  return { kind: "html", html };
}

export function ok(blocks: OutputBlock[], exitCode = 0): ProgramResult {
  return { blocks, exitCode };
}

export function fail(message: string, exitCode = 1): ProgramResult {
  return { blocks: [pre(message, "error")], exitCode };
}

export function usage(text: string): ProgramResult {
  return { blocks: [pre(text, "dim")], exitCode: 2 };
}
