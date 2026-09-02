"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Mic, AlertCircle } from "lucide-react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";
import { VoiceWeaveAnimation } from "./VoiceWeaveAnimation";

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVoice: (transcript: string) => Promise<void>;
}

export function VoiceRecorderModal({ isOpen, onClose, onSaveVoice }: VoiceRecorderModalProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Timer counter
  useEffect(() => {
    let timer: any;
    if (isOpen && isRecording) {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isOpen, isRecording]);

  // Live Speech Recognition Initialization
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      return;
    }

    setTranscript("");
    setSpeechError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setTranscript("Met CU at Blue Tokai. We talked about startup ideas and prototyping next steps.");
      return;
    }

    setSpeechSupported(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let liveText = "";
        for (let i = 0; i < event.results.length; i++) {
          liveText += event.results[i][0].transcript;
        }
        if (liveText.trim()) {
          setTranscript(liveText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setSpeechError("Microphone permission blocked. Click to allow mic access or type your voice memory below.");
        }
      };

      recognition.onend = () => {
        if (isRecording && isOpen) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.warn("Failed to start speech recognition:", err);
      setSpeechError("Could not access microphone automatically.");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isOpen, isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    } else {
      setIsRecording(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    }
  };

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDone = async () => {
    try {
      setIsSaving(true);
      const finalText = transcript.trim() || "Captured voice memory";
      await onSaveVoice(finalText);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-[#FAF7F2] border border-[#E8E2D9] rounded-3xl p-5 sm:p-8 shadow-xl text-center space-y-4 sm:space-y-6 relative max-h-[92vh] overflow-y-auto"
        >
          {/* Header close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hand drawn mic icon top */}
          <div className="flex justify-center pt-2">
            <HandDrawnIllustration type="microphone" size={54} />
          </div>

          {/* Timer Display */}
          <div className="space-y-1">
            <span className="font-serif-editorial text-3xl font-medium tracking-wider text-stone-800">
              {formatTimer(seconds)}
            </span>
            <p className="text-xs text-stone-500 font-sans-clean">
              {isRecording ? "Listening to your voice live..." : "Recording paused"}
            </p>
          </div>

          {/* Central Animated Voice Weave ◉ */}
          <div className="py-2 flex justify-center items-center cursor-pointer" onClick={toggleRecording} title={isRecording ? "Tap to pause" : "Tap to resume"}>
            <VoiceWeaveAnimation isRecording={isRecording} audioLevel={isRecording ? 0.6 : 0} />
          </div>

          {/* Microphone permission / browser warning */}
          {speechError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{speechError}</span>
            </div>
          )}

          {/* Live transcript text area */}
          <div className="pt-1">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speak now... your words will appear here live."
              className="w-full text-sm font-serif-editorial text-stone-800 bg-white border border-[#E8E2D9] rounded-2xl p-4 outline-none resize-none h-28 focus:border-[#E09885] leading-relaxed shadow-2xs"
            />
          </div>

          {/* Controls: Cancel / Done */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-stone-100 border border-[#E8E2D9] text-stone-700 text-sm font-medium rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              disabled={isSaving || !transcript.trim()}
              className="px-6 py-2.5 bg-[#E09885] hover:bg-[#D48875] text-white text-sm font-medium rounded-full shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {isSaving ? "Remembering..." : "Done"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
