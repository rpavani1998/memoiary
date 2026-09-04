"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Compass,
  Search,
  BookOpen,
  MapPin,
  PenLine,
  Heart,
  Users,
  X,
  Layers,
  Share2,
  Calendar,
  Eye,
  Film
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";
import { ArtisticAvatar } from "./ArtisticAvatar";

interface UnifiedCollectionsGraphViewProps {
  captures: CaptureSession[];
  onSelectCapture?: (capture: CaptureSession) => void;
  onSelectPerson?: (personName: string) => void;
  onSearchQuery?: (query: string) => void;
}

export function UnifiedCollectionsGraphView({
  captures = [],
  onSelectCapture,
  onSelectPerson,
  onSearchQuery
}: UnifiedCollectionsGraphViewProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "topics">("graph");
  const [selectedBubble, setSelectedBubble] = useState<any>(null);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null);

  // 1. TOPICS & THEMES: Generated 100% dynamically from actual user entries
  const dynamicTopics = useMemo(() => {
    const map = new Map<string, { topic: string; count: number; sampleNote: string }>();
    captures.forEach((c) => {
      const topics = c.dimensions?.topics || [];
      const emotions = c.dimensions?.emotions?.map((e: any) => e.label) || [];
      const allTags = [...topics, ...emotions];

      allTags.forEach((tag) => {
        if (!tag || tag.length < 2) return;
        const normalized = tag.trim();
        const existing = map.get(normalized);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(normalized, {
            topic: normalized,
            count: 1,
            sampleNote: c.content?.substring(0, 60) || ""
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [captures]);

  // 2. FLOATING GRAPH NODES: Generated dynamically for interactive bubble plot graph
  const graphNodes = useMemo(() => {
    return captures.map((c, i) => {
      const angle = (i / Math.max(captures.length, 1)) * 2 * Math.PI;
      const radius = 120 + (i % 3) * 60;
      const x = 250 + Math.cos(angle) * radius;
      const y = 200 + Math.sin(angle) * (radius * 0.7);

      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      return {
        id: c.id || `node_${i}`,
        x,
        y,
        size: 55 + (c.content?.length > 100 ? 15 : 0),
        title: c.dimensions?.summary || c.content?.substring(0, 30) || "Memory Node",
        date: dateStr,
        source: c.source,
        mood: c.dimensions?.mood || "Reflective",
        people: c.dimensions?.people || [],
        places: c.dimensions?.places || [],
        rawCapture: c
      };
    });
  }, [captures]);

  // Filter captures by selected topic filter if active
  const filteredCaptures = useMemo(() => {
    if (!selectedTopicFilter) return captures;
    return captures.filter((c) => {
      const topics = c.dimensions?.topics || [];
      const emotions = c.dimensions?.emotions?.map((e: any) => e.label) || [];
      return [...topics, ...emotions].some((t) => t?.toLowerCase() === selectedTopicFilter.toLowerCase());
    });
  }, [captures, selectedTopicFilter]);

  return (
    <div className="w-full font-sans space-y-6 pb-32">
      {/* ── Sub Header Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1C1917]/15 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DE5239] flex items-center gap-1.5 font-sans">
            <Sparkles size={14} /> Visual Synthesis &amp; Constellations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] mt-0.5">Life Themes &amp; Mind Map</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F5F1E8] border border-[#1C1917]/20 p-1 rounded-2xl gap-1 text-xs font-sans font-bold">
          <button
            onClick={() => { setActiveTab("graph"); setSelectedTopicFilter(null); }}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "graph"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Share2 size={14} /> Mind Map Canvas
          </button>
          <button
            onClick={() => setActiveTab("topics")}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "topics"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Sparkles size={14} /> Life Themes ({dynamicTopics.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: INTERACTIVE FLOATING BUBBLE MEMORY GRAPH CANVAS ── */}
      {activeTab === "graph" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#665F56] font-sans">
              Interactive Memory Canvas · Click any node bubble to inspect memory details &amp; connections.
            </span>
            <span className="text-xs font-mono font-bold text-[#DE5239] bg-[#F5E5DC] px-2.5 py-0.5 rounded-full border border-[#DE5239]/20">
              {graphNodes.length} Floating Nodes
            </span>
          </div>

          {graphNodes.length === 0 ? (
            <div className="p-12 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-3 font-sans">
              <Share2 size={36} className="text-[#DE5239] mx-auto animate-pulse" />
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">Your Memory Canvas is Empty</h3>
              <p className="text-xs text-[#665F56] max-w-sm mx-auto">
                Log your first thought, photo, or voice note to watch your personal memory graph generate floating nodes!
              </p>
            </div>
          ) : (
            <div className="relative w-full h-[28rem] bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[4px_6px_0px_#1C1917]">
              {/* Canvas Background Grid Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#1C1917_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

              {/* Connector Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {graphNodes.map((node, i) => {
                  if (i === 0) return null;
                  const prev = graphNodes[i - 1];
                  return (
                    <line
                      key={i}
                      x1={prev.x}
                      y1={prev.y}
                      x2={node.x}
                      y2={node.y}
                      stroke="#DE5239"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.4"
                    />
                  );
                })}
              </svg>

              {/* Floating Node Bubbles */}
              {graphNodes.map((node) => {
                const isSelected = selectedBubble?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setSelectedBubble(node);
                      if (onSelectCapture) onSelectCapture(node.rawCapture);
                    }}
                    className={`absolute rounded-full border-[1.5px] border-[#1C1917] flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-[2px_3px_0px_#1C1917] ${
                      isSelected
                        ? "bg-[#DE5239] text-white z-20 scale-110 ring-4 ring-[#DE5239]/30"
                        : "bg-white text-[#1C1917] hover:bg-[#F5E5DC] z-10 animate-bounce duration-[4000ms]"
                    }`}
                    style={{
                      left: `${Math.max(20, Math.min(node.x, 420))}px`,
                      top: `${Math.max(20, Math.min(node.y, 340))}px`,
                      width: `${node.size}px`,
                      height: `${node.size}px`
                    }}
                  >
                    <span className="text-[9px] font-mono uppercase font-bold tracking-tight opacity-75">{node.date}</span>
                    <span className="font-serif text-[11px] font-semibold leading-tight line-clamp-1">{node.title}</span>
                    {node.people.length > 0 && (
                      <div className="flex -space-x-1 mt-0.5">
                        {node.people.slice(0, 2).map((p: string, idx: number) => (
                          <ArtisticAvatar key={idx} name={p} size="sm" className="w-4 h-4 rounded-full border border-white" />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: TOPICS & THEMES ── */}
      {activeTab === "topics" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#665F56] font-sans">
              Topics and themes extracted from your entries by AI.
            </p>
            {selectedTopicFilter && (
              <button
                onClick={() => setSelectedTopicFilter(null)}
                className="text-xs font-bold text-[#DE5239] hover:underline cursor-pointer flex items-center gap-1 font-sans"
              >
                Clear Filter: &ldquo;{selectedTopicFilter}&rdquo; <X size={12} />
              </button>
            )}
          </div>

          {dynamicTopics.length === 0 ? (
            <div className="p-10 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-3 font-sans">
              <Sparkles size={32} className="text-[#DE5239] mx-auto" />
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">No Topics Extracted Yet</h3>
              <p className="text-xs text-[#665F56] max-w-sm mx-auto">
                Log entries with rich thoughts or feelings, and Gemini AI will automatically extract topics here!
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {dynamicTopics.map((item, idx) => {
                const isActive = selectedTopicFilter === item.topic;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTopicFilter(isActive ? null : item.topic)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-[1.5px] border-[#1C1917] text-xs font-sans font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#DE5239] text-white shadow-[2px_3px_0px_#1C1917]"
                        : "bg-white text-[#1C1917] shadow-[1px_2px_0px_#1C1917] hover:bg-[#F5E5DC]"
                    }`}
                  >
                    <span>{item.topic}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white text-[#DE5239]" : "bg-[#F5E5DC] text-[#1C1917]"
                    }`}>
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Filtered Captures Display */}
          {selectedTopicFilter && (
            <div className="space-y-4 pt-4 border-t border-[#1C1917]/15">
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                Memories Tagged with &ldquo;{selectedTopicFilter}&rdquo; ({filteredCaptures.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCaptures.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectCapture?.(c)}
                    className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-2 cursor-pointer hover:-translate-y-0.5 transition-transform"
                  >
                    <span className="text-[10px] font-mono font-bold text-[#DE5239] uppercase block">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recent"}
                    </span>
                    <p className="font-serif text-sm text-[#1C1917] line-clamp-3 italic">
                      &ldquo;{c.content}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
