"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JOB_ROLES, MOCK_QUESTION_COUNT, CODING_QUESTION_COUNT } from "./constants";

const defaultRole = JOB_ROLES[0];
let cachedProgress = null;
let cachedProgressKey = null;

function computeProgress(state) {
  const role = JOB_ROLES.find((r) => r.id === state.jobRoleId) || defaultRole;
  const mockTotal = MOCK_QUESTION_COUNT;
  const codingTotal = role.requiresCoding ? CODING_QUESTION_COUNT : 0;
  const total = 1 + 1 + mockTotal + codingTotal + 1;
  let completed = 0;
  if (state.selfIntroduction) completed += 1;
  if (state.introAnalysis) completed += 1;
  completed += Math.min(state.currentMockIndex, mockTotal);
  if (state.mockComplete) completed += mockTotal - state.currentMockIndex;
  completed += state.currentCodingIndex;
  if (state.finalReport) completed += 1;

  const percent = Math.round((completed / total) * 100);
  return { completed, total, percent };
}

export const useInterviewStore = create(
  persist(
    (set, get) => ({
      userName: "",
      groqApiKey: "",
      groqModel: "llama-3.3-70b-versatile",
      interviewerPersonality: "professional",

      selfIntroduction: "",
      introAnalysis: null,

      jobRoleId: defaultRole.id,
      experienceLevel: 3,
      selectedSubjects: [...defaultRole.subjects],
      selectedCodingLanguages: [],
      rulesAccepted: false,

      adaptiveDifficulty: 5,
      mockQuestions: [],
      mockAnswers: [],
      mockFeedbacks: [],
      currentMockIndex: 0,
      mockComplete: false,

      codingQuestions: [],
      codingSubmissions: [],
      codingReviews: [],
      currentCodingIndex: 0,
      codingComplete: false,

      finalReport: null,
      bestAnswersDoc: null,
      wantsPdf: false,

      setUserName: (userName) => set({ userName }),
      setGroqApiKey: (groqApiKey) => set({ groqApiKey }),
      setGroqModel: (groqModel) => set({ groqModel }),
      setInterviewerPersonality: (interviewerPersonality) =>
        set({ interviewerPersonality }),

      setSelfIntroduction: (selfIntroduction) => set({ selfIntroduction }),
      setIntroAnalysis: (introAnalysis) => set({ introAnalysis }),

      setJobRoleId: (jobRoleId) => {
        const role = JOB_ROLES.find((r) => r.id === jobRoleId) || defaultRole;
        set({
          jobRoleId,
          selectedSubjects: [...role.subjects],
        });
      },
      setExperienceLevel: (experienceLevel) => set({ experienceLevel }),
      toggleSubject: (subject) => {
        const current = get().selectedSubjects;
        if (current.includes(subject)) {
          if (current.length <= 1) return false;
          set({ selectedSubjects: current.filter((s) => s !== subject) });
        } else {
          set({ selectedSubjects: [...current, subject] });
        }
        return true;
      },
      toggleCodingLanguage: (lang) => {
        const current = get().selectedCodingLanguages;
        if (current.includes(lang)) {
          if (current.length <= 1) return false;
          set({
            selectedCodingLanguages: current.filter((l) => l !== lang),
          });
        } else {
          set({ selectedCodingLanguages: [...current, lang] });
        }
        return true;
      },
      setRulesAccepted: (rulesAccepted) => set({ rulesAccepted }),

      setAdaptiveDifficulty: (adaptiveDifficulty) =>
        set({ adaptiveDifficulty }),

      setMockQuestions: (mockQuestions) => set({ mockQuestions }),
      addMockAnswer: (answer, feedback) => {
        const { mockAnswers, mockFeedbacks, currentMockIndex } = get();
        set({
          mockAnswers: [...mockAnswers, answer],
          mockFeedbacks: [...mockFeedbacks, feedback],
          currentMockIndex: currentMockIndex + 1,
        });
      },
      setMockComplete: (mockComplete) => set({ mockComplete }),

      setCodingQuestions: (codingQuestions) => set({ codingQuestions }),
      addCodingSubmission: (submission, review) => {
        const { codingSubmissions, codingReviews, currentCodingIndex } = get();
        set({
          codingSubmissions: [...codingSubmissions, submission],
          codingReviews: [...codingReviews, review],
          currentCodingIndex: currentCodingIndex + 1,
        });
      },
      setCodingComplete: (codingComplete) => set({ codingComplete }),

      setFinalReport: (finalReport) => set({ finalReport }),
      setBestAnswersDoc: (bestAnswersDoc) => set({ bestAnswersDoc }),
      setWantsPdf: (wantsPdf) => set({ wantsPdf }),

      resetSession: () =>
        set({
          selfIntroduction: "",
          introAnalysis: null,
          experienceLevel: 3,
          selectedSubjects: [...defaultRole.subjects],
          selectedCodingLanguages: [],
          rulesAccepted: false,
          adaptiveDifficulty: 5,
          mockQuestions: [],
          mockAnswers: [],
          mockFeedbacks: [],
          currentMockIndex: 0,
          mockComplete: false,
          codingQuestions: [],
          codingSubmissions: [],
          codingReviews: [],
          currentCodingIndex: 0,
          codingComplete: false,
          finalReport: null,
          bestAnswersDoc: null,
          wantsPdf: false,
        }),

      getJobRole: () =>
        JOB_ROLES.find((r) => r.id === get().jobRoleId) || defaultRole,

      getProgress: () => {
        const state = get();
        const key = [
          state.selfIntroduction,
          state.introAnalysis,
          state.currentMockIndex,
          state.mockComplete,
          state.currentCodingIndex,
          state.finalReport,
          state.jobRoleId,
        ].join("|");

        if (cachedProgressKey === key && cachedProgress) {
          return cachedProgress;
        }

        cachedProgressKey = key;
        cachedProgress = computeProgress(state);
        return cachedProgress;
      },
    }),
    {
      name: "careerpilot-storage",
      partialize: (state) => ({
        userName: state.userName,
        groqApiKey: state.groqApiKey,
        groqModel: state.groqModel,
        interviewerPersonality: state.interviewerPersonality,
      }),
    }
  )
);
