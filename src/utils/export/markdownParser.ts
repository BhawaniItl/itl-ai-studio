/* eslint-disable prettier/prettier */
import type { Block, InlineRun, ListItem } from "./types";

/* ------------------------------------------------------------------ *
 * Inline parsing
 * ------------------------------------------------------------------ */

interface Style {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
}

const push = (runs: InlineRun[], text: string, style: Style, extra?: Partial<InlineRun>) => {
  if (!text) return;
  const last = runs[runs.length - 1];
  const next: InlineRun = { text, ...style, ...extra };
  // Merge identically-styled neighbours so renderers emit fewer runs.
  if (
    last &&
    !last.code &&
    !next.code &&
    last.link === next.link &&
    !!last.bold === !!next.bold &&
    !!last.italic === !!next.italic &&
    !!last.underline === !!next.underline &&
    !!last.strike === !!next.strike
  ) {
    last.text += text;
    return;
  }
  runs.push(next);
};

/** Parses one line/paragraph of markdown into styled runs. */
export function parseInline(input: string, style: Style = {}): InlineRun[] {
  const runs: InlineRun[] = [];
  let buffer = "";
  let i = 0;

  const flush = () => {
    push(runs, buffer, style);
    buffer = "";
  };

  while (i < input.length) {
    const rest = input.slice(i);

    // Escapes: \* \_ \` ...
    if (rest[0] === "\\" && rest.length > 1 && /[\\`*_{}[\]()#+\-.!~|>]/.test(rest[1])) {
      buffer += rest[1];
      i += 2;
      continue;
    }

    // Inline code — highest precedence, no nested formatting.
    const code = /^(`+)([\s\S]*?)\1/.exec(rest);
    if (code) {
      flush();
      push(runs, code[2], style, { code: true });
      i += code[0].length;
      continue;
    }

    // Images: ![alt](src) — rendered as their alt text until image support lands.
    const image = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(rest);
    if (image) {
      flush();
      push(runs, image[1] || "[image]", style, { italic: true });
      i += image[0].length;
      continue;
    }

    // Links: [text](href)
    const link = /^\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(rest);
    if (link) {
      flush();
      for (const r of parseInline(link[1], style)) runs.push({ ...r, link: link[2] });
      i += link[0].length;
      continue;
    }

    // Bare autolinks
    const auto = /^<?(https?:\/\/[^\s<>)\]]+)>?/.exec(rest);
    if (auto) {
      flush();
      push(runs, auto[1], style, { link: auto[1] });
      i += auto[0].length;
      continue;
    }

    // <u>underline</u> (markdown has no native underline)
    const underline = /^<u>([\s\S]*?)<\/u>/i.exec(rest);
    if (underline) {
      flush();
      runs.push(...parseInline(underline[1], { ...style, underline: true }));
      i += underline[0].length;
      continue;
    }

    // ~~strikethrough~~
    const strike = /^~~([\s\S]+?)~~/.exec(rest);
    if (strike) {
      flush();
      runs.push(...parseInline(strike[1], { ...style, strike: true }));
      i += strike[0].length;
      continue;
    }

    // ***both*** / **bold** / *italic* (and _ variants)
    const emph = /^(\*{1,3}|_{1,3})(?!\s)([\s\S]+?)(?<!\s)\1/.exec(rest);
    if (emph) {
      flush();
      const n = emph[1].length;
      runs.push(
        ...parseInline(emph[2], {
          ...style,
          bold: n >= 2 ? true : style.bold,
          italic: n === 1 || n === 3 ? true : style.italic,
        }),
      );
      i += emph[0].length;
      continue;
    }

    buffer += rest[0];
    i += 1;
  }

  flush();
  return runs;
}

/* ------------------------------------------------------------------ *
 * Block parsing
 * ------------------------------------------------------------------ */

const HR = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/;
const HEADING = /^ {0,3}(#{1,6})\s+(.*)$/;
const FENCE = /^ {0,3}(```|~~~)\s*([\w+-]*)\s*$/;
const QUOTE = /^ {0,3}>\s?(.*)$/;
const BULLET = /^(\s*)([-*+])\s+(.*)$/;
const ORDERED = /^(\s*)(\d+)[.)]\s+(.*)$/;
const TABLE_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    // don't split on escaped pipes
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));

/**
 * Parses a GitHub-flavoured markdown string into the intermediate block model.
 * Deliberately dependency-free so it adds nothing to the initial bundle and can
 * run inside the lazily-loaded exporters.
 */
export function parseMarkdown(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    // Fenced code block
    const fence = FENCE.exec(line);
    if (fence) {
      const marker = fence[1];
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith(marker)) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence
      blocks.push({ type: "code", language: fence[2] || undefined, text: buf.join("\n") });
      continue;
    }

    if (HR.test(line)) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        runs: parseInline(heading[2].replace(/\s+#+\s*$/, "")),
      });
      i += 1;
      continue;
    }

    // Setext heading (Title\n=====)
    if (i + 1 < lines.length && /^ {0,3}(=+|-{2,})\s*$/.test(lines[i + 1]) && !BULLET.test(line)) {
      blocks.push({
        type: "heading",
        level: lines[i + 1].trim().startsWith("=") ? 1 : 2,
        runs: parseInline(line.trim()),
      });
      i += 2;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1])) {
      const head = splitRow(line);
      const align = splitRow(lines[i + 1]).map((c) => {
        const l = c.startsWith(":");
        const r = c.endsWith(":");
        return l && r ? "center" : r ? "right" : "left";
      }) as ("left" | "center" | "right")[];
      i += 2;
      const rows: InlineRun[][][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        const cells = splitRow(lines[i]);
        // normalise ragged rows to the header width
        while (cells.length < head.length) cells.push("");
        rows.push(cells.slice(0, head.length).map((c) => parseInline(c)));
        i += 1;
      }
      blocks.push({
        type: "table",
        head: head.map((c) => parseInline(c)),
        rows,
        align,
      });
      continue;
    }

    // Blockquote (consecutive lines merged into one quote block)
    if (QUOTE.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) {
        buf.push(QUOTE.exec(lines[i])![1]);
        i += 1;
      }
      blocks.push({ type: "quote", runs: parseInline(buf.join(" ").trim()) });
      continue;
    }

    // Lists (with nesting + GFM checklists)
    if (BULLET.test(line) || ORDERED.test(line)) {
      const ordered = ORDERED.test(line) && !BULLET.test(line);
      const items: ListItem[] = [];
      while (i < lines.length) {
        const m = ORDERED.exec(lines[i]) ?? BULLET.exec(lines[i]);
        if (!m) {
          // A plain indented continuation line belongs to the previous item.
          if (items.length && /^\s{2,}\S/.test(lines[i]) && lines[i].trim()) {
            items[items.length - 1].runs.push(...parseInline(" " + lines[i].trim()));
            i += 1;
            continue;
          }
          break;
        }
        let text = m[3];
        let checked: boolean | undefined;
        const task = /^\[( |x|X)\]\s+(.*)$/.exec(text);
        if (task) {
          checked = task[1].toLowerCase() === "x";
          text = task[2];
        }
        items.push({
          runs: parseInline(text),
          checked,
          depth: Math.min(4, Math.floor(m[1].replace(/\t/g, "  ").length / 2)),
        });
        i += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    // Paragraph — consume until a blank line or the start of another construct.
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim()) {
      const l = lines[i];
      if (
        HEADING.test(l) ||
        FENCE.test(l) ||
        HR.test(l) ||
        QUOTE.test(l) ||
        BULLET.test(l) ||
        ORDERED.test(l) ||
        (l.includes("|") && i + 1 < lines.length && TABLE_SEP.test(lines[i + 1]))
      ) {
        break;
      }
      buf.push(l.trim());
      i += 1;
    }
    if (buf.length) blocks.push({ type: "paragraph", runs: parseInline(buf.join(" ")) });
  }

  return blocks;
}
