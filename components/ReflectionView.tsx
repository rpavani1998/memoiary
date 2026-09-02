"use client";

import React, { useState } from "react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";
import { Send, Mic } from "lucide-react";

interface ReflectionMessage {
  id: string;
  sender: "you" | "assistant";
  text: string;
}

export function ReflectionView() {
  const [messages, setMessages] = useState<ReflectionMessage[]>([
    {
      id: "1",
      sender: "you",
      text: "I've been thinking about CU again.",
    },
    {
      id: "2",
      sender: "assistant",
      text: "You'd mentioned the project the last time you talked about her. What happened?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ReflectionMessage = {
      id: Date.now().toString(),
      sender: "you",
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsReplying(true);

    // Simulate calm memory assistant reply after 1s
    setTimeout(() => {
      const assistantMsg: ReflectionMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "That makes sense. It seems like when you two work together at Blue Tokai, ideas flow quickly but execution details create friction. How do you feel about bringing it up next time?",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsReplying(false);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-32">
      {/* Calm Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="flex justify-center">
          <img src="/logo-mark.png" alt="Memoiary Icon" className="h-16 w-auto object-contain" />
        </div>
        <h2 className="font-serif-editorial text-2xl font-medium text-stone-900">
          Reflect with Memoiary
        </h2>
        <p className="text-xs text-stone-500 font-sans-clean">
          A quiet sounding board weaving your scattered thoughts into interconnected clarity.
        </p>
      </div>

      <hr className="border-[#E8E2D9]" />

      {/* Calm Dialogue Surface (NO typical chat bubbles) */}
      <div className="space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold font-sans-clean">
              {msg.sender === "you" ? "You" : "Memoiary"}
            </span>
            <p
              className={`font-serif-editorial text-base leading-relaxed ${
                msg.sender === "you"
                  ? "text-stone-900 font-medium"
                  : "text-stone-700 italic border-l-2 border-[#E09885]/60 pl-4 py-1"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}

        {isReplying && (
          <div className="space-y-1 py-2">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold font-sans-clean">
              Memoiary
            </span>
            <p className="font-serif-editorial italic text-[#E09885] text-sm animate-pulse">
              Weaving your thoughts into memory...
            </p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="fixed bottom-20 left-0 right-0 max-w-xl mx-auto px-4 z-20">
        <form
          onSubmit={handleSend}
          className="bg-white border border-[#E8E2D9] rounded-2xl p-2 shadow-md flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share what's on your mind..."
            className="flex-1 px-4 py-2.5 text-sm font-serif-editorial text-stone-800 placeholder-stone-400 outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#E09885] hover:bg-[#D48875] text-white rounded-xl cursor-pointer disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
