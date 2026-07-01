import { MOCK_QUESTION_COUNT, CODING_QUESTION_COUNT } from "./constants";
import { getExperienceLabel } from "./utils";

export function introAnalysisPrompt(introduction) {
  return `Analyze this self-introduction for a job interview. Return ONLY valid JSON:
{
  "confidence": number 0-100,
  "grammar": number 0-100,
  "communication": number 0-100,
  "structure": number 0-100,
  "professionalism": number 0-100,
  "clarity": number 0-100,
  "speakingPace": "slow|moderate|fast",
  "fillerWords": ["list of detected filler words or empty array"],
  "missingInfo": ["what's missing from a good intro"],
  "strengths": ["2-3 strengths"],
  "improvements": ["2-3 improvements"],
  "summary": "2 sentence summary"
}

Self-introduction:
${introduction}`;
}

export function generateMockQuestionsPrompt({
  role,
  experienceLevel,
  subjects,
  personality,
  count = MOCK_QUESTION_COUNT,
}) {
  const level = getExperienceLabel(experienceLevel);
  const includeSystemDesign = experienceLevel >= 5;
  const includeLeadership = experienceLevel >= 10;

  return `Generate ${count} interview questions for a ${role} candidate at experience level: ${level} (${experienceLevel}/10+).

Subjects to cover (distribute across questions): ${subjects.join(", ")}
Interviewer style: ${personality}

Include mix of: Technical, Scenario-based, Behavioral, HR${includeSystemDesign ? ", System Design" : ""}${includeLeadership ? ", Leadership" : ""}.

Return ONLY valid JSON array:
[
  {
    "id": 1,
    "type": "technical|behavioral|hr|scenario|system-design|leadership",
    "subject": "subject name",
    "question": "the question",
    "difficulty": 1-10
  }
]`;
}

export function evaluateMockAnswerPrompt({
  question,
  answer,
  role,
  experienceLevel,
  personality,
}) {
  return `Evaluate this interview answer. Interviewer style: ${personality}.
Role: ${role}, Experience: ${getExperienceLabel(experienceLevel)}

Question: ${question.question}
Type: ${question.type}
Subject: ${question.subject}

Candidate's Answer:
${answer}

Return ONLY valid JSON:
{
  "scores": {
    "confidence": 0-100,
    "technical": 0-100,
    "communication": 0-100,
    "accuracy": 0-100,
    "depth": 0-100
  },
  "feedback": "brief constructive feedback",
  "strengths": ["1-2 strengths"],
  "weaknesses": ["1-2 weaknesses"],
  "suggestedDifficultyChange": -1|0|1,
  "realTimeCue": "short cue like 'Good explanation' or 'Please elaborate'"
}`;
}

export function generateCodingQuestionsPrompt({
  role,
  experienceLevel,
  languages,
  subjects,
  count = CODING_QUESTION_COUNT,
}) {
  return `Generate ${count} coding interview questions for ${role} at level ${getExperienceLabel(experienceLevel)} (${experienceLevel}/10+).

Languages allowed: ${languages.join(", ")}
Related subjects: ${subjects.join(", ")}

Return ONLY valid JSON array:
[
  {
    "id": 1,
    "title": "Problem title",
    "description": "Full problem description with examples",
    "constraints": ["constraint1", "constraint2"],
    "examples": [{"input": "...", "output": "...", "explanation": "..."}],
    "difficulty": 1-10,
    "language": "preferred language",
    "starterCode": "// starter code template",
    "topics": ["topic1", "topic2"]
  }
]`;
}

export function reviewCodePrompt({ question, code, language }) {
  return `Review this coding interview submission.

Problem: ${question.title}
${question.description}

Language: ${language}
Code:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Return ONLY valid JSON:
{
  "scores": {
    "correctness": 0-100,
    "readability": 0-100,
    "naming": 0-100,
    "logic": 0-100,
    "optimization": 0-100,
    "edgeCases": 0-100,
    "complexity": 0-100,
    "cleanCode": 0-100
  },
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "bugs": ["list bugs or empty"],
  "feedback": "detailed feedback",
  "betterSolution": "optimized solution code",
  "alternativeSolution": "alternative approach code",
  "industryStandard": "industry standard solution code",
  "hints": ["hint if needed"]
}`;
}

export function finalReportPrompt(state) {
  const {
    userName,
    role,
    experienceLevel,
    introAnalysis,
    mockQuestions,
    mockAnswers,
    mockFeedbacks,
    codingQuestions,
    codingSubmissions,
    codingReviews,
  } = state;

  return `Generate a comprehensive final interview report for ${userName || "the candidate"}.

Role: ${role}
Experience Level: ${getExperienceLabel(experienceLevel)} (${experienceLevel}/10+)

Introduction Analysis: ${JSON.stringify(introAnalysis)}

Mock Interview:
${mockQuestions.map((q, i) => `Q${i + 1}: ${q.question}\nA: ${mockAnswers[i] || "N/A"}\nFeedback: ${JSON.stringify(mockFeedbacks[i] || {})}`).join("\n\n")}

Coding Round:
${codingQuestions.map((q, i) => `Q${i + 1}: ${q.title}\nCode: ${codingSubmissions[i]?.code || "N/A"}\nReview: ${JSON.stringify(codingReviews[i] || {})}`).join("\n\n")}

Return ONLY valid JSON:
{
  "scores": {
    "communication": { "Confidence": 0-100, "Grammar": 0-100, "Vocabulary": 0-100, "Professionalism": 0-100, "Fluency": 0-100, "Tone": 0-100, "Clarity": 0-100 },
    "technical": { "Concepts": 0-100, "Problem Solving": 0-100, "Logic": 0-100, "Accuracy": 0-100, "Knowledge Depth": 0-100 },
    "coding": { "Correctness": 0-100, "Optimization": 0-100, "Complexity Analysis": 0-100, "Readability": 0-100, "Edge Cases": 0-100, "Clean Code": 0-100, "Naming": 0-100 },
    "overall": { "Interview Readiness": 0-100, "Company Fit": 0-100, "Experience Match": 0-100, "Hiring Probability": 0-100 }
  },
  "summaryScores": {
    "confidence": 0-100,
    "technical": 0-100,
    "communication": 0-100,
    "coding": 0-100,
    "problemSolving": 0-100,
    "overall": 0-100
  },
  "recommendation": "hire|maybe|no-hire",
  "suggestedLevel": "string",
  "strengths": ["3-5 strengths"],
  "weaknesses": ["3-5 weaknesses"],
  "improvementPlan": ["5 actionable items"],
  "learningResources": ["5 free resource suggestions"],
  "aiFeedback": "2-3 paragraph overall feedback"
}`;
}

export function bestAnswersDocPrompt(state) {
  return `Create best answers document content for this interview session.

${JSON.stringify({
  mockQuestions: state.mockQuestions,
  mockAnswers: state.mockAnswers,
  mockFeedbacks: state.mockFeedbacks,
  codingQuestions: state.codingQuestions,
  codingSubmissions: state.codingSubmissions,
  codingReviews: state.codingReviews,
  finalReport: state.finalReport,
})}

Return ONLY valid JSON:
{
  "title": "CareerPilot AI - Interview Best Answers",
  "sections": [
    {
      "heading": "Mock Interview",
      "items": [
        {
          "question": "...",
          "yourAnswer": "...",
          "bestAnswer": "professional ideal answer",
          "tips": "improvement tips"
        }
      ]
    },
    {
      "heading": "Coding Solutions",
      "items": [
        {
          "question": "...",
          "yourCode": "...",
          "optimizedSolution": "...",
          "complexity": "Time/Space",
          "explanation": "..."
        }
      ]
    }
  ],
  "improvementNotes": ["list of notes"]
}`;
}

export function hintPrompt({ question, code, language }) {
  return `Give a helpful hint (not full solution) for this coding problem.

Problem: ${question.title}
${question.description}

Current code:
${code || "No code yet"}

Language: ${language}

Return ONLY valid JSON: { "hint": "helpful hint without giving away full solution" }`;
}
