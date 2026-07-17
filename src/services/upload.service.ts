import type { UploadedFile } from "@/types/cms";

export type UploadKind = "pdf" | "docx" | "image" | "excel" | "csv" | "zip";

export const acceptedMime: Record<UploadKind, string[]> = {
  pdf: ["application/pdf"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  image: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  excel: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  csv: ["text/csv"],
  zip: ["application/zip", "application/x-zip-compressed"],
};

/** Simulated upload — reports progress via callback. Replace with axios upload later. */
export function mockUpload(
  file: File,
  onProgress: (p: number) => void,
): Promise<UploadedFile> {
  return new Promise((resolve) => {
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        p = 100;
        onProgress(p);
        clearInterval(timer);
        resolve({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 100,
          status: "done",
          url: URL.createObjectURL(file),
        });
      } else onProgress(p);
    }, 220);
  });
}

export const uploadService = { mockUpload };
