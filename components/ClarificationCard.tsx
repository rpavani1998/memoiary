"use client";

import React, { useState } from "react";
import { ClarificationItem } from "@/lib/context/JournalContext";
import { HandDrawnIllustration } from "./HandDrawnIllustration";
import { X, Send } from "lucide-react";

interface ClarificationCardProps {
  clarification: ClarificationItem;
  onConfirm: (id: string) => Promise<void>;
  onReject: (id: string, reason?: string) => Promise<void>;
  onCorrect: (id: string, customCorrection: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
}

export function ClarificationCard({
  clarification,
  onConfirm,
  onReject,
  onCorrect,
  onDismiss,
}: ClarificationCardProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(clarification.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      await onReject(clarification.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    try {
      setIsSubmitting(true);
      await onCorrect(clarification.id, customText.trim());
      setIsCustomOpen(false);
      setCustomText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#E8E2D9] rounded-2xl p-5 shadow-xs relative transition-all my-3">
      {/* Top row with hand-drawn question illustration */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="p-1 bg-[#FAF0EB] rounded-full border border-[#E8E2D9] shrink-0 mt-0.5">
            <HandDrawnIllustration type="question" size={32} />
          </div>

          <div className="space-y-1">
            <p className="font-serif-editorial text-base font-medium text-stone-900 leading-snug">
              {clarification.question}
            </p>

            {clarification.context && (
              <p className="text-xs text-stone-600 font-sans-clean leading-relaxed">
                {clarification.context}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onDismiss(clarification.id)}
          disabled={isSubmitting}
          className="text-stone-400 hover:text-stone-700 p-1 transition-colors rounded-full cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Options & Input */}
      {!isCustomOpen ? (
        <div className="mt-4 pt-3 border-t border-[#E8E2D9]/60 flex flex-wrap items-center gap-2.5 pl-11">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-[#E09885] hover:bg-[#D48875] text-white text-xs font-medium rounded-full shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Yes
          </button>

          <button
            onClick={handleReject}
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-white hover:bg-stone-100 border border-[#E8E2D9] text-stone-700 text-xs font-medium rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            No
          </button>

          <button
            onClick={() => setIsCustomOpen(true)}
            disabled={isSubmitting}
            className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-2 transition-colors cursor-pointer ml-1"
          >
            or tell me what you meant...
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleCustomSubmit}
          className="mt-4 pt-3 border-t border-[#E8E2D9]/60 pl-11 space-y-2"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Tell me what you meant..."
              className="flex-1 text-xs px-3.5 py-2 bg-white border border-[#E8E2D9] rounded-xl outline-none focus:border-[#E09885] text-stone-800 font-sans-clean"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSubmitting || !customText.trim()}
              className="px-3.5 py-2 bg-[#E09885] hover:bg-[#D48875] text-white text-xs font-medium rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsCustomOpen(false)}
              className="px-2.5 py-2 text-stone-500 hover:text-stone-800 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
