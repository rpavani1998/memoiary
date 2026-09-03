"use client";

import React from "react";
import { getPersonVisualIdentity } from "@/lib/memory-engine/person-graph";

interface Props {
  name: string;
  photoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ArtisticAvatar({ name, photoUrl, size = "md", className = "" }: Props) {
  const identity = getPersonVisualIdentity(name);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-11 h-11 text-sm font-bold",
    xl: "w-16 h-16 text-lg font-bold",
  };

  const ringSizes = {
    sm: "border-[1.5px]",
    md: "border-[1.5px]",
    lg: "border-2",
    xl: "border-[2.5px]",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${sizeClasses[size]} ${ringSizes[size]} border-[#1C1917] shadow-[1px_2px_0px_#1C1917] transition-transform hover:scale-105 select-none ${className}`}
      style={{ backgroundColor: identity.avatarBg }}
      title={`${name} · ${identity.baseDescriptor}`}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="font-serif font-bold text-[#1C1917] tracking-tighter">
          {initials}
        </span>
      )}

      {/* Graphite Pencil Sparkle Badge Accent */}
      <span className="absolute -top-0.5 -right-0.5 text-[9px] leading-none pointer-events-none">
        ✏️
      </span>
    </div>
  );
}
