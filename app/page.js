"use client";

import { useEffect } from "react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInterviewStore } from "@/lib/store";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  MessageSquare,
  Code2,
  FileBarChart,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Mic, title: "Self Introduction", desc: "Voice or text with AI analysis" },
  { icon: MessageSquare, title: "Mock Interview", desc: "Adaptive technical & HR questions" },
  { icon: Code2, title: "Coding Round", desc: "Monaco editor with AI code review" },
  { icon: FileBarChart, title: "Final Report", desc: "20+ scores & improvement plan" },
];

const flowSteps = [
  "Self Introduction",
  "Interview Configuration",
  "Mock Interview Round",
  "Coding Round (if applicable)",
  "AI Evaluation",
  "Best Answers PDF",
];

export default function DashboardPage() {
  const { userName, setUserName, groqApiKey } = useInterviewStore();

  useEffect(() => {
    if (!userName) {
      const saved = localStorage.getItem("careerpilot-user-name");
      if (saved) setUserName(saved);
    }
  }, [userName, setUserName]);

  const handleNameChange = (e) => {
    setUserName(e.target.value);
    localStorage.setItem("careerpilot-user-name", e.target.value);
  };

  const displayName = userName || "there";

  return (
    <AppShell>
      <PageHeader
        title={`Hello ${displayName} 👋`}
        description="Welcome to CareerPilot AI — your complete AI-powered interview simulator."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="border-indigo-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Today&apos;s Interview Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                We&apos;ll conduct a realistic interview based on your chosen role.
                The interview simulates the entire hiring process — just like a real company.
              </p>

              <div className="space-y-2">
                {flowSteps.map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-300">{step}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">
                    Your name (optional)
                  </label>
                  <Input
                    placeholder="Enter your name..."
                    value={userName}
                    onChange={handleNameChange}
                  />
                </div>
              </div>

              {!groqApiKey && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
                  Add your free Groq API key in{" "}
                  <Link href="/settings" className="underline font-medium">
                    Settings
                  </Link>{" "}
                  before starting.
                </div>
              )}

              <Link href="/introduction">
                <Button className="w-full sm:w-auto mt-2" size="lg">
                  Start Interview
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:border-indigo-500/30 transition-colors">
                  <CardContent className="pt-6">
                    <div className="p-2 w-fit rounded-lg bg-indigo-500/20 mb-3">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-400">
              <p>• Use Chrome or Edge for best voice recognition</p>
              <p>• Find a quiet place for speaking answers</p>
              <p>• Groq API is completely free at console.groq.com</p>
              <p>• All data stays in your browser — no login needed</p>
              <p>• Difficulty adapts based on your answers</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                100%
              </p>
              <p className="text-sm text-slate-400 mt-1">Free to build & use</p>
              <p className="text-xs text-slate-500 mt-3">
                Groq AI + Browser APIs + No backend required
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
}
