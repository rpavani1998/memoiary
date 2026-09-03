"use client";

import React, { useState } from "react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";
import { ArrowLeft, Calendar } from "lucide-react";
import { MemoryDetailModal, MemoryDetailData } from "./MemoryDetailModal";
import { ArtisticAvatar } from "./ArtisticAvatar";

export interface PersonItem {
  id: string;
  name: string;
  roleOrCompany?: string;
  memoriesCount: number;
  photoUrl?: string;
  memories: MemoryDetailData[];
}

interface Props {
  people: PersonItem[];
}

export function PeopleView({ people }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<PersonItem | null>(null);
  const [activeMemory, setActiveMemory] = useState<MemoryDetailData | null>(null);

  if (selectedPerson) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-24 font-sans">
        {/* Back button */}
        <button
          onClick={() => setSelectedPerson(null)}
          className="flex items-center gap-1.5 text-xs text-[#665F56] hover:text-[#1C1917] font-sans font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#DE5239]" /> Back to People
        </button>

        {/* Person Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-4 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-3xl p-6 shadow-[3px_4px_0px_#1C1917]">
          <ArtisticAvatar name={selectedPerson.name} photoUrl={selectedPerson.photoUrl} size="xl" />

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
              {selectedPerson.name}
            </h2>
            {selectedPerson.roleOrCompany && (
              <p className="text-xs text-[#665F56] font-sans mt-0.5">
                {selectedPerson.roleOrCompany}
              </p>
            )}
          </div>

          <p className="text-sm font-serif italic text-[#665F56]">
            Your story with {selectedPerson.name}
          </p>

          <span className="px-3.5 py-1 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full text-xs text-[#DE5239] font-sans font-semibold">
            {selectedPerson.memoriesCount} memories
          </span>
        </div>

        {/* Chronological Story Timeline */}
        <div className="space-y-4">
          {selectedPerson.memories.map((mem) => (
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
          People
        </h2>
        <p className="text-xs text-[#665F56] font-sans mt-1">
          The people remembered in your story.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {people.map((person) => (
          <div
            key={person.id}
            onClick={() => setSelectedPerson(person)}
            className="bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-2xl p-5 flex items-center justify-between hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer shadow-[2px_3px_0px_#1C1917]"
          >
            <div className="flex items-center gap-3.5">
              <ArtisticAvatar name={person.name} photoUrl={person.photoUrl} size="lg" />

              <div>
                <h3 className="font-serif text-lg font-medium text-[#1C1917]">
                  {person.name}
                </h3>
                {person.roleOrCompany && (
                  <p className="text-xs text-[#665F56] font-sans">
                    {person.roleOrCompany}
                  </p>
                )}
              </div>
            </div>

            <span className="text-xs text-[#DE5239] font-sans font-semibold px-2.5 py-1 bg-[#F5E5DC] rounded-full border border-[#DE5239]/30">
              {person.memoriesCount} memories
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
