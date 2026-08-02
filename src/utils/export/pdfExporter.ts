/* eslint-disable prettier/prettier */
import type { Block, ExportDocument, InlineRun } from "./types";

/**
 * Professional PDF renderer for the intermediate document model.
 *
 * jsPDF + jspdf-autotable are imported dynamically by the caller (see index.ts),
 * so none of this ships in the initial bundle.
 */

type Jsp = import("jspdf").jsPDF;

const MARGIN = 56;
const PAGE_W = 595.28; // A4 pt
const PAGE_H = 841.89;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 42;
const HEADER_H = 54;

const MAROON: [number, number, number] = [122, 16, 37];
const INK: [number, number, number] = [26, 26, 28];
const MUTED: [number, number, number] = [110, 110, 118];
const RULE: [number, number, number] = [222, 218, 220];
const CODE_BG: [number, number, number] = [246, 244, 245];
const LINK: [number, number, number] = [150, 30, 55];

/** Built-in PDF fonts are WinAnsi — swap glyphs they can't draw. */
const sanitize = (text: string) =>
  text
    .replace(/\u20B9/g, "Rs. ")
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x00-\xFF]/g, "");

const runText = (runs: InlineRun[]) => sanitize(runs.map((r) => r.text).join(""));

interface Token {
  text: string;
  width: number;
  run: InlineRun;
  space: boolean;
}

export function renderPdf(
  doc: Jsp,
  autoTable: typeof import("jspdf-autotable").default,
  model: ExportDocument,
): Jsp {
  let y = MARGIN + HEADER_H;

  const fontFor = (run: InlineRun) => {
    if (run.code) return { family: "courier", style: run.bold ? "bold" : "normal" };
    const style = run.bold && run.italic ? "bolditalic" : run.bold ? "bold" : run.italic ? "italic" : "normal";
    return { family: "helvetica", style };
  };

  const applyFont = (run: InlineRun, size: number) => {
    const f = fontFor(run);
    doc.setFont(f.family, f.style);
    doc.setFontSize(run.code ? size - 0.5 : size);
  };

  const newPage = () => {
    doc.addPage();
    y = MARGIN + HEADER_H;
  };

  const ensure = (height: number) => {
    if (y + height > PAGE_H - MARGIN - FOOTER_H) newPage();
  };

  const tokenize = (runs: InlineRun[], size: number): Token[] => {
    const tokens: Token[] = [];
    for (const run of runs) {
      const parts = sanitize(run.text).split(/(\s+)/).filter((p) => p !== "");
      for (const part of parts) {
        applyFont(run, size);
        tokens.push({ text: part, width: doc.getTextWidth(part), run, space: /^\s+$/.test(part) });
      }
    }
    return tokens;
  };

  /** Wraps + draws styled runs. Returns the y position after the last line. */
  const drawRuns = (
    runs: InlineRun[],
    opts: { x?: number; width?: number; size?: number; lineHeight?: number; color?: [number, number, number] } = {},
  ) => {
    const x0 = opts.x ?? MARGIN;
    const width = opts.width ?? CONTENT_W;
    const size = opts.size ?? 10.5;
    const lh = opts.lineHeight ?? size * 1.55;
    const color = opts.color ?? INK;

    const tokens = tokenize(runs, size);
    let line: Token[] = [];
    let lineWidth = 0;

    const flush = () => {
      while (line.length && line[line.length - 1].space) line.pop();
      if (!line.length) return;
      ensure(lh);
      let x = x0;
      for (const t of line) {
        applyFont(t.run, size);
        const c = t.run.link ? LINK : t.run.code ? MAROON : color;
        doc.setTextColor(c[0], c[1], c[2]);
        if (t.run.code && !t.space) {
          doc.setFillColor(CODE_BG[0], CODE_BG[1], CODE_BG[2]);
          doc.rect(x - 1, y - size + 1.5, t.width + 2, size + 1.5, "F");
          doc.setTextColor(MAROON[0], MAROON[1], MAROON[2]);
        }
        doc.text(t.text, x, y);
        if (t.run.underline || t.run.link) {
          doc.setDrawColor(c[0], c[1], c[2]);
          doc.setLineWidth(0.4);
          doc.line(x, y + 1.6, x + t.width, y + 1.6);
        }
        if (t.run.strike) {
          doc.setDrawColor(c[0], c[1], c[2]);
          doc.setLineWidth(0.5);
          doc.line(x, y - size * 0.3, x + t.width, y - size * 0.3);
        }
        if (t.run.link && !t.space) {
          doc.link(x, y - size, t.width, size + 2, { url: t.run.link });
        }
        x += t.width;
      }
      y += lh;
      line = [];
      lineWidth = 0;
    };

    for (const t of tokens) {
      if (lineWidth + t.width > width && line.length) flush();
      if (!line.length && t.space) continue;
      line.push(t);
      lineWidth += t.width;
    }
    flush();
    return y;
  };

  /* ---------------- Cover header ---------------- */

  doc.setFillColor(MAROON[0], MAROON[1], MAROON[2]);
  doc.rect(0, 0, PAGE_W, 6, "F");

  y = MARGIN + 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(MAROON[0], MAROON[1], MAROON[2]);
  doc.text(model.brand, MARGIN, y);

  if (model.subtitle) {
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(sanitize(model.subtitle), MARGIN, y);
  }

  y += 14;
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(`Generated ${sanitize(model.generatedAt)}`, MARGIN, y);

  y += 12;
  doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
  doc.setLineWidth(0.7);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 26;

  /* ---------------- Question ---------------- */

  if (model.question) {
    const boxTop = y - 14;
    const startPage = doc.getNumberOfPages();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(MAROON[0], MAROON[1], MAROON[2]);
    doc.text("QUERY", MARGIN + 12, y);
    y += 14;
    drawRuns([{ text: model.question, italic: true }], {
      x: MARGIN + 12,
      width: CONTENT_W - 24,
      size: 10.5,
      color: INK,
    });
    if (doc.getNumberOfPages() === startPage) {
      doc.setDrawColor(MAROON[0], MAROON[1], MAROON[2]);
      doc.setLineWidth(2);
      doc.line(MARGIN, boxTop - 4, MARGIN, y - 8);
    }
    y += 14;
  }

  /* ---------------- Body ---------------- */

  const HEADING_SIZES: Record<number, number> = { 1: 17, 2: 14.5, 3: 12.5, 4: 11.5, 5: 10.5, 6: 10 };

  const drawBlocks = (blocks: Block[]) => {
    for (const block of blocks) {
      switch (block.type) {
        case "heading": {
          const size = HEADING_SIZES[block.level];
          ensure(size * 2.2);
          y += block.level <= 2 ? 12 : 8;
          drawRuns(
            block.runs.map((r) => ({ ...r, bold: true })),
            { size, lineHeight: size * 1.35, color: block.level <= 2 ? MAROON : INK },
          );
          if (block.level <= 2) {
            doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
            doc.setLineWidth(0.5);
            doc.line(MARGIN, y - 6, PAGE_W - MARGIN, y - 6);
            y += 6;
          } else {
            y += 2;
          }
          break;
        }

        case "paragraph":
          drawRuns(block.runs);
          y += 6;
          break;

        case "quote": {
          const top = y - 10;
          const startPage = doc.getNumberOfPages();
          drawRuns(block.runs, { x: MARGIN + 14, width: CONTENT_W - 20, color: MUTED, size: 10.5 });
          if (doc.getNumberOfPages() === startPage) {
            doc.setDrawColor(MAROON[0], MAROON[1], MAROON[2]);
            doc.setLineWidth(2.5);
            doc.line(MARGIN + 2, top, MARGIN + 2, y - 10);
          }
          y += 8;
          break;
        }

        case "code": {
          const size = 9;
          const lh = size * 1.45;
          doc.setFont("courier", "normal");
          doc.setFontSize(size);
          const lines = sanitize(block.text)
            .split("\n")
            .flatMap((l) => doc.splitTextToSize(l || " ", CONTENT_W - 20) as string[]);
          for (const l of lines) {
            ensure(lh + 6);
            doc.setFillColor(CODE_BG[0], CODE_BG[1], CODE_BG[2]);
            doc.rect(MARGIN, y - size, CONTENT_W, lh, "F");
            doc.setFont("courier", "normal");
            doc.setFontSize(size);
            doc.setTextColor(INK[0], INK[1], INK[2]);
            doc.text(l, MARGIN + 8, y);
            y += lh;
          }
          y += 10;
          break;
        }

        case "list": {
          let counter = 0;
          for (const item of block.items) {
            counter += 1;
            const indent = 14 + item.depth * 16;
            const marker =
              item.checked === undefined
                ? block.ordered
                  ? `${counter}.`
                  : item.depth % 2 === 1
                    ? "-"
                    : "\u2022"
                : item.checked
                  ? "[x]"
                  : "[ ]";
            ensure(16);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.setTextColor(MAROON[0], MAROON[1], MAROON[2]);
            doc.text(marker, MARGIN + indent - 10, y);
            drawRuns(item.runs, {
              x: MARGIN + indent + (block.ordered ? 12 : 8),
              width: CONTENT_W - indent - 20,
              size: 10.5,
              lineHeight: 15,
            });
            y += 2;
          }
          y += 8;
          break;
        }

        case "table": {
          ensure(70);
          autoTable(doc, {
            startY: y,
            margin: { left: MARGIN, right: MARGIN, top: MARGIN + HEADER_H, bottom: MARGIN + FOOTER_H },
            head: [block.head.map((c) => runText(c))],
            body: block.rows.map((r) => r.map((c) => runText(c))),
            theme: "grid",
            styles: {
              font: "helvetica",
              fontSize: 9,
              cellPadding: 5,
              lineColor: RULE,
              lineWidth: 0.5,
              textColor: INK,
              overflow: "linebreak",
              valign: "middle",
            },
            headStyles: {
              fillColor: MAROON,
              textColor: [255, 255, 255],
              fontStyle: "bold",
              halign: "left",
            },
            alternateRowStyles: { fillColor: [250, 249, 250] },
            columnStyles: Object.fromEntries(block.align.map((a, idx) => [idx, { halign: a }])),
          });
          const last = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
          y = (last?.finalY ?? y) + 16;
          break;
        }

        case "hr":
          ensure(18);
          doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
          doc.setLineWidth(0.6);
          doc.line(MARGIN, y - 4, PAGE_W - MARGIN, y - 4);
          y += 14;
          break;
      }
    }
  };

  drawBlocks(model.body);

  /* ---------------- Sources ---------------- */

  if (model.sources?.length) {
    ensure(60);
    y += 10;
    doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
    doc.setLineWidth(0.7);
    doc.line(MARGIN, y - 12, PAGE_W - MARGIN, y - 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(MAROON[0], MAROON[1], MAROON[2]);
    doc.text("Sources & Citations", MARGIN, y + 4);
    y += 24;

    model.sources.forEach((s, idx) => {
      ensure(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(MAROON[0], MAROON[1], MAROON[2]);
      doc.text(`[${idx + 1}]`, MARGIN, y);
      drawRuns(
        [
          { text: s.label, bold: true },
          ...(s.documentType ? [{ text: `  (${s.documentType})`, italic: true } as InlineRun] : []),
        ],
        { x: MARGIN + 24, width: CONTENT_W - 24, size: 9.5, lineHeight: 13 },
      );
      if (s.snippet) {
        drawRuns([{ text: s.snippet }], {
          x: MARGIN + 24,
          width: CONTENT_W - 24,
          size: 8.5,
          lineHeight: 11.5,
          color: MUTED,
        });
      }
      if (s.link) {
        drawRuns([{ text: s.link, link: s.link }], {
          x: MARGIN + 24,
          width: CONTENT_W - 24,
          size: 8,
          lineHeight: 11,
        });
      }
      y += 8;
    });
  }

  /* ---------------- Disclaimer ---------------- */

  if (model.disclaimer) {
    ensure(56);
    y += 10;
    const top = y - 12;
    const startPage = doc.getNumberOfPages();
    drawRuns([{ text: model.disclaimer, italic: true }], {
      x: MARGIN + 12,
      width: CONTENT_W - 24,
      size: 8,
      lineHeight: 11,
      color: MUTED,
    });
    if (doc.getNumberOfPages() === startPage) {
      doc.setFillColor(250, 248, 249);
      doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
      doc.setLineWidth(0.5);
      doc.rect(MARGIN, top - 4, CONTENT_W, y - top + 2, "S");
    }
  }

  /* ---------------- Running header / footer ---------------- */

  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page += 1) {
    doc.setPage(page);

    if (page > 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(MAROON[0], MAROON[1], MAROON[2]);
      doc.text(model.brand, MARGIN, MARGIN);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text(sanitize(model.subtitle ?? ""), PAGE_W - MARGIN, MARGIN, { align: "right" });
      doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
      doc.setLineWidth(0.5);
      doc.line(MARGIN, MARGIN + 8, PAGE_W - MARGIN, MARGIN + 8);
    }

    doc.setDrawColor(RULE[0], RULE[1], RULE[2]);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, PAGE_H - MARGIN - 18, PAGE_W - MARGIN, PAGE_H - MARGIN - 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(`${model.brand} \u2014 Income Tax Library AI`, MARGIN, PAGE_H - MARGIN - 4);
    doc.text(`Page ${page} of ${total}`, PAGE_W - MARGIN, PAGE_H - MARGIN - 4, { align: "right" });
  }

  return doc;
}
