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
      <div className="max-w-2xl mx-auto space-y-6 pb-24">
        <button
          onClick={() => setSelectedPlace(null)}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-sans-clean font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Places
        </button>

        {/* Place Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
          <div className="p-3 bg-[#FDF6F0] rounded-full border border-[#E8E2D9]">
            <HandDrawnIllustration type="place" size={54} />
          </div>

          <div>
            <h2 className="font-serif-editorial text-2xl font-medium text-stone-900">
              {selectedPlace.name}
            </h2>
            {selectedPlace.locationDetails && (
              <p className="text-xs text-stone-500 font-sans-clean">
                {selectedPlace.locationDetails}
              </p>
            )}
          </div>

          <span className="px-3.5 py-1 bg-white border border-[#E8E2D9] rounded-full text-xs text-[#C86D51] font-medium">
            {selectedPlace.memoriesCount} memories
          </span>
        </div>

        <hr className="border-[#E8E2D9]" />

        {/* Chronological Place Memories */}
        <div className="space-y-4">
          {selectedPlace.memories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setActiveMemory(mem)}
              className="bg-white border border-[#E8E2D9] rounded-2xl p-5 hover:border-[#C86D51]/50 transition-all cursor-pointer shadow-2xs space-y-2"
            >
              <span className="text-xs uppercase tracking-widest text-[#C86D51] font-semibold">
                {mem.date}
              </span>
              <h4 className="font-serif-editorial text-lg text-stone-900 font-medium">
                {mem.title}
              </h4>
              <p className="text-sm text-stone-600 line-clamp-2 font-serif-editorial">
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
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div>
        <h2 className="font-serif-editorial text-2xl font-medium text-stone-900">
          Places
        </h2>
        <p className="text-xs text-stone-500 font-sans-clean mt-1">
          Places where your life was lived.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {places.map((place) => (
          <div
            key={place.id}
            onClick={() => setSelectedPlace(place)}
            className="bg-white border border-[#E8E2D9] rounded-2xl p-5 flex items-center justify-between hover:border-[#C86D51]/60 transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-[#FDF6F0] rounded-2xl border border-[#E8E2D9]">
                <HandDrawnIllustration type="place" size={32} />
              </div>

              <div>
                <h3 className="font-serif-editorial text-lg font-medium text-stone-900">
                  {place.name}
                </h3>
                {place.locationDetails && (
                  <p className="text-xs text-stone-500 font-sans-clean">
                    {place.locationDetails}
                  </p>
                )}
              </div>
            </div>

            <span className="text-xs text-stone-500 font-sans-clean font-medium">
              {place.memoriesCount} memories
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
