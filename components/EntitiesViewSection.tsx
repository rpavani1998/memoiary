"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  MapPin,
  Sparkles,
  ChevronRight,
  Globe,
  Layers,
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";
import { ArtisticAvatar } from "./ArtisticAvatar";
import { WishlistIntentionsBoard } from "./WishlistIntentionsBoard";

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
  // Exactly 2 tabs requested by user:
  // "intentions": Wishlist & Action Intentions
  // "people_places": People & Places
  const [internalTab, setInternalTab] = useState<"people_places" | "intentions">("people_places");

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

  return (
    <div className="w-full font-sans space-y-6 pb-32">
      {/* Elements Hub Header with 2 Internal Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1C1917]/15 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DE5239] flex items-center gap-1.5 font-sans">
            <Layers size={14} /> Components of your Memory Engine
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] mt-0.5">
            Elements
          </h1>
        </div>

        {/* 2 Internal Sub-Tabs Switcher */}
        <div className="flex bg-[#F5F1E8] border border-[#1C1917]/20 p-1 rounded-2xl gap-1 text-xs font-sans font-bold shadow-2xs">
          <button
            onClick={() => setInternalTab("people_places")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              internalTab === "people_places"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Users size={15} />
            <span>People &amp; Places</span>
          </button>

          <button
            onClick={() => setInternalTab("intentions")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              internalTab === "intentions"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Sparkles size={15} />
            <span>Wishlist &amp; Intentions</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: WISHLIST & ACTION INTENTIONS ── */}
      {internalTab === "intentions" && (
        <WishlistIntentionsBoard captures={captures} />
      )}

      {/* ── TAB 2: PEOPLE & PLACES (COMBINED TOGETHER) ── */}
      {internalTab === "people_places" && (
        <div className="space-y-8">
          {/* Section A: People in Your Life */}
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

          {/* Section B: Places Logged */}
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
        </div>
      )}
    </div>
  );
}
