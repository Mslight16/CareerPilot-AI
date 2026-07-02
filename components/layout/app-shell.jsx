"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Code2,
  FileText,
  User,
  ClipboardList,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useInterviewStore } from "@/lib/store";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/introduction", label: "Introduction", icon: User },
  { href: "/configure", label: "Configure", icon: ClipboardList },
  { href: "/interview", label: "Interview", icon: MessageSquare },
  { href: "/coding", label: "Coding", icon: Code2 },
  { href: "/report", label: "Report", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const progress = useInterviewStore((s) => s.getProgress());

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[128px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="CareerPilot AI"
              width={45}
              height={45}
              priority
            />

            <span className="hidden sm:block font-bold text-lg bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                  pathname === href
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Progress */}
            <div className="text-right">
              <p className="text-[10px] text-slate-500">
                Progress
              </p>

              <p className="text-sm font-semibold text-indigo-300">
                {progress.percent}%
              </p>
            </div>

            <div className="w-28 sm:w-24 h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10 bg-[#0a0a12]/95 backdrop-blur-xl"
            >
              <div className="flex flex-col py-2">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 transition-colors",
                      pathname === href
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
export function PageHeader({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-slate-400 text-lg max-w-2xl">
          {description}
        </p>
      )}

      {children}
    </motion.div>
  );
}

export function LoadingSpinner({ text = "AI is thinking..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />

        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
      </div>

      <p className="text-slate-400 animate-pulse">
        {text}
      </p>
    </div>
  );
}

export function ScoreRing({
  score,
  label,
  size = 100,
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />

          <defs>
            <linearGradient
              id="gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#6366f1"
              />
              <stop
                offset="100%"
                stopColor="#a855f7"
              />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {score}%
          </span>
        </div>
      </div>

      <span className="text-xs text-slate-400 text-center">
        {label}
      </span>
    </div>
  );
}

export function VoiceWave({ active }) {
  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-indigo-500 rounded-full"
          animate={
            active
              ? {
                  height: [
                    8,
                    24,
                    12,
                    28,
                    8,
                  ],
                }
              : {
                  height: 8,
                }
          }
          transition={
            active
              ? {
                  repeat: Infinity,
                  duration: 0.8,
                  delay: i * 0.1,
                }
              : {}
          }
        />
      ))}
    </div>
  );
}
export function ProgressTimeline({ steps, currentStep }) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex items-center min-w-max sm:min-w-0 sm:justify-between pb-2">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className="flex items-center flex-1 min-w-[72px] sm:min-w-0"
          >
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  i <= currentStep
                    ? "bg-indigo-500 border-indigo-400 text-white"
                    : "bg-transparent border-white/20 text-slate-500"
                )}
              >
                {i + 1}
              </div>

              <span
                className={cn(
                  "mt-2 text-[10px] sm:text-xs text-center whitespace-nowrap px-1",
                  i <= currentStep
                    ? "text-indigo-300"
                    : "text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2",
                  i < currentStep
                    ? "bg-indigo-500"
                    : "bg-white/10"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}