/* eslint-disable prettier/prettier */

/**
 * Intermediate document model.
 *
 * Markdown is parsed exactly ONCE into this structure, and both the PDF and
 * DOCX renderers consume it. That's what keeps the two exports visually in
 * sync with each other (and with the chat bubble) instead of each re-inventing
 * its own half-broken markdown handling.
 */

export interface InlineRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  /** Absolute href when the run is a hyperlink. */
  link?: string;
}

export interface ListItem {
  runs: InlineRun[];
  /** GFM task list state — undefined when the item isn't a checklist item. */
  checked?: boolean;
  /** Nesting depth, 0-based. */
  depth: number;
}

export type Block =
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; runs: InlineRun[] }
  | { type: "paragraph"; runs: InlineRun[] }
  | { type: "list"; ordered: boolean; items: ListItem[] }
  | { type: "quote"; runs: InlineRun[] }
  | { type: "code"; language?: string; text: string }
  | { type: "table"; head: InlineRun[][]; rows: InlineRun[][][]; align: ("left" | "center" | "right")[] }
  | { type: "hr" };

/** Everything a renderer needs to produce a finished, client-ready document. */
export interface ExportDocument {
  /** Brand/report title, e.g. "ITL AI". */
  brand: string;
  /** Document subtitle, e.g. "Research Response". */
  subtitle?: string;
  /** ISO timestamp shown under the title. */
  generatedAt: string;
  /** The user's original prompt, when available. */
  question?: string;
  /** Parsed AI answer. */
  body: Block[];
  /** Cited sources rendered as a numbered reference list. */
  sources?: { label: string; documentType?: string; link?: string; snippet?: string }[];
  disclaimer?: string;
  /** Future-ready: data-URL/base64 PNG logo. Renderers draw it when present. */
  logo?: { dataUrl: string; width: number; height: number };
  /** Base filename without extension. */
  fileName: string;
}
