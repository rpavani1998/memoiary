"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  MapPin,
  Briefcase,
  Sparkles,
  Search,
  Tag,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";
import { ArtisticAvatar } from "./ArtisticAvatar";

interface EntitiesViewSectionProps {
  captures: CaptureSession[];
  onSelectPerson?: (personName: string) => void;
  onSelectCapture?: (capture: CaptureSession) => void;
}

export function EntitiesViewSection({
  captures = [],
  onSelectPerson,
  onSelectCapture
}: EntitiesViewSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "people" | "places" | "projects">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. DYNAMIC PEOPLE
  const peopleList = useMemo(() => {
    const map = new Map<string, { name: string; count: number; lastDate: string; sampleNote: string }>();
    captures.forEach((c) => {
      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      c.dimensions?.people?.forEach((p) => {
        const existing = map.get(p);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(p, {
            name: p,
            count: 1,
            lastDate: dateStr,
            sampleNote: c.content?.substring(0, 50) || ""
          });
        }
      });
    });
    return Array.from(map.values());
  }, [captures]);

  // 2. DYNAMIC PLACES
  const placesList = useMemo(() => {
    const map = new Map<string, { place: string; count: number; sampleNote: string }>();
    captures.forEach((c) => {
      c.dimensions?.places?.forEach((pl) => {
        const existing = map.get(pl);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(pl, {
            place: pl,
            count: 1,
            sampleNote: c.content?.substring(0, 50) || ""
          });
        }
      });
    });
    return Array.from(map.values());
  }, [captures]);

  // 3. DYNAMIC PROJECTS & TOPICS
  const projectsList = useMemo(() => {
    const map = new Map<string, { topic: string; count: number }>();
    captures.forEach((c) => {
      const topics = c.dimensions?.topics || [];
      topics.forEach((t) => {
        if (!t) return;
        const existing = map.get(t);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(t, { topic: t, count: 1 });
        }
      });
    });
    return Array.from(map.values());
  }, [captures]);

  return (
    <div className="w-full font-sans space-y-6 pb-32">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1C1917]/15 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DE5239] flex items-center gap-1.5 font-sans">
            <Sparkles size={14} /> Knowledge &amp; Entity Network
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] mt-0.5">Entities Hub</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F5F1E8] border border-[#1C1917]/20 p-1 rounded-2xl gap-1 text-xs font-sans font-bold flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            All Entities
          </button>
          <button
            onClick={() => setActiveTab("people")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "people"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Users size={14} /> People ({peopleList.length})
          </button>
          <button
            onClick={() => setActiveTab("places")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "places"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <MapPin size={14} /> Places ({placesList.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Briefcase size={14} /> Topics ({projectsList.length})
          </button>
        </div>
      </div>

      {/* ── SECTION 1: MY PEOPLE ── */}
      {(activeTab === "all" || activeTab === "people") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-[#1C1917] flex items-center gap-2">
              <Users size={18} className="text-[#DE5239]" /> People in Your Life ({peopleList.length})
            </h3>
          </div>

          {peopleList.length === 0 ? (
            <div className="p-8 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-2 font-sans">
              <p className="text-xs text-[#665F56]">No people tagged yet. Mention companions in your entries to populate your network!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {peopleList.map((person, i) => (
                <div
                  key={i}
                  onClick={() => onSelectPerson?.(person.name)}
                  className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[2px_3px_0px_#1C1917] flex items-center justify-between cursor-pointer hover:-translate-y-0.5 transition-transform group"
                >
                  <div className="flex items-center gap-3">
                    <ArtisticAvatar name={person.name} size="lg" />
                    <div>
                      <h4 className="font-serif text-lg font-medium text-[#1C1917]">{person.name}</h4>
                      <span className="text-[11px] font-mono text-[#DE5239] font-bold">
                        {person.count} moment{person.count === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#DE5239] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 2: MY PLACES ── */}
      {(activeTab === "all" || activeTab === "places") && (
        <div className="space-y-4 pt-4 border-t border-[#1C1917]/15">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-[#1C1917] flex items-center gap-2">
              <MapPin size={18} className="text-[#DE5239]" /> Places Logged ({placesList.length})
            </h3>
          </div>

          {placesList.length === 0 ? (
            <div className="p-8 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-2 font-sans">
              <p className="text-xs text-[#665F56]">No places logged yet. Mention cafes, cities, or locations in your entries!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {placesList.map((pl, i) => (
                <div
                  key={i}
                  className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[2px_3px_0px_#1C1917] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-semibold text-[#1C1917] flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#DE5239]" /> {pl.place}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#F5E5DC] text-[#1C1917] px-2 py-0.5 rounded-full border border-[#DE5239]/20">
                      {pl.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 3: TOPICS & PROJECTS ── */}
      {(activeTab === "all" || activeTab === "projects") && (
        <div className="space-y-4 pt-4 border-t border-[#1C1917]/15">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-[#1C1917] flex items-center gap-2">
              <Briefcase size={18} className="text-[#DE5239]" /> Dynamic Topics &amp; Themes ({projectsList.length})
            </h3>
          </div>

          {projectsList.length === 0 ? (
            <div className="p-8 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-2 font-sans">
              <p className="text-xs text-[#665F56]">No topics extracted yet. Journal entries will automatically extract topics!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {projectsList.map((pj, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[1px_2px_0px_#1C1917] text-xs font-sans font-semibold text-[#1C1917]"
                >
                  <Tag size={12} className="text-[#DE5239]" />
                  <span>{pj.topic}</span>
                  <span className="text-[10px] font-mono font-bold bg-[#F5E5DC] px-1.5 py-0.5 rounded-full">
                    {pj.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
