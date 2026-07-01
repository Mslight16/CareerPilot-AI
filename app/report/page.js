"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, CheckCircle2, XCircle } from "lucide-react";
import {
  AppShell,
  PageHeader,
  LoadingSpinner,
  ScoreRing,
  ProgressTimeline,
} from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInterviewStore } from "@/lib/store";
import { callGroqJSON } from "@/lib/groq";
import { finalReportPrompt, bestAnswersDocPrompt } from "@/lib/prompts";
import { getExperienceLabel } from "@/lib/utils";

const timelineSteps = [
  { id: "intro", label: "Introduction" },
  { id: "config", label: "Configure" },
  { id: "mock", label: "Mock" },
  { id: "coding", label: "Coding" },
  { id: "report", label: "Report" },
];

export default function ReportPage() {
  const router = useRouter();
  const store = useInterviewStore();
  const {
    groqApiKey,
    groqModel,
    userName,
    finalReport,
    setFinalReport,
    setBestAnswersDoc,
    setWantsPdf,
    mockComplete,
    codingComplete,
    getJobRole,
    experienceLevel,
    mockQuestions,
    mockAnswers,
    mockFeedbacks,
    codingQuestions,
    codingSubmissions,
    codingReviews,
    introAnalysis,
  } = store;

  const role = getJobRole();
  const [loading, setLoading] = useState(false);
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mockComplete) {
      router.push("/interview");
      return;
    }
    if (role.requiresCoding && !codingComplete) {
      router.push("/coding");
    }
  }, [mockComplete, codingComplete, role.requiresCoding, router]);

  useEffect(() => {
    if (finalReport) return;

    const generate = async () => {
      setLoading(true);
      setError("");
      try {
        const report = await callGroqJSON({
          apiKey: groqApiKey,
          model: groqModel,
          prompt: finalReportPrompt({
            userName,
            role: role.label,
            experienceLevel,
            introAnalysis,
            mockQuestions,
            mockAnswers,
            mockFeedbacks,
            codingQuestions,
            codingSubmissions,
            codingReviews,
          }),
          temperature: 0.3,
          maxTokens: 6000,
        });
        setFinalReport(report);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [
    finalReport,
    groqApiKey,
    groqModel,
    userName,
    role.label,
    experienceLevel,
    introAnalysis,
    mockQuestions,
    mockAnswers,
    mockFeedbacks,
    codingQuestions,
    codingSubmissions,
    codingReviews,
    setFinalReport,
  ]);

  const handleGenerateDoc = async (wants) => {
    setWantsPdf(wants);
    if (!wants) {
      router.push("/");
      return;
    }

    setGeneratingDoc(true);
    try {
      const doc = await callGroqJSON({
        apiKey: groqApiKey,
        model: groqModel,
        prompt: bestAnswersDocPrompt({
          mockQuestions,
          mockAnswers,
          mockFeedbacks,
          codingQuestions,
          codingSubmissions,
          codingReviews,
          finalReport,
        }),
        temperature: 0.4,
        maxTokens: 8000,
      });
      setBestAnswersDoc(doc);
      router.push("/pdf");
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingDoc(false);
    }
  };

  if (loading || !finalReport) {
    return (
      <AppShell>
        <LoadingSpinner text="Generating comprehensive final report..." />
        {error && (
          <p className="text-center text-red-400 mt-4">{error}</p>
        )}
      </AppShell>
    );
  }

  const summary = finalReport.summaryScores || {};
  const recommendationColors = {
    hire: "text-emerald-400",
    maybe: "text-amber-400",
    "no-hire": "text-red-400",
  };

  return (
    <AppShell>
      <ProgressTimeline steps={timelineSteps} currentStep={4} />

      <PageHeader
        title="Final Evaluation Report"
        description={`${role.label} • ${getExperienceLabel(experienceLevel)}`}
      />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(summary).map(([key, val]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ScoreRing
              score={val}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              size={90}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {finalReport.aiFeedback}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-slate-500">Recommendation:</span>
              <span
                className={`font-semibold capitalize ${
                  recommendationColors[finalReport.recommendation] || "text-white"
                }`}
              >
                {finalReport.recommendation?.replace("-", " ")}
              </span>
              <span className="text-sm text-slate-500">•</span>
              <span className="text-sm text-indigo-300">
                Suggested Level: {finalReport.suggestedLevel}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Mock Questions</span>
              <span className="text-white">{mockAnswers.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Coding Problems</span>
              <span className="text-white">{codingSubmissions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Hiring Probability</span>
              <span className="text-emerald-400">
                {finalReport.scores?.overall?.["Hiring Probability"] || summary.overall}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {finalReport.strengths?.map((s) => (
                <li key={s} className="text-sm text-slate-300">• {s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {finalReport.weaknesses?.map((s) => (
                <li key={s} className="text-sm text-slate-300">• {s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {finalReport.scores && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(finalReport.scores).map(([category, scores]) => (
            <Card key={category}>
              <CardHeader className="py-3">
                <CardTitle className="text-sm capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {Object.entries(scores).map(([name, val]) => (
                  <div key={name} className="flex justify-between text-xs">
                    <span className="text-slate-400">{name}</span>
                    <span className="text-indigo-300">{val}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Improvement Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside">
            {finalReport.improvementPlan?.map((item) => (
              <li key={item} className="text-sm text-slate-300">{item}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {finalReport.learningResources?.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Learning Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {finalReport.learningResources.map((r) => (
                <li key={r} className="text-sm text-indigo-300">• {r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-indigo-500/30">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <h3 className="text-xl font-semibold text-white">
            Would you like to receive best answers & coding solutions as a PDF?
          </h3>
          <p className="text-slate-400 text-sm">
            Includes all questions, your answers, best professional answers, optimized code solutions, and improvement notes.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleGenerateDoc(true)}
              disabled={generatingDoc}
              size="lg"
            >
              <Download className="w-4 h-4" />
              {generatingDoc ? "Generating..." : "Yes, Generate PDF"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleGenerateDoc(false)}
              size="lg"
            >
              No, Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
