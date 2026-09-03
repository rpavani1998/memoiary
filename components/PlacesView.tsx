"use client";

import React, { useState } from "react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";
import { ArrowLeft } from "lucide-react";
import { MemoryDetailModal, MemoryDetailData } from "./MemoryDetailModal";

export interface PlaceItem {
  id: string;
  name: string;
  locationDetails?: string;
  memoriesCount: number;
  memories: MemoryDetailData[];
}

interface Props {
  places: PlaceItem[];
}

export function PlacesView({ places }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [activeMemory, setActiveMemory] = useState<MemoryDetailData | null>(null);

  if (selectedPlace) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-24 font-sans">
        <button
          onClick={() => setSelectedPlace(null)}
          className="flex items-center gap-1.5 text-xs text-[#665F56] hover:text-[#1C1917] font-sans font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#DE5239]" /> Back to Places
        </button>

        {/* Place Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-4 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-3xl p-6 shadow-[3px_4px_0px_#1C1917]">
          <div className="p-3 bg-[#F5E5DC] rounded-full border-[1.5px] border-[#1C1917]">
            <HandDrawnIllustration type="place" size={54} />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
              {selectedPlace.name}
            </h2>
            {selectedPlace.locationDetails && (
              <p className="text-xs text-[#665F56] font-sans mt-0.5">
                {selectedPlace.locationDetails}
              </p>
            )}
          </div>

          <span className="px-3.5 py-1 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full text-xs text-[#DE5239] font-sans font-semibold">
            {selectedPlace.memoriesCount} memories
          </span>
        </div>

        {/* Chronological Place Memories */}
        <div className="space-y-4">
          {selectedPlace.memories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setActiveMemory(mem)}
              className="bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-2xl p-5 hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer shadow-[2px_3px_0px_#1C1917] space-y-2"
            >
              <span className="text-xs uppercase tracking-widest text-[#DE5239] font-sans font-bold flex items-center gap-1.5">
                <span className="node-dot" />
                {mem.date}
              </span>
              <h4 className="font-serif text-lg text-[#1C1917] font-medium">
                {mem.title}
              </h4>
              <p className="text-sm text-[#665F56] line-clamp-2 font-serif">
                {mem.content}
              </p>
            </div>
          ))}
        </div>

        <MemoryDetailModal memory={activeMemory} onClose={() => setActiveMemory(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 font-sans">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
          Places
        </h2>
        <p className="text-xs text-[#665F56] font-sans mt-1">
          Places where your life was lived.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {places.map((place) => (
          <div
            key={place.id}
            onClick={() => setSelectedPlace(place)}
            className="bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-2xl p-5 flex items-center justify-between hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer shadow-[2px_3px_0px_#1C1917]"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#F5E5DC] rounded-2xl border-[1.5px] border-[#1C1917]">
                <HandDrawnIllustration type="place" size={32} />
              </div>

              <div>
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">
                  {place.name}
                </h3>
                {place.locationDetails && (
                  <p className="text-xs text-[#665F56] font-sans">
                    {place.locationDetails}
                  </p>
                )}
              </div>
            </div>

            <span className="text-xs text-[#DE5239] font-sans font-semibold px-2.5 py-1 bg-[#F5E5DC] rounded-full border border-[#DE5239]/30">
              {place.memoriesCount} memories
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
