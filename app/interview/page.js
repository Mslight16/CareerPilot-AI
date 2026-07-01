"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Keyboard,
  ArrowRight,
  Volume2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  AppShell,
  PageHeader,
  LoadingSpinner,
  VoiceWave,
  ProgressTimeline,
} from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useInterviewStore } from "@/lib/store";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { callGroqJSON } from "@/lib/groq";
import {
  generateMockQuestionsPrompt,
  evaluateMockAnswerPrompt,
} from "@/lib/prompts";
import { MOCK_QUESTION_COUNT } from "@/lib/constants";

const timelineSteps = [
  { id: "intro", label: "Introduction" },
  { id: "config", label: "Configure" },
  { id: "mock", label: "Mock" },
  { id: "coding", label: "Coding" },
  { id: "report", label: "Report" },
];

export default function InterviewPage() {
  const router = useRouter();
  const store = useInterviewStore();
  const {
    groqApiKey,
    groqModel,
    mockQuestions,
    setMockQuestions,
    mockAnswers,
    mockFeedbacks,
    addMockAnswer,
    currentMockIndex,
    mockComplete,
    setMockComplete,
    adaptiveDifficulty,
    setAdaptiveDifficulty,
    getJobRole,
    experienceLevel,
    selectedSubjects,
    interviewerPersonality,
    rulesAccepted,
  } = store;

  const role = getJobRole();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState("type");
  const [elapsed, setElapsed] = useState(0);
  const [realTimeCue, setRealTimeCue] = useState("");
  const [tabWarnings, setTabWarnings] = useState(0);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition();

  const { speak, speaking } = useSpeechSynthesis();

  useEffect(() => {
    if (!rulesAccepted) {
      router.push("/configure");
    }
  }, [rulesAccepted, router]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) setTabWarnings((w) => w + 1);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const loadQuestions = useCallback(async () => {
    if (mockQuestions.length > 0) return;
    setLoading(true);
    setError("");
    try {
      const questions = await callGroqJSON({
        apiKey: groqApiKey,
        model: groqModel,
        prompt: generateMockQuestionsPrompt({
          role: role.label,
          experienceLevel,
          subjects: selectedSubjects,
          personality: interviewerPersonality,
        }),
        temperature: 0.8,
      });
      setMockQuestions(Array.isArray(questions) ? questions : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [
    mockQuestions.length,
    groqApiKey,
    groqModel,
    role.label,
    experienceLevel,
    selectedSubjects,
    interviewerPersonality,
    setMockQuestions,
  ]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const currentQuestion = mockQuestions[currentMockIndex];
  const answerText = mode === "speak" ? transcript || answer : answer;

  useEffect(() => {
    if (currentQuestion) {
      speak(`Question ${currentMockIndex + 1}. ${currentQuestion.question}`);
    }
  }, [currentQuestion, currentMockIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmitAnswer = async () => {
    const finalAnswer = mode === "speak" ? transcript : answer;
    if (!finalAnswer.trim() || !currentQuestion) return;

    setSubmitting(true);
    setError("");

    try {
      const feedback = await callGroqJSON({
        apiKey: groqApiKey,
        model: groqModel,
        prompt: evaluateMockAnswerPrompt({
          question: currentQuestion,
          answer: finalAnswer,
          role: role.label,
          experienceLevel,
          personality: interviewerPersonality,
        }),
        temperature: 0.3,
      });

      setRealTimeCue(feedback.realTimeCue || "");
      const change = feedback.suggestedDifficultyChange || 0;
      setAdaptiveDifficulty(
        Math.min(12, Math.max(0, adaptiveDifficulty + change))
      );

      addMockAnswer(finalAnswer, feedback);
      setAnswer("");
      setTranscript("");

      if (currentMockIndex + 1 >= MOCK_QUESTION_COUNT) {
        setMockComplete(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (role.requiresCoding) {
      router.push("/coding");
    } else {
      router.push("/report");
    }
  };
  useEffect(() => {

    const handler = (e) => {

      if (e.ctrlKey || e.metaKey) {

        const blocked = [
          "c",
          "v",
          "x",
          "a",
          "z",
          "y"
        ];

        if (blocked.includes(e.key.toLowerCase())) {

          e.preventDefault();

        }

      }

    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);

  }, []);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (loading) {
    return (
      <AppShell>
        <LoadingSpinner text="Generating interview questions..." />
      </AppShell>
    );
  }

  if (mockComplete) {
    return (
      <AppShell>
        <ProgressTimeline steps={timelineSteps} currentStep={2} />
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-12 pb-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              Mock Interview Complete!
            </h2>
            <p className="text-slate-400 mb-6">
              You answered {mockAnswers.length} questions.
              {role.requiresCoding
                ? " Time for the coding technical round."
                : " Let's generate your final report."}
            </p>
            <Button onClick={handleContinue} size="lg">
              {role.requiresCoding ? "Start Coding Round" : "View Final Report"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ProgressTimeline steps={timelineSteps} currentStep={2} />

      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Mock Interview"
          description={`Question ${currentMockIndex + 1} of ${MOCK_QUESTION_COUNT}`}
        />
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-4 h-4" />
            {formatTime(elapsed)}
          </div>
          {tabWarnings > 0 && (
            <div className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              Tab switches: {tabWarnings}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-indigo-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {currentQuestion?.type?.toUpperCase()} — {currentQuestion?.subject}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => speak(currentQuestion?.question)}
                >
                  <Volume2 className={speaking ? "text-indigo-400" : ""} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{currentQuestion?.question || ""}</ReactMarkdown>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span>Difficulty: {currentQuestion?.difficulty || adaptiveDifficulty}/10</span>
                <span>•</span>
                <span>Adaptive: {adaptiveDifficulty}/10+</span>
              </div>
            </CardContent>
          </Card>

          {mockFeedbacks.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-indigo-400 font-medium">Previous Feedback</p>
                <p className="text-sm text-slate-400 mt-1">
                  {mockFeedbacks[mockFeedbacks.length - 1]?.feedback}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={mode === "speak" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setMode("speak")}
                >
                  <Mic className="w-4 h-4" /> Speak
                </Button>
                <Button
                  variant={mode === "type" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setMode("type")}
                >
                  <Keyboard className="w-4 h-4" /> Type
                </Button>
              </div>

              {mode === "speak" && (
                <div className="flex justify-center py-4">
                  <VoiceWave active={isListening} />
                </div>
              )}

              <Textarea

                onPaste={(e) => {
                  e.preventDefault();
                  alert("Pasting is disabled during the interview.");
                }}

                onCopy={(e) => {
                  e.preventDefault();
                }}

                onCut={(e) => {
                  e.preventDefault();
                }}

                onDrop={(e) => {
                  e.preventDefault();
                }}

                onDragOver={(e) => {
                  e.preventDefault();
                }}

                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                value={mode === "speak" ? transcript || answer : answer}
                onChange={(e) => {
                  if (mode === "speak") setTranscript(e.target.value);
                  else setAnswer(e.target.value);
                }}
                placeholder="Type or speak your answer..."
                rows={8}
              />

              <AnimatePresence>
                {realTimeCue && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-emerald-400"
                  >
                    {realTimeCue}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                {mode === "speak" && (
                  !isListening ? (
                    <Button variant="secondary" onClick={startListening}>
                      <Mic className="w-4 h-4" /> Record
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={stopListening}>
                      Stop
                    </Button>
                  )
                )}
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !answerText.trim()}
                  className="flex-1"
                >
                  {submitting ? "Evaluating..." : "Submit Answer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
