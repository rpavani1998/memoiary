"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, MapPin, User, Tag, Volume2, Image as ImageIcon } from "lucide-react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";

export interface MemoryDetailData {
  id: string;
  date: string;
  title: string;
  content: string;
  people?: string[];
  place?: string;
  topic?: string;
  photoUrl?: string;
  voiceUrl?: string;
  hasAudio?: boolean;
}

interface Props {
  memory: MemoryDetailData | null;
  onClose: () => void;
}

export function MemoryDetailModal({ memory, onClose }: Props) {
  if (!memory) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-[#FAF7F2] border border-[#E8E2D9] rounded-3xl p-7 shadow-xl relative max-h-[90vh] overflow-y-auto space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Date Header */}
          <div className="space-y-1 pr-8">
            <p className="text-xs uppercase tracking-widest text-stone-500 font-sans-clean font-medium">
              {memory.date}
            </p>
            {memory.title && (
              <h2 className="font-serif-editorial text-2xl font-medium text-stone-900 leading-snug">
                {memory.title}
              </h2>
            )}
          </div>

          {/* Main Narrative Content */}
          <div className="prose prose-stone">
            <p className="font-serif-editorial text-base text-stone-800 leading-relaxed whitespace-pre-line">
              {memory.content}
            </p>
          </div>

          {/* Divider */}
          <hr className="border-[#E8E2D9]" />

          {/* Clean Context Metadata Section (People, Place, Topic) */}
          <div className="space-y-3 font-sans-clean text-xs">
            {memory.people && memory.people.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium w-14">People</span>
                <div className="flex flex-wrap gap-1.5">
                  {memory.people.map((person, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-[#E8E2D9] rounded-full text-stone-800 font-medium"
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {memory.place && (
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium w-14">Place</span>
                <span className="px-2.5 py-1 bg-[#FAF0EB] border border-[#E8E2D9] rounded-full text-[#E09885] font-medium flex items-center gap-1">
                  <HandDrawnIllustration type="place" size={16} />
                  {memory.place}
                </span>
              </div>
            )}

            {memory.topic && (
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium w-14">Topic</span>
                <span className="px-2.5 py-1 bg-stone-100 rounded-full text-stone-700 font-medium">
                  {memory.topic}
                </span>
              </div>
            )}
          </div>

          {/* Media Section */}
          {(memory.photoUrl || memory.hasAudio) && (
            <div className="space-y-3 pt-2">
              {memory.photoUrl && (
                <div className="rounded-2xl overflow-hidden border border-[#E8E2D9]">
                  <img
                    src={memory.photoUrl}
                    alt={memory.title}
                    className="w-full max-h-56 object-cover"
                  />
                </div>
              )}

              {memory.hasAudio && (
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#E8E2D9] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF0EB] flex items-center justify-center text-[#E09885]">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-stone-700">
                      Voice Recording attached
                    </span>
                  </div>
                  <button className="px-3 py-1 bg-[#E09885] text-white text-xs font-medium rounded-full hover:bg-[#D48875] cursor-pointer">
                    Play
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
