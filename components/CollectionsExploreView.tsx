"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Compass,
  Search,
  BookOpen,
  Briefcase,
  User,
  MapPin,
  PenLine,
  Heart,
  Calendar,
  Layers,
  ChevronRight,
  Plus,
  X,
  Filter,
  Flame,
  ArrowUpRight
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";
import { ArtisticAvatar } from "./ArtisticAvatar";

interface CollectionsExploreViewProps {
  captures: CaptureSession[];
  onSelectCapture?: (capture: CaptureSession) => void;
  onSelectPerson?: (personName: string) => void;
  onSearchQuery?: (query: string) => void;
}

export function CollectionsExploreView({
  captures = [],
  onSelectCapture,
  onSelectPerson,
  onSearchQuery
}: CollectionsExploreViewProps) {
  const [timeHorizon, setTimeHorizon] = useState<"all" | "daily" | "weekly" | "monthly">("all");
  const [activeCategory, setActiveCategory] = useState<"all" | "life" | "career" | "thoughts" | "relationships" | "places">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Categorize captures dynamically based on topics/tags or AI dimensions
  const categorized = useMemo(() => {
    const life: CaptureSession[] = [];
    const career: CaptureSession[] = [];
    const thoughts: CaptureSession[] = [];
    const relationships: CaptureSession[] = [];
    const places: CaptureSession[] = [];

    captures.forEach((c) => {
      const text = `${c.content || ""} ${c.dimensions?.summary || ""} ${c.dimensions?.topics?.join(" ") || ""}`.toLowerCase();
      const people = c.dimensions?.people || [];
      const location = c.dimensions?.places || [];

      if (people.length > 0) relationships.push(c);
      if (location.length > 0) places.push(c);
      if (text.includes("work") || text.includes("code") || text.includes("project") || text.includes("launch") || text.includes("build") || text.includes("meeting") || text.includes("client")) {
        career.push(c);
      } else if (text.includes("thought") || text.includes("idea") || text.includes("realized") || text.includes("question") || text.includes("mind") || text.includes("reflect")) {
        thoughts.push(c);
      } else {
        life.push(c);
      }
    });

    return { life, career, thoughts, relationships, places };
  }, [captures]);

  // Extract unique people dynamically
  const uniquePeople = useMemo(() => {
    const map = new Map<string, number>();
    captures.forEach((c) => {
      c.dimensions?.people?.forEach((p) => map.set(p, (map.get(p) || 0) + 1));
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [captures]);

  // Extract unique places dynamically
  const uniquePlaces = useMemo(() => {
    const map = new Map<string, number>();
    captures.forEach((c) => {
      c.dimensions?.places?.forEach((p) => map.set(p, (map.get(p) || 0) + 1));
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [captures]);

  // Filtered captures based on current category tab
  const filteredCaptures = useMemo(() => {
    let list = captures;
    if (activeCategory === "life") list = categorized.life;
    else if (activeCategory === "career") list = categorized.career;
    else if (activeCategory === "thoughts") list = categorized.thoughts;
    else if (activeCategory === "relationships") list = categorized.relationships;
    else if (activeCategory === "places") list = categorized.places;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.content?.toLowerCase().includes(q) || c.dimensions?.summary?.toLowerCase().includes(q));
    }

    return list;
  }, [captures, activeCategory, categorized, searchQuery]);

  return (
    <div className="w-full font-sans space-y-8 pb-32">
      {/* ── Page Title & Search Bar ── */}
      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DE5239] flex items-center gap-1.5 font-sans">
            <Sparkles size={14} /> Memory Vault &amp; Collections
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917] mt-1">
            Explore Your Life
          </h1>
          <p className="text-sm text-[#665F56] font-sans mt-1 max-w-xl">
            Browse your memories grouped by life pillars, time horizons, people, and places.
          </p>
        </div>

        {/* Embedded Natural Language Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) onSearchQuery?.(searchQuery);
          }}
          className="flex items-center gap-2 p-2 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917]"
        >
          <Search size={18} className="text-[#665F56] ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search moments, thoughts, people, or places…"
            className="w-full bg-transparent text-sm font-serif text-[#1C1917] focus:outline-none placeholder-[#665F56]/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 rounded-full text-stone-400 hover:text-black cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      {/* ── Category Pillars (Apple Editorial Layout Inspiration) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-[#1C1917]">Life Pillars</h2>
          <span className="text-xs text-[#665F56] font-mono">{captures.length} Total Moments</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { id: "all", label: "All Moments", icon: <Compass size={18} />, count: captures.length },
            { id: "life", label: "Personal & Life", icon: <Heart size={18} />, count: categorized.life.length },
            { id: "career", label: "Career & Work", icon: <Briefcase size={18} />, count: categorized.career.length },
            { id: "thoughts", label: "Thoughts & Ideas", icon: <PenLine size={18} />, count: categorized.thoughts.length },
            { id: "relationships", label: "People", icon: <User size={18} />, count: categorized.relationships.length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`p-4 rounded-2xl border-[1.5px] border-[#1C1917] text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                activeCategory === cat.id
                  ? "bg-[#DE5239] text-white shadow-[3px_4px_0px_#1C1917] -translate-y-0.5"
                  : "bg-white text-[#1C1917] shadow-[2px_3px_0px_#1C1917] hover:bg-[#F5E5DC]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={activeCategory === cat.id ? "text-white" : "text-[#DE5239]"}>
                  {cat.icon}
                </span>
                <span className="font-mono text-xs font-bold opacity-80">{cat.count}</span>
              </div>
              <div>
                <span className="font-serif text-sm font-semibold block leading-tight">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Time Horizon Horizon Switcher (Day / Week / Month) ── */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1C1917]/15">
        <span className="text-xs font-bold uppercase tracking-wider text-[#665F56] font-sans flex items-center gap-1.5">
          <Calendar size={14} /> Time Horizon View
        </span>
        <div className="flex bg-[#F5F1E8] border border-[#1C1917]/20 p-1 rounded-xl gap-1 text-xs font-sans font-bold">
          {(["all", "daily", "weekly", "monthly"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTimeHorizon(mode)}
              className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                timeHorizon === mode
                  ? "bg-[#1C1917] text-white"
                  : "text-[#665F56] hover:text-[#1C1917]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ── DYNAMIC CONTENT GRID ── */}
      {filteredCaptures.length === 0 ? (
        <div className="p-12 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-3 font-sans">
          <Compass size={36} className="text-[#DE5239] mx-auto" />
          <h3 className="font-serif text-xl font-medium text-[#1C1917]">No Memories Found</h3>
          <p className="text-xs text-[#665F56] max-w-sm mx-auto">
            {searchQuery
              ? `No entries matched "${searchQuery}". Try a different keyword!`
              : "No moments logged in this category yet. Capture new thoughts or photos to see them populate here!"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Hero Highlight Card */}
          {filteredCaptures.length > 0 && (
            <div
              onClick={() => onSelectCapture?.(filteredCaptures[0])}
              className="relative rounded-3xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[4px_6px_0px_#1C1917] group min-h-[20rem] flex flex-col justify-end bg-stone-900 cursor-pointer"
            >
              <img
                src={filteredCaptures[0].mediaUrl || "/collages/daily_collage_sketch_sep2.jpg"}
                alt="Featured Memory"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/40 to-transparent" />

              <div className="relative z-10 p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#DE5239] text-white px-2.5 py-1 rounded-full border border-black/30 flex items-center gap-1">
                    <Sparkles size={12} /> Key Highlight
                  </span>
                  <span className="text-xs text-stone-300 font-sans">
                    {filteredCaptures[0].createdAt ? new Date(filteredCaptures[0].createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white leading-snug">
                  {filteredCaptures[0].dimensions?.summary || filteredCaptures[0].content?.substring(0, 60)}
                </h3>

                <p className="text-stone-300 text-sm font-sans max-w-lg line-clamp-2 italic">
                  &ldquo;{filteredCaptures[0].content}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Grid of Remaining Memories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCaptures.slice(1).map((capture) => {
              const date = capture.createdAt ? new Date(capture.createdAt) : new Date();
              const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              const dims = capture.dimensions;

              return (
                <div
                  key={capture.id}
                  onClick={() => onSelectCapture?.(capture)}
                  className="bg-white border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[2px_3px_0px_#1C1917] hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  {capture.mediaUrl ? (
                    <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                      <img
                        src={capture.mediaUrl}
                        alt="Memory image"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#1C1917]/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md font-mono uppercase">
                        {capture.source}
                      </span>
                    </div>
                  ) : null}

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#665F56] uppercase font-bold">{dateStr}</span>
                      {dims?.mood && (
                        <span className="text-[10px] font-sans font-bold text-[#DE5239] bg-[#F5E5DC] px-2 py-0.5 rounded-full border border-[#DE5239]/20">
                          {dims.mood}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-lg font-medium text-[#1C1917] leading-snug line-clamp-2">
                      {dims?.summary || capture.content?.substring(0, 50)}
                    </h4>

                    <p className="text-xs text-[#665F56] font-sans line-clamp-3">
                      {capture.content}
                    </p>

                    {dims?.people && dims.people.length > 0 && (
                      <div className="flex items-center gap-1 pt-2">
                        {dims.people.map((p, i) => (
                          <div key={i} className="flex items-center gap-1 bg-[#F5F1E8] border border-[#1C1917]/20 rounded-full px-2 py-0.5 text-[11px] text-[#1C1917] font-semibold">
                            <ArtisticAvatar name={p} size="sm" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PEOPLE & PLACES HIGHLIGHT SECTION ── */}
      {(uniquePeople.length > 0 || uniquePlaces.length > 0) && (
        <div className="pt-6 border-t border-[#1C1917]/15 space-y-6">
          {uniquePeople.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">People in Your Story</h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {uniquePeople.map((person) => (
                  <button
                    key={person.name}
                    onClick={() => onSelectPerson?.(person.name)}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] hover:bg-[#F5E5DC] transition-all shrink-0 cursor-pointer"
                  >
                    <ArtisticAvatar name={person.name} size="sm" />
                    <span className="font-serif font-medium text-sm text-[#1C1917]">{person.name}</span>
                    <span className="text-[10px] font-mono font-bold bg-[#DE5239] text-white px-2 py-0.5 rounded-full">
                      {person.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {uniquePlaces.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">Places Logged</h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {uniquePlaces.map((place) => (
                  <div
                    key={place.name}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] shrink-0 text-xs font-sans font-medium text-[#1C1917]"
                  >
                    <MapPin size={14} className="text-[#DE5239]" />
                    <span>{place.name}</span>
                    <span className="font-mono text-[10px] font-bold bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                      {place.count}
                    </span>
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
