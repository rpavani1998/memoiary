"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Image as ImageIcon, Video, Paperclip } from "lucide-react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";

interface TextCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, mediaType?: string) => Promise<void>;
  initialType?: "text" | "photo" | "video" | "attach";
}

export function TextCaptureModal({
  isOpen,
  onClose,
  onSave,
  initialType = "text",
}: TextCaptureModalProps) {
  const [text, setText] = useState("");
  const [mediaType, setMediaType] = useState<string | null>(
    initialType !== "text" ? initialType : null
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setIsSaving(true);
      await onSave(text, mediaType || undefined);
      setText("");
      setMediaType(null);
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
          className="w-full max-w-lg bg-[#FAF7F2] border border-[#E8E2D9] rounded-3xl p-6 shadow-xl relative space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D9]">
            <div className="flex items-center gap-2">
              <HandDrawnIllustration type="notebook" size={28} />
              <h3 className="font-serif-editorial text-lg font-medium text-stone-800">
                Write a Memory
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind? Tell your memory naturally..."
              className="w-full h-36 font-sans-clean text-base text-stone-800 bg-white border border-[#E8E2D9] rounded-2xl p-4 outline-none resize-none focus:border-[#E09885] transition-colors leading-relaxed"
              autoFocus
            />

            {/* Media Attachment Indicators */}
            {mediaType && (
              <div className="flex items-center justify-between px-3 py-2 bg-[#FAF0EB] border border-[#E8E2D9] rounded-xl text-xs text-stone-700">
                <span className="capitalize font-medium text-[#E09885]">
                  {mediaType} Attached
                </span>
                <button
                  type="button"
                  onClick={() => setMediaType(null)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Toolbar & Save */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMediaType("photo")}
                  className={`p-2 rounded-xl text-stone-600 hover:bg-white transition-colors cursor-pointer ${
                    mediaType === "photo" ? "bg-white text-[#E09885]" : ""
                  }`}
                  title="Attach photo"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("video")}
                  className={`p-2 rounded-xl text-stone-600 hover:bg-white transition-colors cursor-pointer ${
                    mediaType === "video" ? "bg-white text-[#E09885]" : ""
                  }`}
                  title="Attach video"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("file")}
                  className={`p-2 rounded-xl text-stone-600 hover:bg-white transition-colors cursor-pointer ${
                    mediaType === "file" ? "bg-white text-[#E09885]" : ""
                  }`}
                  title="Attach note or document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={isSaving || !text.trim()}
                className="px-6 py-2.5 bg-[#E09885] hover:bg-[#D48875] text-white text-xs font-medium rounded-full shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : "Remember"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
