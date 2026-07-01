"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mic, Keyboard, ArrowRight, Volume2 } from "lucide-react";
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
import { introAnalysisPrompt } from "@/lib/prompts";
import { ScoreRing } from "@/components/layout/app-shell";

const timelineSteps = [
  { id: "intro", label: "Introduction" },
  { id: "config", label: "Configure" },
  { id: "mock", label: "Mock" },
  { id: "coding", label: "Coding" },
  { id: "report", label: "Report" },
];

export default function IntroductionPage() {
  const router = useRouter();
  const {
    groqApiKey,
    groqModel,
    selfIntroduction,
    setSelfIntroduction,
    introAnalysis,
    setIntroAnalysis,
  } = useInterviewStore();

  const [mode, setMode] = useState("type");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    isListening,
    transcript,
    supported: speechSupported,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition();

  const { speak, speaking } = useSpeechSynthesis();

  const answerText = mode === "speak" ? transcript || selfIntroduction : selfIntroduction;

  const handleAnalyze = async () => {
    const text = mode === "speak" ? transcript : selfIntroduction;
    if (!text.trim()) {
      setError("Please provide your self-introduction first.");
      return;
    }

    setLoading(true);
    setError("");
    setSelfIntroduction(text);

    try {
      const analysis = await callGroqJSON({
        apiKey: groqApiKey,
        model: groqModel,
        prompt: introAnalysisPrompt(text),
        temperature: 0.3,
      });
      setIntroAnalysis(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const handleContinue = () => router.push("/configure");

  return (
    <AppShell>
      <ProgressTimeline steps={timelineSteps} currentStep={introAnalysis ? 0 : 0} />

      <PageHeader
        title="Self Introduction"
        description="Please introduce yourself in 2–3 minutes. You can speak or type."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={mode === "speak" ? "default" : "secondary"}
                size="sm"
                onClick={() => setMode("speak")}
                disabled={!speechSupported}
              >
                <Mic className="w-4 h-4" />
                Speak
              </Button>
              <Button
                variant={mode === "type" ? "default" : "secondary"}
                size="sm"
                onClick={() => setMode("type")}
              >
                <Keyboard className="w-4 h-4" />
                Type
              </Button>
            </div>

            {!speechSupported && mode === "speak" && (
              <p className="text-xs text-amber-400">
                Speech recognition not supported in this browser. Use Chrome or Edge.
              </p>
            )}

            {mode === "speak" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8 rounded-xl bg-white/5 border border-white/10">
                  <VoiceWave active={isListening} />
                </div>
                <Textarea
                  value={transcript || selfIntroduction}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    setSelfIntroduction(e.target.value);
                  }}
                  placeholder="Your speech will appear here..."
                  rows={8}
                />
                <div className="flex gap-2">
                  {!isListening ? (
                    <Button onClick={startListening} className="flex-1">
                      <Mic className="w-4 h-4" />
                      Start Speaking
                    </Button>
                  ) : (
                    <Button
                      onClick={stopListening}
                      variant="destructive"
                      className="flex-1"
                    >
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // <Textarea
              //   value={selfIntroduction}
              //   onChange={(e) => setSelfIntroduction(e.target.value)}
              //   placeholder="Hello, my name is... I am a software developer with..."
              //   rows={10}
              // />
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
                value={mode === "speak" ? transcript || selfIntroduction : selfIntroduction}
                onChange={(e) => {
                  if (mode === "speak") {
                    setTranscript(e.target.value);
                  }
                  setSelfIntroduction(e.target.value);
                }}
                placeholder="Type or speak your answer..."
                rows={8}
              />
            )}

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            {!introAnalysis ? (
              <Button
                onClick={handleAnalyze}
                disabled={loading || !answerText.trim()}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze Introduction"}
              </Button>
            ) : (
              <Button onClick={handleContinue} className="w-full">
                Continue to Configuration
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {loading && <LoadingSpinner text="Analyzing your introduction..." />}

          {introAnalysis && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    AI Analysis
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speak(introAnalysis.summary)}
                    >
                      <Volume2 className={`w-4 h-4 ${speaking ? "text-indigo-400" : ""}`} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {introAnalysis.summary}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <ScoreRing score={introAnalysis.confidence} label="Confidence" size={90} />
                <ScoreRing score={introAnalysis.communication} label="Communication" size={90} />
                <ScoreRing score={introAnalysis.professionalism} label="Professionalism" size={90} />
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-emerald-400 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {introAnalysis.strengths?.map((s) => (
                        <li key={s} className="text-sm text-slate-300">• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-2">Improvements</h4>
                    <ul className="space-y-1">
                      {introAnalysis.improvements?.map((s) => (
                        <li key={s} className="text-sm text-slate-300">• {s}</li>
                      ))}
                    </ul>
                  </div>
                  {introAnalysis.fillerWords?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-400 mb-2">Filler Words</h4>
                      <p className="text-sm text-slate-400">
                        {introAnalysis.fillerWords.join(", ")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <p className="text-center text-indigo-300 font-medium">
                Great! Now let&apos;s configure your interview.
              </p>
            </motion.div>
          )}

          {!introAnalysis && !loading && (
            <Card>
              <CardContent className="pt-6 text-sm text-slate-400 space-y-2">
                <p>Tips for a great introduction:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Start with your name and current role</li>
                  <li>Mention relevant experience and skills</li>
                  <li>Highlight 1-2 key achievements</li>
                  <li>Explain why you&apos;re interested in this field</li>
                  <li>Keep it under 3 minutes</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
