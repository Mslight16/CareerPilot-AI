"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  AppShell,
  PageHeader,
  ProgressTimeline,
} from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  Slider,
  Checkbox,
  Label,
} from "@/components/ui/input";
import { useInterviewStore } from "@/lib/store";
import {
  JOB_ROLES,
  CODING_LANGUAGES,
  INTERVIEW_RULES,
  INTERVIEWER_PERSONALITIES,
} from "@/lib/constants";
import { getExperienceLabel } from "@/lib/utils";

const timelineSteps = [
  { id: "intro", label: "Introduction" },
  { id: "config", label: "Configure" },
  { id: "mock", label: "Mock" },
  { id: "coding", label: "Coding" },
  { id: "report", label: "Report" },
];

export default function ConfigurePage() {
  const router = useRouter();
  const [subjectWarning, setSubjectWarning] = useState(false);
  const [langWarning, setLangWarning] = useState(false);

  const {
    jobRoleId,
    setJobRoleId,
    experienceLevel,
    setExperienceLevel,
    selectedSubjects,
    toggleSubject,
    selectedCodingLanguages,
    toggleCodingLanguage,
    rulesAccepted,
    setRulesAccepted,
    interviewerPersonality,
    setInterviewerPersonality,
    getJobRole,
  } = useInterviewStore();

  const role = getJobRole();

  const handleSubjectToggle = (subject) => {
    const ok = toggleSubject(subject);
    if (!ok) setSubjectWarning(true);
    else setSubjectWarning(false);
  };

  const handleLangToggle = (lang) => {
    const ok = toggleCodingLanguage(lang);
    if (!ok) setLangWarning(true);
    else setLangWarning(false);
  };

  const handleStart = () => {
    if (!rulesAccepted) return;
    router.push("/interview");
  };

  return (
    <AppShell>
      <ProgressTimeline steps={timelineSteps} currentStep={1} />

      <PageHeader
        title="Interview Configuration"
        description="Select your job role, experience level, and subjects for the mock interview."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={jobRoleId}
                onChange={(e) => setJobRoleId(e.target.value)}
              >
                {JOB_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Experience Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Experience</span>
                <span className="text-indigo-300 font-medium">
                  {getExperienceLabel(experienceLevel)}
                </span>
              </div>
              <Slider
                min={0}
                max={12}
                step={1}
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Intern</span>
                <span>1-2 Yrs</span>
                <span>3-5 Yrs</span>
                <span>5-8 Yrs</span>
                <span>8-10 Yrs</span>
                <span>10+</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interviewer Personality</CardTitle>
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
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{p.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subject Selection</CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                Questions will be from these subjects. Remove any you don&apos;t want — at least one required.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                {role.subjects.map((subject) => (
                  <Checkbox
                    key={subject}
                    label={subject}
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                  />
                ))}
              </div>
              {subjectWarning && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-amber-400 text-sm mt-3"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Please select at least one subject.
                </motion.p>
              )}
            </CardContent>
          </Card>

          {role.requiresCoding && (
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-base">Coding Languages</CardTitle>
                <p className="text-xs text-slate-500 mt-1">
  Select one or more programming languages for the coding technical round — at least one required.
</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {CODING_LANGUAGES.map((lang) => (
                    <Checkbox
                      key={lang}
                      label={lang}
                      checked={selectedCodingLanguages.includes(lang)}
                      onChange={() => handleLangToggle(lang)}
                    />
                  ))}
                </div>
                {langWarning && (
                  <p className="flex items-center gap-2 text-amber-400 text-sm mt-3">
                    <AlertTriangle className="w-4 h-4" />
                    At least one coding language required.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interview Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                {INTERVIEW_RULES.map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    {rule}
                  </li>
                ))}
              </ul>
              <Label className="flex items-center gap-2 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                  className="h-4 w-4 rounded accent-indigo-500"
                />
                I understand and accept the interview rules
              </Label>
              <Button
                onClick={handleStart}
                disabled={!rulesAccepted || selectedSubjects.length === 0}
                className="w-full mt-2"
                size="lg"
              >
                Start Interview
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
