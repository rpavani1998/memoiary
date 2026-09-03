"use client";

import React, { useState } from "react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";
import { Search as SearchIcon, ArrowRight, Sparkles } from "lucide-react";
import { MemoryDetailModal, MemoryDetailData } from "./MemoryDetailModal";

interface Props {
  memories: MemoryDetailData[];
}

export function MemorySearch({ memories }: Props) {
  const [query, setQuery] = useState("");
  const [activeMemory, setActiveMemory] = useState<MemoryDetailData | null>(null);

  const exampleQuestions = [
    "When did I first meet CU?",
    "What did I learn from that project?",
    "What restaurants did I visit with Rahul?",
    "What was I working on last March?",
  ];

  // Filter memories matching query
  const filteredMemories = query.trim()
    ? memories.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.content.toLowerCase().includes(query.toLowerCase()) ||
          m.people?.some((p) => p.toLowerCase().includes(query.toLowerCase())) ||
          m.place?.toLowerCase().includes(query.toLowerCase()) ||
          m.topic?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
          Ask Your Memory
        </h2>
        <p className="text-xs text-[#665F56] font-sans">
          Search people, places, conversations, and moments in your story.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#DE5239]">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your memories..."
          className="w-full pl-12 pr-4 py-3.5 bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-2xl text-base text-[#1C1917] placeholder-[#665F56] outline-none focus:border-[#DE5239] transition-colors shadow-[2px_3px_0px_#1C1917] font-serif"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-4 flex items-center text-xs text-[#665F56] hover:text-[#1C1917] font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Example Prompt Chips */}
      {!query && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-serif italic text-[#665F56]">
            Or try asking:
          </p>
          <div className="flex flex-col gap-2.5">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(q)}
                className="text-left px-4 py-3.5 bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-2xl text-sm font-serif text-[#1C1917] hover:bg-[#F5E5DC] hover:text-[#DE5239] transition-all cursor-pointer flex items-center justify-between group shadow-[2px_3px_0px_#1C1917]"
              >
                <span>&ldquo;{q}&rdquo;</span>
                <ArrowRight className="w-4 h-4 text-[#DE5239] opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {query.trim() && (
        <div className="space-y-4 pt-2">
          {/* Conversational answer synthesis summary */}
          <div className="bg-[#F5E5DC] border-[1.5px] border-[#1C1917] rounded-2xl p-5 space-y-2 shadow-[2px_3px_0px_#1C1917]">
            <div className="flex items-center gap-2 text-[#DE5239] text-xs font-bold uppercase tracking-wider font-sans">
              <HandDrawnIllustration type="search" size={20} />
              <span className="flex items-center gap-1">
                <span className="node-dot" />
                Memory Recall
              </span>
            </div>
            <p className="font-serif text-base text-[#1C1917] leading-relaxed italic">
              {filteredMemories.length > 0
                ? `Found ${filteredMemories.length} relevant moment${
                    filteredMemories.length > 1 ? "s" : ""
                  } matching "${query}".`
                : `No specific memories found matching "${query}". Try searching by a person's name or place.`}
            </p>
          </div>

          {/* Results list */}
          <div className="space-y-3">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                onClick={() => setActiveMemory(mem)}
                className="bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-2xl p-5 hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer shadow-[2px_3px_0px_#1C1917] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#DE5239] font-sans font-bold flex items-center gap-1.5">
                    <span className="node-dot" />
                    {mem.date}
                  </span>
                  {mem.place && (
                    <span className="text-xs text-[#665F56] font-sans">
                      📍 {mem.place}
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-lg text-[#1C1917] font-medium">
                  {mem.title}
                </h4>
                <p className="text-sm text-[#665F56] line-clamp-2 font-serif">
                  {mem.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <MemoryDetailModal memory={activeMemory} onClose={() => setActiveMemory(null)} />
    </div>
  );
}
