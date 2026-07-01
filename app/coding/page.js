"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Play,
  RotateCcw,
  Send,
  Lightbulb,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  AppShell,
  PageHeader,
  LoadingSpinner,
  ProgressTimeline,
} from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { useInterviewStore } from "@/lib/store";
import { callGroqJSON } from "@/lib/groq";
import {
  generateCodingQuestionsPrompt,
  reviewCodePrompt,
  hintPrompt,
} from "@/lib/prompts";
import { CODING_QUESTION_COUNT } from "@/lib/constants";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-80 flex items-center justify-center bg-slate-900 rounded-xl">
      Loading editor...
    </div>
  ),
});

const timelineSteps = [
  { id: "intro", label: "Introduction" },
  { id: "config", label: "Configure" },
  { id: "mock", label: "Mock" },
  { id: "coding", label: "Coding" },
  { id: "report", label: "Report" },
];

const LANGUAGE_MAP = {
  JavaScript: "javascript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
  "C#": "csharp",
  Go: "go",
  Rust: "rust",
  TypeScript: "typescript",
  Kotlin: "kotlin",
  Swift: "swift",
};

function runJavaScript(code) {
  const logs = [];
  const customConsole = {
    log: (...args) => logs.push(args.map(String).join(" ")),
    error: (...args) => logs.push("ERROR: " + args.map(String).join(" ")),
  };

  try {
    const fn = new Function("console", code);
    fn(customConsole);
    return { success: true, output: logs.join("\n") || "Code executed successfully (no output)" };
  } catch (err) {
    return { success: false, output: err.message };
  }
}

export default function CodingPage() {
  const router = useRouter();
  const {
    groqApiKey,
    groqModel,
    getJobRole,
    experienceLevel,
    selectedSubjects,
    selectedCodingLanguages,
    mockComplete,
    codingQuestions,
    setCodingQuestions,
    codingSubmissions,
    codingReviews,
    addCodingSubmission,
    currentCodingIndex,
    codingComplete,
    setCodingComplete,
  } = useInterviewStore();

  const role = getJobRole();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(selectedCodingLanguages[0] || "JavaScript");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [hint, setHint] = useState("");
  const [showConstraints, setShowConstraints] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [lastReview, setLastReview] = useState(null);

  useEffect(() => {
    if (!role.requiresCoding) {
      router.push("/report");
      return;
    }
    if (!mockComplete) {
      router.push("/interview");
    }
  }, [role.requiresCoding, mockComplete, router]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadQuestions = useCallback(async () => {
    if (codingQuestions.length > 0) {
      const q = codingQuestions[currentCodingIndex];
      if (q) setCode(q.starterCode || "");
      return;
    }
    setLoading(true);
    try {
      const questions = await callGroqJSON({
        apiKey: groqApiKey,
        model: groqModel,
        prompt: generateCodingQuestionsPrompt({
          role: role.label,
          experienceLevel,
          languages: selectedCodingLanguages,
          subjects: selectedSubjects,
        }),
        temperature: 0.7,
      });
      const qs = Array.isArray(questions) ? questions : [];
      setCodingQuestions(qs);
      if (qs[0]?.starterCode) setCode(qs[0].starterCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    codingQuestions,
    currentCodingIndex,
    groqApiKey,
    groqModel,
    role.label,
    experienceLevel,
    selectedCodingLanguages,
    selectedSubjects,
    setCodingQuestions,
  ]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const currentQuestion = codingQuestions[currentCodingIndex];

  useEffect(() => {
    if (currentQuestion?.starterCode && currentCodingIndex > 0) {
      setCode(currentQuestion.starterCode);
      setHint("");
      setLastReview(null);
    }
  }, [currentCodingIndex, currentQuestion]);

  const handleRun = () => {
    if (language === "JavaScript") {
      const result = runJavaScript(code);
      setConsoleOutput(result.output);
    } else {
      setConsoleOutput(
        `Code execution for ${language} uses AI evaluation.\nFor JavaScript, use Run to execute in browser sandbox.\nFor Python, Pyodide can be added later.\nSubmit your code for AI review.`
      );
    }
  };

  const handleReset = () => {
    setCode(currentQuestion?.starterCode || "");
    setConsoleOutput("");
    setHint("");
  };

  const handleHint = async () => {
    if (!currentQuestion) return;
    setHintLoading(true);
    try {
      const result = await callGroqJSON({
        apiKey: groqApiKey,
        model: groqModel,
        prompt: hintPrompt({ question: currentQuestion, code, language }),
        temperature: 0.5,
      });
      setHint(result.hint);
    } catch (err) {
      setError(err.message);
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim() || !currentQuestion) return;
    setSubmitting(true);
    setError("");
    try {
      const review = await callGroqJSON({
        apiKey: groqApiKey,
        model: groqModel,
        prompt: reviewCodePrompt({ question: currentQuestion, code, language }),
        temperature: 0.3,
        maxTokens: 6000,
      });

      setLastReview(review);
      addCodingSubmission({ code, language }, review);

      if (currentCodingIndex + 1 >= CODING_QUESTION_COUNT) {
        setCodingComplete(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleEditorMount = (editor) => {

    editor.onKeyDown((e) => {

      if (
        (e.ctrlKey || e.metaKey) &&
        ["V", "C", "X", "A"].includes(e.code.replace("Key", ""))
      ) {

        e.preventDefault();

        e.stopPropagation();

      }

    });

    editor.onDidPaste(() => {

      editor.executeEdits("", []);

    });

  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (loading) {
    return (
      <AppShell>
        <LoadingSpinner text="Generating coding questions..." />
      </AppShell>
    );
  }

  if (codingComplete) {
    return (
      <AppShell>
        <ProgressTimeline steps={timelineSteps} currentStep={3} />
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-12 pb-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              Coding Round Complete!
            </h2>
            <p className="text-slate-400 mb-6">
              AI has reviewed your {codingSubmissions.length} coding submissions.
            </p>
            <Button onClick={() => router.push("/report")} size="lg">
              View Final Report
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ProgressTimeline steps={timelineSteps} currentStep={3} />

      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Coding Technical Round"
          description={`Problem ${currentCodingIndex + 1} of ${CODING_QUESTION_COUNT}`}
        />
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          {formatTime(elapsed)}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-purple-500/20">
          <CardHeader>
            <CardTitle>{currentQuestion?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{currentQuestion?.description || ""}</ReactMarkdown>
            </div>

            {currentQuestion?.examples?.map((ex, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 text-sm font-mono">
                <p className="text-slate-400">Input: {ex.input}</p>
                <p className="text-emerald-400">Output: {ex.output}</p>
                {ex.explanation && (
                  <p className="text-slate-500 mt-1">{ex.explanation}</p>
                )}
              </div>
            ))}

            <button
              onClick={() => setShowConstraints(!showConstraints)}
              className="flex items-center gap-1 text-sm text-indigo-400"
            >
              {showConstraints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Constraints
            </button>
            {showConstraints && (
              <ul className="text-sm text-slate-400 list-disc list-inside">
                {currentQuestion?.constraints?.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}

            {hint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
              >
                <p className="text-sm text-amber-200 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> {hint}
                </p>
              </motion.div>
            )}

            {lastReview && (
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                <p className="text-sm font-medium text-indigo-300">AI Review</p>
                <p className="text-sm text-slate-300">{lastReview.feedback}</p>
                <p className="text-xs text-slate-500">
                  Time: {lastReview.timeComplexity} | Space: {lastReview.spaceComplexity}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-40"
            >
              {selectedCodingLanguages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
            <Button variant="secondary" size="sm" onClick={handleRun}>
              <Play className="w-4 h-4" /> Run
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleHint} disabled={hintLoading}>
              <Lightbulb className="w-4 h-4" />
              {hintLoading ? "..." : "Hint"}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} size="sm">
              <Send className="w-4 h-4" />
              {submitting ? "Reviewing..." : "Submit"}
            </Button>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10">
            <MonacoEditor
              height="320px"
              language={LANGUAGE_MAP[language] || "javascript"}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },

                fontSize: 14,

                padding: { top: 16 },

                scrollBeyondLastLine: false,

                contextmenu: false,

                copyWithSyntaxHighlighting: false,

                quickSuggestions: false,

                suggestOnTriggerCharacters: false,

                acceptSuggestionOnCommitCharacter: false,

                acceptSuggestionOnEnter: "off",

                dragAndDrop: false,
              }}
            />
          </div>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Console</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap min-h-[60px]">
                {consoleOutput || "Run your code to see output..."}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
