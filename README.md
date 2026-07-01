# CareerPilot AI

A complete **AI-powered interview preparation platform** that simulates the entire hiring process — from self-introduction to mock interviews, coding rounds, and a detailed final report with PDF export.

Built entirely with **free tools**. No backend database. No login required.

## Getting Started

### 1. Get a free Groq API key

Visit [console.groq.com](https://console.groq.com) and create a free account.

### 2. Install & run

```bash
cd careerpilot-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Add API key

Go to **Settings** and paste your Groq API key. It's stored locally in your browser.

## Interview Flow

```
Dashboard → Self Introduction → Configuration → Mock Interview → Coding Round → Final Report → PDF
```
## ✨ Features

### 👤 AI Self Introduction Analysis
- Text or Voice introduction
- AI communication analysis
- Confidence score
- Professionalism score
- Communication score
- Personalized improvement suggestions

---

### ⚙️ Interview Configuration
- Multiple job roles
- Experience level selection
- Subject selection
- Coding language selection
- Interview personality selection
- Interview rules before starting

---

### 🎤 AI Mock Interview
- AI-generated interview questions
- Voice-to-Text support
- Text answer mode
- AI interviewer personality
- Adaptive question difficulty
- Real-time answer evaluation
- Previous answer feedback
- Text-to-Speech interviewer
- Timer during interview

---

### 💻 AI Coding Interview
- AI-generated coding problems
- Monaco Code Editor
- Multiple programming languages
- JavaScript code execution
- AI code review
- Time & Space Complexity analysis
- Coding hints
- Optimized solution feedback
- Coding performance evaluation

---

### 📊 Final AI Report
- Overall interview score
- Communication analysis
- Technical analysis
- Coding analysis
- Confidence analysis
- Strengths & weaknesses
- Hiring recommendation
- Suggested experience level
- Personalized improvement roadmap
- Learning resources

---

### 📄 PDF Report
Generate a professional PDF containing:

- Interview questions
- Your answers
- Best AI-generated answers
- Coding solutions
- Optimized code
- Complexity analysis
- Improvement notes

---

## 🛡️ Anti-Cheating Features

- Copy prevention
- Paste prevention
- Cut prevention
- Drag & Drop prevention
- Context menu disabled
- Keyboard shortcut blocking
- Tab switching detection
- Secure interview environment

---

## 🎯 Supported Job Roles

### Coding Roles
- Software Engineer
- Frontend Developer
- Backend Developer
- Full Stack Developer
- React Developer
- Node.js Developer
- Java Developer
- Python Developer
- DevOps Engineer
- Data Scientist
- Machine Learning Engineer

### Non-Coding Roles
- Network Engineer
- System Administrator
- IT Support Engineer
- Technical Support Engineer
- QA Manual Tester
- Cyber Security Analyst
- Database Administrator
- Cloud Support Associate
- Business Analyst
- Product Manager

---

## Tech Stack (100% Free)

| Tool | Purpose |
|------|---------|
| **Next.js + React** | Frontend framework |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Groq API** | AI (Llama 3.3 70B, DeepSeek R1, Qwen) |
| **Web Speech API** | Voice recognition |
| **SpeechSynthesis API** | Text-to-speech |
| **Monaco Editor** | VS Code-like code editor |
| **jsPDF** | PDF generation |
| **Zustand** | In-browser state |


## Browser Recommendations

- **Chrome or Edge** for best speech recognition
- Allow microphone permission when using voice input

## Project Structure

```
app/
  page.js              # Dashboard
  introduction/        # Step 1: Self intro
  configure/           # Step 2: Role & subjects
  interview/           # Step 3: Mock interview
  coding/              # Step 4: Coding round
  report/              # Step 5: Final evaluation
  pdf/                 # Step 6: Best answers document
  settings/            # API key & preferences
  api/groq/            # Thin Groq API proxy
components/            # UI components
lib/                   # Store, prompts, PDF, constants
hooks/                 # Speech recognition & synthesis
```

## License

MIT — Free to use for portfolio and learning.
