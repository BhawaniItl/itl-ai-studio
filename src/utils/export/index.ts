/* eslint-disable prettier/prettier */
import type { ChatMessage } from "@/types";
import { buildExportDocument } from "./buildDocument";
import type { ExportDocument } from "./types";

export type { ExportDocument, Block, InlineRun } from "./types";
export { parseMarkdown, parseInline } from "./markdownParser";
export { buildExportDocument } from "./buildDocument";

export interface ExportOptions {
  message: ChatMessage;
  /** The user prompt that produced this answer, shown as the document "Query". */
  question?: string;
  /** e.g. "Notice Reply", "Case Law Research" — becomes the document subtitle. */
  subtitle?: string;
}

const saveBlob = async (blob: Blob, filename: string) => {
  const { saveAs } = await import("file-saver");
  saveAs(blob, filename);
};

/** Renders the message as a paginated, branded PDF and triggers the download. */
export async function exportMessageAsPdf(opts: ExportOptions): Promise<void> {
  const model: ExportDocument = buildExportDocument(opts);
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const { renderPdf } = await import("./pdfExporter");

  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  doc.setProperties({
    title: `${model.brand} — ${model.subtitle ?? "Response"}`,
    subject: model.question ?? "",
    author: model.brand,
    creator: model.brand,
  });

  renderPdf(doc, autoTableModule.default, model);
  await saveBlob(doc.output("blob"), `${model.fileName}.pdf`);
}

/** Renders the message as a real .docx document and triggers the download. */
export async function exportMessageAsWord(opts: ExportOptions): Promise<void> {
  const model: ExportDocument = buildExportDocument(opts);
  const docx = await import("docx");
  const { buildDocx } = await import("./wordExporter");

  const blob = await docx.Packer.toBlob(buildDocx(docx, model));
  await saveBlob(blob, `${model.fileName}.docx`);
}
