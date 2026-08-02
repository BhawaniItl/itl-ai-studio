/* eslint-disable prettier/prettier */
import type { Paragraph as ParagraphType, ParagraphChild, Table as TableType } from "docx";
import type { Block, ExportDocument, InlineRun } from "./types";

/**
 * Real DOCX renderer (not markdown-in-a-.doc). Consumes the same intermediate
 * model as the PDF exporter so both outputs stay structurally identical.
 *
 * `docx` is passed in by the caller after a dynamic import.
 */

type DocxModule = typeof import("docx");

const A4_W = 11906;
const A4_H = 16838;
const MARGIN = 1440;
const CONTENT_W = A4_W - MARGIN * 2; // 9026 DXA

const MAROON = "7A1025";
const INK = "1A1A1C";
const MUTED = "6E6E76";
const RULE = "DEDADC";
const CODE_BG = "F6F4F5";

const HEADING_SIZE: Record<number, number> = { 1: 34, 2: 28, 3: 24, 4: 22, 5: 21, 6: 20 };

export function buildDocx(docx: DocxModule, model: ExportDocument) {
  const {
    Document,
    Paragraph,
    TextRun,
    ExternalHyperlink,
    Table,
    TableRow,
    TableCell,
    Header,
    Footer,
    AlignmentType,
    BorderStyle,
    WidthType,
    ShadingType,
    LevelFormat,
    PageNumber,
    TabStopType,
    TabStopPosition,
    VerticalAlign,
  } = docx;

  const inline = (
    runs: InlineRun[],
    base: { size?: number; color?: string; italics?: boolean } = {},
  ): ParagraphChild[] =>
    runs.flatMap<ParagraphChild>((r) => {
      const run = new TextRun({
        text: r.text,
        bold: r.bold,
        italics: r.italic ?? base.italics,
        underline: r.underline ? {} : undefined,
        strike: r.strike,
        font: r.code ? "Consolas" : "Arial",
        size: base.size ?? 22,
        color: r.code ? MAROON : r.link ? MAROON : (base.color ?? INK),
        shading: r.code ? { type: ShadingType.CLEAR, fill: CODE_BG, color: "auto" } : undefined,
      });
      return r.link
        ? [new ExternalHyperlink({ children: [run], link: r.link })]
        : [run];
    });

  const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: RULE };
  const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
  const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

  const alignOf = (a: "left" | "center" | "right") =>
    a === "center" ? AlignmentType.CENTER : a === "right" ? AlignmentType.RIGHT : AlignmentType.LEFT;

  const children: (ParagraphType | TableType)[] = [];

  /* ---------------- Cover ---------------- */

  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: model.brand, bold: true, size: 44, color: MAROON, font: "Arial" })],
    }),
  );
  if (model.subtitle) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: model.subtitle, size: 26, color: INK, font: "Arial" })],
      }),
    );
  }
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 6 } },
      children: [
        new TextRun({ text: `Generated ${model.generatedAt}`, size: 18, color: MUTED, font: "Arial" }),
      ],
    }),
  );

  if (model.question) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [new TextRun({ text: "QUERY", bold: true, size: 16, color: MAROON, font: "Arial" })],
      }),
      new Paragraph({
        spacing: { after: 240 },
        indent: { left: 240 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: MAROON, space: 8 } },
        children: inline([{ text: model.question, italic: true }], { size: 22 }),
      }),
    );
  }

  /* ---------------- Body ---------------- */

  const pushBlock = (block: Block) => {
    switch (block.type) {
      case "heading":
        children.push(
          new Paragraph({
            spacing: { before: block.level <= 2 ? 280 : 200, after: 120 },
            border:
              block.level <= 2
                ? { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 4 } }
                : undefined,
            children: block.runs.map(
              (r) =>
                new TextRun({
                  text: r.text,
                  bold: true,
                  italics: r.italic,
                  size: HEADING_SIZE[block.level],
                  color: block.level <= 2 ? MAROON : INK,
                  font: "Arial",
                }),
            ),
          }),
        );
        break;

      case "paragraph":
        children.push(
          new Paragraph({ spacing: { after: 140, line: 300 }, children: inline(block.runs) }),
        );
        break;

      case "quote":
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 180 },
            indent: { left: 320 },
            border: { left: { style: BorderStyle.SINGLE, size: 12, color: MAROON, space: 8 } },
            children: inline(block.runs, { color: MUTED, italics: true }),
          }),
        );
        break;

      case "code":
        block.text.split("\n").forEach((line, idx, arr) => {
          children.push(
            new Paragraph({
              spacing: { after: idx === arr.length - 1 ? 180 : 0 },
              shading: { type: ShadingType.CLEAR, fill: CODE_BG, color: "auto" },
              indent: { left: 160, right: 160 },
              children: [new TextRun({ text: line || " ", font: "Consolas", size: 19, color: INK })],
            }),
          );
        });
        break;

      case "list":
        block.items.forEach((item) => {
          const prefix =
            item.checked === undefined
              ? undefined
              : new TextRun({
                  text: item.checked ? "\u2611  " : "\u2610  ",
                  font: "Arial",
                  size: 22,
                  color: MAROON,
                });
          children.push(
            new Paragraph({
              spacing: { after: 80, line: 300 },
              ...(item.checked === undefined
                ? {
                    numbering: {
                      reference: block.ordered ? "itl-numbers" : "itl-bullets",
                      level: item.depth,
                    },
                  }
                : { indent: { left: 720 + item.depth * 360, hanging: 360 } }),
              children: [...(prefix ? [prefix] : []), ...inline(item.runs)],
            }),
          );
        });
        break;

      case "table": {
        const cols = Math.max(1, block.head.length);
        const colWidth = Math.floor(CONTENT_W / cols);
        const widths = Array.from({ length: cols }, (_, i) =>
          i === cols - 1 ? CONTENT_W - colWidth * (cols - 1) : colWidth,
        );

        const headerRow = new TableRow({
          tableHeader: true,
          children: block.head.map(
            (cell, i) =>
              new TableCell({
                width: { size: widths[i], type: WidthType.DXA },
                borders: cellBorders,
                margins: cellMargins,
                verticalAlign: VerticalAlign.CENTER,
                shading: { type: ShadingType.CLEAR, fill: MAROON, color: "auto" },
                children: [
                  new Paragraph({
                    alignment: alignOf(block.align[i] ?? "left"),
                    children: cell.map(
                      (r) =>
                        new TextRun({ text: r.text, bold: true, size: 19, color: "FFFFFF", font: "Arial" }),
                    ),
                  }),
                ],
              }),
          ),
        });

        const bodyRows = block.rows.map(
          (row, rowIdx) =>
            new TableRow({
              children: row.map(
                (cell, i) =>
                  new TableCell({
                    width: { size: widths[i], type: WidthType.DXA },
                    borders: cellBorders,
                    margins: cellMargins,
                    shading:
                      rowIdx % 2 === 1
                        ? { type: ShadingType.CLEAR, fill: "FAF9FA", color: "auto" }
                        : undefined,
                    children: [
                      new Paragraph({
                        alignment: alignOf(block.align[i] ?? "left"),
                        children: inline(cell, { size: 19 }),
                      }),
                    ],
                  }),
              ),
            }),
        );

        children.push(
          new Table({
            width: { size: CONTENT_W, type: WidthType.DXA },
            columnWidths: widths,
            rows: [headerRow, ...bodyRows],
          }),
          new Paragraph({ spacing: { after: 200 }, children: [] }),
        );
        break;
      }

      case "hr":
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 180 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 1 } },
            children: [],
          }),
        );
        break;
    }
  };

  model.body.forEach(pushBlock);

  /* ---------------- Sources ---------------- */

  if (model.sources?.length) {
    children.push(
      new Paragraph({
        spacing: { before: 360, after: 160 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 4 } },
        children: [
          new TextRun({ text: "Sources & Citations", bold: true, size: 26, color: MAROON, font: "Arial" }),
        ],
      }),
    );
    model.sources.forEach((s, idx) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: `[${idx + 1}] `, bold: true, size: 19, color: MAROON, font: "Arial" }),
            new TextRun({ text: s.label, bold: true, size: 19, color: INK, font: "Arial" }),
            ...(s.documentType
              ? [new TextRun({ text: `  (${s.documentType})`, italics: true, size: 18, color: MUTED, font: "Arial" })]
              : []),
          ],
        }),
      );
      if (s.snippet) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            indent: { left: 320 },
            children: [new TextRun({ text: s.snippet, size: 17, color: MUTED, font: "Arial" })],
          }),
        );
      }
      if (s.link) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            indent: { left: 320 },
            children: [
              new ExternalHyperlink({
                children: [new TextRun({ text: s.link, size: 17, color: MAROON, underline: {}, font: "Arial" })],
                link: s.link,
              }),
            ],
          }),
        );
      }
    });
  }

  if (model.disclaimer) {
    children.push(
      new Paragraph({
        spacing: { before: 320 },
        indent: { left: 160, right: 160 },
        shading: { type: ShadingType.CLEAR, fill: "FAF8F9", color: "auto" },
        children: [
          new TextRun({ text: model.disclaimer, italics: true, size: 16, color: MUTED, font: "Arial" }),
        ],
      }),
    );
  }

  /* ---------------- Document ---------------- */

  const bulletLevels = [0, 1, 2, 3, 4].map((level) => ({
    level,
    format: LevelFormat.BULLET,
    text: ["\u2022", "\u25E6", "\u25AA", "\u2022", "\u25E6"][level],
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720 + level * 360, hanging: 360 } } },
  }));

  const numberLevels = [0, 1, 2, 3, 4].map((level) => ({
    level,
    format: [LevelFormat.DECIMAL, LevelFormat.LOWER_LETTER, LevelFormat.LOWER_ROMAN, LevelFormat.DECIMAL, LevelFormat.LOWER_LETTER][level],
    text: `%${level + 1}.`,
    alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720 + level * 360, hanging: 360 } } },
  }));

  const makeFooter = () =>
    new Footer({
      children: [
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 4 } },
          children: [
            new TextRun({
              text: `${model.brand} \u2014 Income Tax Library AI`,
              size: 16,
              color: MUTED,
              font: "Arial",
            }),
            new TextRun({ text: "\tPage ", size: 16, color: MUTED, font: "Arial" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED, font: "Arial" }),
            new TextRun({ text: " of ", size: 16, color: MUTED, font: "Arial" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: MUTED, font: "Arial" }),
          ],
        }),
      ],
    });

  return new Document({
    creator: model.brand,
    title: `${model.brand} — ${model.subtitle ?? "Response"}`,
    description: model.question ?? undefined,
    styles: { default: { document: { run: { font: "Arial", size: 22, color: INK } } } },
    numbering: {
      config: [
        { reference: "itl-bullets", levels: bulletLevels },
        { reference: "itl-numbers", levels: numberLevels },
      ],
    },
    sections: [
      {
        properties: {
          // Cover page has its own big masthead — suppress the running header there.
          titlePage: true,
          page: {
            size: { width: A4_W, height: A4_H },
            margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
          },
        },
        headers: {
          first: new Header({ children: [new Paragraph({ children: [] })] }),
          default: new Header({
            children: [
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 4 } },
                children: [
                  new TextRun({ text: model.brand, bold: true, size: 18, color: MAROON, font: "Arial" }),
                  new TextRun({ text: `\t${model.subtitle ?? ""}`, size: 16, color: MUTED, font: "Arial" }),
                ],
              }),
            ],
          }),
        },
        footers: {
          // `titlePage: true` gives page 1 its own header/footer slot — both slots
          // get the same footer so page numbering is continuous.
          first: makeFooter(),
          default: makeFooter(),
        },

        children: children as never[],
      },
    ],
  });
}
