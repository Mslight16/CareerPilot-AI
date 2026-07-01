"use client";

import { useState } from "react";
import { ExternalLink, Key, Save, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useInterviewStore } from "@/lib/store";
import { GROQ_MODELS, INTERVIEWER_PERSONALITIES } from "@/lib/constants";

export default function SettingsPage() {
  const {
    groqApiKey,
    setGroqApiKey,
    groqModel,
    setGroqModel,
    interviewerPersonality,
    setInterviewerPersonality,
    userName,
    setUserName,
    resetSession,
  } = useInterviewStore();

  const [apiKeyInput, setApiKeyInput] = useState(groqApiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setGroqApiKey(apiKeyInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Configure your Groq API key and interview preferences."
      />

      <div className="max-w-2xl space-y-6">
        <Card className="border-indigo-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Groq API Key
            </CardTitle>
            <CardDescription>
              Completely free. Get your key at{" "}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                console.groq.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="gsk_..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="mt-1 font-mono"
              />
              <p className="text-xs text-slate-500 mt-1">
                Stored locally in your browser. Never sent anywhere except Groq API.
              </p>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Model</CardTitle>
            <CardDescription>Choose which Groq model powers the interview.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={groqModel}
              onChange={(e) => setGroqModel(e.target.value)}
            >
              {GROQ_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default Interviewer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {INTERVIEWER_PERSONALITIES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setInterviewerPersonality(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    interviewerPersonality === p.id
                      ? "border-indigo-500 bg-indigo-500/20"
                      : "border-white/10"
                  }`}
                >
                  <p className="text-sm font-medium">{p.label}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Display Name</Label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="mt-1"
            />
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Reset Session</CardTitle>
            <CardDescription>
              Clear current interview progress and start fresh.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={resetSession}>
              <Trash2 className="w-4 h-4" />
              Reset Interview Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-sm text-slate-500 space-y-2">
            <p className="font-medium text-slate-400">Free Tech Stack Used</p>
            <ul className="space-y-1">
              <li>• Groq API — AI (free tier)</li>
              <li>• Web Speech API — Voice recognition</li>
              <li>• SpeechSynthesis API — Text-to-speech</li>
              <li>• Monaco Editor — Code editor</li>
              <li>• jsPDF — PDF generation</li>
              <li>• Browser sandbox — JavaScript execution</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
