/**
 * src/lib/resume-parser.js
 *
 * Extracts plain text from an uploaded resume file, entirely in the browser.
 * Supports: PDF, DOCX, TXT. Legacy .doc is rejected (binary format, no
 * reliable browser parser) — ask users to export as PDF/DOCX instead.
 *
 * Install:
 *   npm install pdfjs-dist mammoth
 *
 * IMPORTANT: pdfjs-dist and mammoth touch browser-only APIs (e.g. DOMMatrix)
 * at module-load time. Since this app is server-rendered (TanStack Start),
 * a top-level `import` of either package would crash SSR the moment any
 * module that imports this file gets evaluated on the server — even if the
 * parsing function is never called there. To avoid that, both libraries are
 * imported dynamically, inside the functions that use them, so they only
 * ever load in the browser.
 */

const MIN_USABLE_CHARS = 50;

export class ResumeParseError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ResumeParseError";
    this.code = code; // "UNSUPPORTED" | "EMPTY" | "SCANNED_PDF" | "CORRUPT" | "SERVER"
  }
}

export async function extractResumeText(file) {
  if (typeof window === "undefined") {
    throw new ResumeParseError(
      "Resume parsing must run in the browser.",
      "SERVER"
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase();

  let text = "";
  if (ext === "pdf") {
    text = await extractPdfText(file);
  } else if (ext === "docx") {
    text = await extractDocxText(file);
  } else if (ext === "txt") {
    text = await file.text();
  } else if (ext === "doc") {
    throw new ResumeParseError(
      "Legacy .doc files aren't supported — please re-save as PDF or DOCX and re-upload.",
      "UNSUPPORTED"
    );
  } else {
    throw new ResumeParseError("Unsupported file type.", "UNSUPPORTED");
  }

  const cleaned = normalizeWhitespace(text);

  if (cleaned.length < MIN_USABLE_CHARS) {
    // Most common cause: a scanned/image-only PDF with no embedded text layer.
    throw new ResumeParseError(
      "Couldn't find readable text in this file. If it's a scanned PDF (i.e. a photo of your resume), export a text-based PDF from Word/Docs instead.",
      "SCANNED_PDF"
    );
  }

  return cleaned;
}

async function extractPdfText(file) {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      // Preserve line breaks reasonably well by grouping on Y position.
      let lastY = null;
      for (const item of content.items) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
          text += "\n";
        }
        text += item.str + " ";
        lastY = item.transform[5];
      }
      text += "\n\n";
    }
    return text;
  } catch (err) {
    if (err instanceof ResumeParseError) throw err;
    throw new ResumeParseError(
      "This PDF couldn't be read — it may be corrupted or password-protected.",
      "CORRUPT"
    );
  }
}

async function extractDocxText(file) {
  try {
    const mammoth = (await import("mammoth")).default;
    const buf = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
    return value;
  } catch (err) {
    throw new ResumeParseError("This DOCX file couldn't be read.", "CORRUPT");
  }
}

function normalizeWhitespace(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}