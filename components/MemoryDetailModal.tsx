"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Play,
  Pause,
  MapPin,
  UserRound,
  Heart,
  PenLine,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Compass,
  FileText,
  Brain,
  Volume2,
} from "lucide-react";

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
  mood?: string;
  tone?: string;
  emotions?: { label: string }[];
  evolution?: {
    month: string;
    stage: "THOUGHT" | "QUESTION" | "EXPLORATION" | "DECISION" | "OUTCOME";
    text: string;
    tags?: string[];
    imageUrl?: string;
  }[];
}

interface Props {
  memory: MemoryDetailData | null;
  onClose: () => void;
}

export function MemoryDetailModal({ memory, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"raw" | "analyzed">("analyzed");
  const [isPlaying, setIsPlaying] = useState(false);

  if (!memory) return null;

  const defaultEvolution = memory.evolution || [
    {
      month: "April",
      stage: "THOUGHT" as const,
      text: "Sometimes I wonder if I could just build it myself.",
    },
    {
      month: "June",
      stage: "QUESTION" as const,
      text: memory.people?.length
        ? `${memory.people[0]} thinks I'm crazy for even considering leaving a stable job, but she also admitted the prototype looks solid.`
        : "Sarah thinks I'm crazy for even considering leaving a stable job, but she also admitted the prototype looks solid.",
    },
    {
      month: "August",
      stage: "EXPLORATION" as const,
      text: "I'm seriously thinking about leaving.",
      tags: ["Financials mapped", "Domain bought"],
    },
    {
      month: "September",
      stage: "DECISION" as const,
      text: "I decided I'm going to try.",
    },
    {
      month: "December",
      stage: "OUTCOME" as const,
      text: "You did.",
      imageUrl: memory.photoUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "THOUGHT":
        return <Brain size={14} className="text-[#665F56]" />;
      case "QUESTION":
        return <HelpCircle size={14} className="text-[#D97706]" />;
      case "EXPLORATION":
        return <Compass size={14} className="text-[#2563EB]" />;
      case "DECISION":
        return <CheckCircle2 size={14} className="text-[#166534]" />;
      case "OUTCOME":
        return <Heart size={14} className="text-[#DE5239]" />;
      default:
        return <Sparkles size={14} className="text-[#DE5239]" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-3xl p-6 sm:p-7 shadow-[4px_6px_0px_#1C1917] relative max-h-[92vh] overflow-y-auto space-y-5"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#665F56] hover:text-[#1C1917] p-2 rounded-full cursor-pointer border border-[#1C1917]/20 bg-[#F5F1E8]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 pr-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] leading-snug">
              {memory.title || "Starting my own company"}
            </h2>
            <p className="text-xs text-[#665F56] font-sans font-medium">
              An evolving thought thread.
            </p>
          </div>

          {/* Dual Tab Switcher: RAW vs ANALYZED */}
          <div className="flex border-b border-[#1C1917]/15 pb-1 gap-4">
            <button
              onClick={() => setActiveTab("analyzed")}
              className={`flex items-center gap-1.5 pb-2 text-xs font-sans font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === "analyzed"
                  ? "border-[#DE5239] text-[#DE5239]"
                  : "border-transparent text-[#665F56] hover:text-[#1C1917]"
              }`}
            >
              <Brain size={14} /> Understood &amp; Analyzed
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`flex items-center gap-1.5 pb-2 text-xs font-sans font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === "raw"
                  ? "border-[#DE5239] text-[#DE5239]"
                  : "border-transparent text-[#665F56] hover:text-[#1C1917]"
              }`}
            >
              <FileText size={14} /> RAW Input
            </button>
          </div>

          {/* TAB 1: RAW INPUT */}
          {activeTab === "raw" && (
            <div className="space-y-4 pt-1">
              <div className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#665F56] font-sans block mb-1">
                  Raw Written Text
                </span>
                <p className="font-serif text-base text-[#1C1917] leading-relaxed italic">
                  &ldquo;{memory.content}&rdquo;
                </p>
              </div>

              {/* Raw Audio Player if audio present */}
              {(memory.hasAudio || memory.voiceUrl) && (
                <div className="p-4 bg-[#F5E5DC] border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-[#DE5239] text-white flex items-center justify-center cursor-pointer border border-[#1C1917] shadow-xs"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-[#1C1917] block font-sans">
                        Original Voice Note
                      </span>
                      <span className="text-[10px] text-[#665F56] font-sans">
                        0:42 • Recorded live
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 items-center h-5">
                    {[12, 20, 16, 28, 22, 14, 24, 18, 10, 26, 16].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all ${
                          isPlaying ? "bg-[#DE5239] animate-pulse" : "bg-[#1C1917]/30"
                        }`}
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Photo if photo present */}
              {memory.photoUrl && (
                <div className="rounded-2xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917]">
                  <img src={memory.photoUrl} alt="Raw memory photo" className="w-full max-h-64 object-cover" />
                </div>
              )}

              {/* Location Tag */}
              {memory.place && (
                <div className="flex items-center gap-1.5 text-xs text-[#DE5239] font-semibold font-sans">
                  <MapPin size={14} /> {memory.place}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANALYZED / UNDERSTOOD */}
          {activeTab === "analyzed" && (
            <div className="space-y-6 pt-1">
              {/* Structured AI Dimensions Grid */}
              <div className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DE5239] font-sans block">
                  Extracted Dimensions &amp; Context
                </span>

                <div className="flex flex-wrap gap-2 text-xs font-sans">
                  {memory.people?.map((p, i) => (
                    <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-[#F5F1E8] border border-[#1C1917]/30 rounded-full font-medium text-[#1C1917]">
                      <UserRound size={12} className="text-[#DE5239]" /> {p}
                    </span>
                  ))}
                  {memory.place && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full font-semibold text-[#DE5239]">
                      <MapPin size={12} /> {memory.place}
                    </span>
                  )}
                  {memory.mood && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-[#F5F1E8] border border-[#1C1917]/30 rounded-full font-medium text-[#1C1917]">
                      <Heart size={12} className="text-[#DE5239]" /> {memory.mood}
                    </span>
                  )}
                  {memory.topic && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-[#F5F1E8] border border-[#1C1917]/30 rounded-full font-medium text-[#1C1917]">
                      <PenLine size={12} /> {memory.topic}
                    </span>
                  )}
                </div>
              </div>

              {/* Thought Evolution Timeline (Image 2 style) */}
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-wider font-sans font-bold text-[#665F56]">
                  Evolution Steps
                </p>

                <div className="space-y-4 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1C1917]/15">
                  {defaultEvolution.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative">
                      {/* Timeline Node Badge */}
                      <div className="w-10 h-10 rounded-full bg-[#F5F1E8] border-[1.5px] border-[#1C1917] flex items-center justify-center shrink-0 z-10 shadow-xs">
                        {getStageIcon(item.stage)}
                      </div>

                      {/* Content Card or Media Outcome */}
                      <div className="flex-1">
                        {item.stage === "OUTCOME" && item.imageUrl ? (
                          <div className="relative rounded-2xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] group">
                            <img src={item.imageUrl} alt={item.text} className="w-full h-52 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                              <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 font-sans">
                                {item.month}
                              </span>
                              <h4 className="font-serif text-2xl font-medium mt-0.5">
                                {item.text}
                              </h4>
                            </div>
                          </div>
                        ) : (
                          <div className={`p-4 rounded-2xl border-[1.5px] border-[#1C1917] ${
                            item.stage === "DECISION" ? "bg-[#F5E5DC] shadow-[2px_3px_0px_#1C1917]" : "bg-white shadow-[1px_2px_0px_#1C1917]"
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-[#665F56] font-sans tracking-wide">
                                {item.month} <span className="text-[#1C1917]/30">•</span> {item.stage}
                              </span>
                            </div>
                            <p className="font-serif text-base text-[#1C1917] leading-relaxed">
                              {item.text}
                            </p>

                            {/* Option tags if any */}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {item.tags.map((t, i) => (
                                  <span key={i} className="text-[10px] px-2.5 py-0.5 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full font-sans font-medium text-[#DE5239]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

