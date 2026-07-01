"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, Check, Home } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInterviewStore } from "@/lib/store";
import {
  generateInterviewPDF,
  downloadPDF,
  getPDFTextContent,
} from "@/lib/pdf";

export default function PDFPage() {
  const router = useRouter();
  const { bestAnswersDoc, finalReport, userName, resetSession } =
    useInterviewStore();
  const [copied, setCopied] = useState(false);

  if (!bestAnswersDoc) {
    return (
      <AppShell>
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-12">
            <p className="text-slate-400 mb-4">No document generated yet.</p>
            <Button onClick={() => router.push("/report")}>
              Go to Report
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const textContent = getPDFTextContent({
    doc: bestAnswersDoc,
    userName,
    finalReport,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const pdf = generateInterviewPDF({
      doc: bestAnswersDoc,
      userName,
      finalReport,
    });
    downloadPDF(pdf, `careerpilot-${userName || "interview"}-report.pdf`);
  };

  const handleNewSession = () => {
    resetSession();
    router.push("/");
  };

  return (
    <AppShell>
      <PageHeader
        title="Best Answers & Solutions"
        description="Your personalized interview preparation document."
      />

      <div className="flex gap-3 mb-6">
        <Button onClick={handleCopy} variant="secondary">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Document"}
        </Button>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button onClick={handleNewSession} variant="outline">
          <Home className="w-4 h-4" />
          New Interview
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{bestAnswersDoc.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {bestAnswersDoc.sections?.map((section) => (
            <div key={section.heading}>
              <h3 className="text-lg font-semibold text-indigo-300 mb-4">
                {section.heading}
              </h3>
              <div className="space-y-6">
                {section.items?.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <p className="font-medium text-white">
                      Q{i + 1}: {item.question || item.title}
                    </p>
                    {item.yourAnswer && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Your Answer</p>
                        <p className="text-sm text-slate-300">{item.yourAnswer}</p>
                      </div>
                    )}
                    {item.bestAnswer && (
                      <div>
                        <p className="text-xs text-emerald-500 mb-1">Best Answer</p>
                        <p className="text-sm text-emerald-100">{item.bestAnswer}</p>
                      </div>
                    )}
                    {item.yourCode && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Your Code</p>
                        <pre className="text-xs font-mono text-slate-300 bg-black/30 p-3 rounded-lg overflow-x-auto">
                          {item.yourCode}
                        </pre>
                      </div>
                    )}
                    {item.optimizedSolution && (
                      <div>
                        <p className="text-xs text-emerald-500 mb-1">Optimized Solution</p>
                        <pre className="text-xs font-mono text-emerald-100 bg-black/30 p-3 rounded-lg overflow-x-auto">
                          {item.optimizedSolution}
                        </pre>
                      </div>
                    )}
                    {(item.complexity || item.tips || item.explanation) && (
                      <p className="text-xs text-slate-400">
                        {item.complexity && `Complexity: ${item.complexity}`}
                        {item.tips || item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {bestAnswersDoc.improvementNotes?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">
                Improvement Notes
              </h3>
              <ul className="space-y-1">
                {bestAnswersDoc.improvementNotes.map((note) => (
                  <li key={note} className="text-sm text-slate-300">• {note}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
