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
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-serif-editorial text-2xl font-medium text-stone-900">
          Ask Your Memory
        </h2>
        <p className="text-xs text-stone-500 font-sans-clean">
          Search people, places, conversations, and moments in your story.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your memories..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E8E2D9] rounded-2xl text-base text-stone-800 placeholder-stone-400 outline-none focus:border-[#C86D51] transition-colors shadow-2xs font-serif-editorial"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-4 flex items-center text-xs text-stone-400 hover:text-stone-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Example Prompt Chips */}
      {!query && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-serif-editorial italic text-stone-500">
            Or try asking:
          </p>
          <div className="flex flex-col gap-2">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(q)}
                className="text-left px-4 py-3 bg-white border border-[#E8E2D9] rounded-2xl text-sm font-serif-editorial text-stone-700 hover:border-[#C86D51] hover:text-[#C86D51] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <span>&ldquo;{q}&rdquo;</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#C86D51]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {query.trim() && (
        <div className="space-y-4 pt-2">
          {/* Conversational answer synthesis summary */}
          <div className="bg-[#FAF7F2] border border-[#E8E2D9] rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-[#C86D51] text-xs font-semibold uppercase tracking-wider">
              <HandDrawnIllustration type="search" size={20} />
              <span>Memory Recall</span>
            </div>
            <p className="font-serif-editorial text-base text-stone-800 leading-relaxed italic">
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
                className="bg-white border border-[#E8E2D9] rounded-2xl p-5 hover:border-[#C86D51]/60 transition-all cursor-pointer shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#C86D51] font-semibold">
                    {mem.date}
                  </span>
                  {mem.place && (
                    <span className="text-xs text-stone-500 font-sans-clean">
                      📍 {mem.place}
                    </span>
                  )}
                </div>
                <h4 className="font-serif-editorial text-lg text-stone-900 font-medium">
                  {mem.title}
                </h4>
                <p className="text-sm text-stone-600 line-clamp-2 font-serif-editorial">
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
