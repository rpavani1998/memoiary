"use client";

import React from "react";
import { Clock, MapPin, Film, Sparkles, PenTool, Users } from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";
import { getPersonVisualIdentity } from "@/lib/memory-engine/person-graph";

export interface StoryboardScene {
  id: string;
  panelNumber: number;
  time: string;
  title: string;
  summary: string;
  location?: string;
  people?: string[];
  imageUrl?: string;
}

interface Props {
  dateStr: string;
  scenes: StoryboardScene[];
}

export function DailyStoryboard({ dateStr, scenes }: Props) {
  if (!scenes || scenes.length === 0) return null;

  // Collect all unique people in today's scenes
  const todayPeople = Array.from(
    new Set(scenes.flatMap((s) => s.people || []))
  );

  return (
    <section className="my-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1C1917] relative overflow-hidden font-sans">
      {/* Soft warm parchment glow in background */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#D97706]/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#1C1917]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF2D0] border border-[#D97706]/30 rounded-full text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
            <PenTool size={13} /> Pencil & Graphite Journal Sketch
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
            The Story of Your Day · {dateStr}
          </h3>
        </div>
        <span className="text-xs font-semibold text-[#665F56] font-sans bg-white border border-[#1C1917]/20 px-3.5 py-1.5 rounded-full w-fit shadow-xs">
          Synthesized from {scenes.length} Daily Moments
        </span>
      </div>

      {/* People in Today's Story Bar */}
      {todayPeople.length > 0 && (
        <div className="mb-5 p-3.5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#D97706]" />
            <span className="text-xs font-bold text-[#1C1917] font-serif uppercase tracking-wider">
              People Tagged in Today's Story:
            </span>
          </div>
          <div className="flex items-center gap-3">
            {todayPeople.map((personName) => {
              const identity = getPersonVisualIdentity(personName);
              return (
                <div key={personName} className="flex items-center gap-1.5 bg-[#FAF7F0] border border-[#1C1917]/20 px-2.5 py-1 rounded-full text-xs">
                  <ArtisticAvatar name={personName} size="sm" />
                  <span className="font-serif font-bold text-[#1C1917]">{personName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI GENERATED DATE-MATCHED PENCIL & GRAPHITE SKETCH COLLAGE POSTER */}
      <div className="mb-6 border-[1.5px] border-[#1C1917] bg-[#262320] rounded-2xl overflow-hidden shadow-[3px_4px_0px_#1C1917] group relative">
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src="/collages/daily_collage_sketch_sep2.jpg"
            alt={`Pencil and graphite journal sketch daily story collage for ${dateStr}`}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-[#D97706] px-2.5 py-0.5 rounded-md font-bold border border-white/20">
                DATE-MATCHED AI HAND-DRAWN COLLAGE
              </span>
              <p className="font-serif text-lg sm:text-xl font-medium mt-1 text-stone-100">
                {dateStr}: 11:00 AM Team Launch, 1:30 PM Rooftop Lunch & 7:30 PM Sunset Walk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Panel Scene Cards Breakdown with Avatars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className="border-[1.5px] border-[#1C1917] bg-white rounded-2xl p-4 shadow-[2px_3px_0px_#1C1917] flex flex-col justify-between hover:-translate-y-0.5 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-[#1C1917] text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-md">
                  Panel 0{scene.panelNumber}
                </span>
                <span className="text-[11px] font-sans font-bold text-[#D97706] flex items-center gap-1">
                  <Clock size={11} /> {scene.time}
                </span>
              </div>

              <h4 className="font-serif text-base font-medium text-[#1C1917] leading-tight">
                {scene.title}
              </h4>
              <p className="font-serif text-xs text-[#665F56] leading-relaxed">
                {scene.summary}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-[#1C1917]/10 flex items-center justify-between gap-2">
              {scene.location && (
                <span className="text-[10px] font-semibold text-[#D97706] flex items-center gap-1 font-sans truncate">
                  <MapPin size={11} /> {scene.location}
                </span>
              )}

              {scene.people && scene.people.length > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  {scene.people.map((p, idx) => (
                    <ArtisticAvatar key={idx} name={p} size="sm" />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
