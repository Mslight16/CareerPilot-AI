"use client";

import { jsPDF } from "jspdf";
import { APP_NAME } from "./constants";

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 6) {
  const lines = doc.splitTextToSize(text || "", maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function generateInterviewPDF({ doc: content, userName, finalReport }) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const checkPage = (needed = 20) => {
    if (y + needed > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  pdf.setFontSize(22);
  pdf.setTextColor(99, 102, 241);
  pdf.text(content?.title || `${APP_NAME} - Best Answers`, margin, y);
  y += 10;

  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Candidate: ${userName || "Candidate"}`, margin, y);
  y += 6;
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);
  y += 12;

  if (finalReport?.summaryScores) {
    pdf.setFontSize(14);
    pdf.setTextColor(30, 30, 30);
    pdf.text("Overall Scores", margin, y);
    y += 8;
    pdf.setFontSize(11);
    Object.entries(finalReport.summaryScores).forEach(([key, val]) => {
      checkPage();
      pdf.text(`${key}: ${val}%`, margin, y);
      y += 6;
    });
    y += 6;
  }

  content?.sections?.forEach((section) => {
    checkPage(20);
    pdf.setFontSize(16);
    pdf.setTextColor(99, 102, 241);
    pdf.text(section.heading, margin, y);
    y += 10;

    section.items?.forEach((item, idx) => {
      checkPage(40);
      pdf.setFontSize(12);
      pdf.setTextColor(30, 30, 30);
      pdf.text(`Q${idx + 1}: ${item.question || item.title || ""}`, margin, y);
      y += 7;

      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);

      if (item.yourAnswer) {
        pdf.text("Your Answer:", margin, y);
        y += 5;
        y = addWrappedText(pdf, item.yourAnswer, margin, y, maxWidth) + 4;
      }

      if (item.bestAnswer) {
        checkPage();
        pdf.setTextColor(34, 139, 34);
        pdf.text("Best Answer:", margin, y);
        y += 5;
        y = addWrappedText(pdf, item.bestAnswer, margin, y, maxWidth) + 4;
      }

      if (item.yourCode) {
        checkPage();
        pdf.setTextColor(80, 80, 80);
        pdf.text("Your Code:", margin, y);
        y += 5;
        y = addWrappedText(pdf, item.yourCode, margin, y, maxWidth) + 4;
      }

      if (item.optimizedSolution) {
        checkPage();
        pdf.setTextColor(34, 139, 34);
        pdf.text("Optimized Solution:", margin, y);
        y += 5;
        y = addWrappedText(pdf, item.optimizedSolution, margin, y, maxWidth) + 4;
      }

      if (item.complexity) {
        checkPage();
        pdf.text(`Complexity: ${item.complexity}`, margin, y);
        y += 6;
      }

      if (item.tips || item.explanation) {
        checkPage();
        y = addWrappedText(
          pdf,
          item.tips || item.explanation,
          margin,
          y,
          maxWidth
        ) + 8;
      }
    });
  });

  if (content?.improvementNotes?.length) {
    checkPage(20);
    pdf.setFontSize(16);
    pdf.setTextColor(99, 102, 241);
    pdf.text("Improvement Notes", margin, y);
    y += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(30, 30, 30);
    content.improvementNotes.forEach((note) => {
      checkPage();
      y = addWrappedText(pdf, `• ${note}`, margin, y, maxWidth) + 2;
    });
  }

  return pdf;
}

export function downloadPDF(pdf, filename = "careerpilot-interview-report.pdf") {
  pdf.save(filename);
}

export function getPDFTextContent({ doc: content, userName, finalReport }) {
  let text = `${content?.title || "CareerPilot AI Report"}\n\n`;
  text += `Candidate: ${userName || "Candidate"}\n`;
  text += `Date: ${new Date().toLocaleDateString()}\n\n`;

  if (finalReport?.summaryScores) {
    text += "OVERALL SCORES\n";
    Object.entries(finalReport.summaryScores).forEach(([k, v]) => {
      text += `${k}: ${v}%\n`;
    });
    text += "\n";
  }

  content?.sections?.forEach((section) => {
    text += `\n=== ${section.heading} ===\n\n`;
    section.items?.forEach((item, i) => {
      text += `Q${i + 1}: ${item.question || item.title}\n`;
      if (item.yourAnswer) text += `Your Answer: ${item.yourAnswer}\n`;
      if (item.bestAnswer) text += `Best Answer: ${item.bestAnswer}\n`;
      if (item.yourCode) text += `Your Code:\n${item.yourCode}\n`;
      if (item.optimizedSolution)
        text += `Solution:\n${item.optimizedSolution}\n`;
      if (item.complexity) text += `Complexity: ${item.complexity}\n`;
      text += "\n";
    });
  });

  if (content?.improvementNotes?.length) {
    text += "\nIMPROVEMENT NOTES\n";
    content.improvementNotes.forEach((n) => (text += `• ${n}\n`));
  }

  return text;
}
