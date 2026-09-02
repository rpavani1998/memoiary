"use client";

import React, { useState } from "react";
import { HandDrawnIllustration } from "./HandDrawnIllustration";
import { ArrowLeft, Calendar } from "lucide-react";
import { MemoryDetailModal, MemoryDetailData } from "./MemoryDetailModal";

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
      <div className="max-w-2xl mx-auto space-y-6 pb-24">
        {/* Back button */}
        <button
          onClick={() => setSelectedPerson(null)}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-sans-clean font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to People
        </button>

        {/* Person Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
          {selectedPerson.photoUrl ? (
            <img
              src={selectedPerson.photoUrl}
              alt={selectedPerson.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#E8E2D9]"
            />
          ) : (
            <div className="p-3 bg-[#FDF6F0] rounded-full border border-[#E8E2D9]">
              <HandDrawnIllustration type="person_abstract" size={48} />
            </div>
          )}

          <div>
            <h2 className="font-serif-editorial text-2xl font-medium text-stone-900">
              {selectedPerson.name}
            </h2>
            {selectedPerson.roleOrCompany && (
              <p className="text-xs text-stone-500 font-sans-clean">
                {selectedPerson.roleOrCompany}
              </p>
            )}
          </div>

          <p className="text-sm font-serif-editorial italic text-stone-600">
            Your story with {selectedPerson.name}
          </p>
        </div>

        <hr className="border-[#E8E2D9]" />

        {/* Chronological Story Timeline */}
        <div className="space-y-4">
          {selectedPerson.memories.map((mem) => (
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

        <div className="text-center pt-4">
          <span className="px-4 py-1.5 bg-[#FAF7F2] border border-[#E8E2D9] rounded-full text-xs text-stone-500 font-medium">
            {selectedPerson.memoriesCount} memories
          </span>
        </div>

        <MemoryDetailModal memory={activeMemory} onClose={() => setActiveMemory(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div>
        <h2 className="font-serif-editorial text-2xl font-medium text-stone-900">
          People
        </h2>
        <p className="text-xs text-stone-500 font-sans-clean mt-1">
          The people remembered in your story.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {people.map((person) => (
          <div
            key={person.id}
            onClick={() => setSelectedPerson(person)}
            className="bg-white border border-[#E8E2D9] rounded-2xl p-5 flex items-center justify-between hover:border-[#C86D51]/60 transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              {person.photoUrl ? (
                <img
                  src={person.photoUrl}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#E8E2D9]"
                />
              ) : (
                <div className="p-2 bg-[#FDF6F0] rounded-full border border-[#E8E2D9]">
                  <HandDrawnIllustration type="person_abstract" size={28} />
                </div>
              )}

              <div>
                <h3 className="font-serif-editorial text-lg font-medium text-stone-900">
                  {person.name}
                </h3>
                {person.roleOrCompany && (
                  <p className="text-xs text-stone-500 font-sans-clean">
                    {person.roleOrCompany}
                  </p>
                )}
              </div>
            </div>

            <span className="text-xs text-stone-500 font-sans-clean font-medium">
              {person.memoriesCount} memories
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
