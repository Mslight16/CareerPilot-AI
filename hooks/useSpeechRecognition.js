// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";

// export function useSpeechRecognition() {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [supported, setSupported] = useState(false);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     const SpeechRecognition =
//       typeof window !== "undefined" &&
//       (window.SpeechRecognition || window.webkitSpeechRecognition);
//     setSupported(!!SpeechRecognition);

//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = "en-US";

//       // recognition.onresult = (event) => {
//       //   let finalTranscript = "";
//       //   for (let i = event.resultIndex; i < event.results.length; i++) {
//       //     finalTranscript += event.results[i][0].transcript;
//       //   }
//       //   setTranscript((prev) => {
//       //     const base = prev.split(" ").slice(0, -1).join(" ");
//       //     return finalTranscript || base;
//       //   });
//       // };
//       let finalText = "";

// recognition.onresult = (event) => {
//   let interimText = "";

//   for (let i = event.resultIndex; i < event.results.length; i++) {
//     const text = event.results[i][0].transcript;

//     if (event.results[i].isFinal) {
//       finalText += text + " ";
//     } else {
//       interimText += text;
//     }
//   }

//   setTranscript(finalText + interimText);
// };

//       recognition.onend = () => setIsListening(false);
//       recognition.onerror = () => setIsListening(false);
//       recognitionRef.current = recognition;
//     }

//     return () => {
//       recognitionRef.current?.stop();
//     };
//   }, []);

//   const startListening = useCallback(() => {
//     if (!recognitionRef.current) return;
//     setTranscript("");
//     setIsListening(true);
//     recognitionRef.current.start();
//   }, []);

//   const stopListening = useCallback(() => {
//     recognitionRef.current?.stop();
//     setIsListening(false);
//   }, []);

//   const resetTranscript = useCallback(() => setTranscript(""), []);

//   return {
//     isListening,
//     transcript,
//     supported,
//     startListening,
//     stopListening,
//     resetTranscript,
//     setTranscript,
//   };
// }
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);

  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setSupported(!!SpeechRecognition);

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalTranscriptRef.current += text + " ";
        } else {
          interimTranscript += text;
        }
      }

      setTranscript(
        (finalTranscriptRef.current + interimTranscript).trim()
      );
    };

    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch (err) {
          // Ignore "already started" errors
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event) => {
      console.log("Speech Recognition Error:", event.error);

      if (
        event.error === "no-speech" ||
        event.error === "audio-capture"
      ) {
        return;
      }

      if (!listeningRef.current) {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      listeningRef.current = false;
      recognition.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    finalTranscriptRef.current = "";
    setTranscript("");

    listeningRef.current = true;
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch (err) {
      // Ignore if already started
    }
  }, []);

  const stopListening = useCallback(() => {
    listeningRef.current = false;
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = "";
    setTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    supported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
}