"use client";

import React, { useState } from "react";
import { HandDrawnIllustration, IllustrationType } from "./HandDrawnIllustration";
import { MemoryDetailModal, MemoryDetailData } from "./MemoryDetailModal";

export interface TimelineEntryItem {
  id: string;
  time: string;
  dateGroup: string; // e.g. "SEPTEMBER 1"
  title: string;
  content: string;
  illustration?: IllustrationType;
  people?: string[];
  place?: string;
  topic?: string;
  photoUrl?: string;
  hasAudio?: boolean;
}

interface Props {
  entries: TimelineEntryItem[];
}

export function TimelineView({ entries }: Props) {
  const [activeMemory, setActiveMemory] = useState<MemoryDetailData | null>(null);

  // Group entries by dateGroup
  const grouped = entries.reduce((acc, item) => {
    if (!acc[item.dateGroup]) acc[item.dateGroup] = [];
    acc[item.dateGroup].push(item);
    return acc;
  }, {} as Record<string, TimelineEntryItem[]>);

  return (
    <div className="max-w-xl mx-auto space-y-10 pb-28">
      <div className="text-center space-y-1">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
          Timeline
        </h2>
        <p className="text-xs text-[#665F56] font-sans">
          A quiet stream of your lived experiences.
        </p>
      </div>

      {Object.entries(grouped).map(([dateGroup, groupEntries]) => (
        <div key={dateGroup} className="space-y-6">
          {/* Date header */}
          <div className="text-center py-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full text-[11px] uppercase tracking-widest text-[#DE5239] font-sans font-bold">
              <span className="node-dot" />
              {dateGroup}
            </span>
          </div>

          {/* Grouped items */}
          <div className="space-y-6">
            {groupEntries.map((item, idx) => (
              <div key={item.id} className="space-y-4">
                <div
                  onClick={() =>
                    setActiveMemory({
                      id: item.id,
                      date: `${item.dateGroup}, ${item.time}`,
                      title: item.title,
                      content: item.content,
                      people: item.people,
                      place: item.place,
                      topic: item.topic,
                      photoUrl: item.photoUrl,
                      hasAudio: item.hasAudio,
                    })
                  }
                  className="bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-2xl p-5 hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer shadow-[2px_3px_0px_#1C1917] space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-[#665F56] font-medium">
                      {item.time}
                    </span>
                    {item.place && (
                      <span className="text-xs text-[#DE5239] font-sans font-semibold">
                        {item.place}
                      </span>
                    )}
                  </div>

                  {item.title && (
                    <h3 className="font-serif text-lg font-medium text-[#1C1917]">
                      {item.title}
                    </h3>
                  )}

                  <p className="font-serif text-[#1C1917] text-sm leading-relaxed">
                    {item.content}
                  </p>

                  {/* Selective Hand-drawn illustration for place/milestone */}
                  {item.illustration && (
                    <div className="pt-3 flex justify-center">
                      <HandDrawnIllustration type={item.illustration} size={36} />
                    </div>
                  )}
                </div>

                {/* Bullet dot separator between entries */}
                {idx < groupEntries.length - 1 && (
                  <div className="flex justify-center py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DE5239]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <MemoryDetailModal memory={activeMemory} onClose={() => setActiveMemory(null)} />
    </div>
  );
}
