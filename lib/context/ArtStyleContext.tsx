"use client";

import React, { createContext, useContext, useState } from "react";

export type ArtStyle = "sketch";

export interface ArtStyleOption {
  id: ArtStyle;
  name: string;
  description: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  collageUrl: string;
}

export const ART_STYLES: Record<ArtStyle, ArtStyleOption> = {
  sketch: {
    id: "sketch",
    name: "Pencil & Graphite Sketch",
    description: "Hand-drawn journal sketches with expressive graphite shading on parchment paper",
    badgeBg: "#FDF2D0",
    badgeBorder: "#D97706",
    badgeText: "#D97706",
    collageUrl: "/collages/daily_collage_sketch.jpg"
  }
};

interface ArtStyleContextType {
  artStyle: ArtStyle;
  currentStyle: ArtStyleOption;
}

const ArtStyleContext = createContext<ArtStyleContextType | undefined>(undefined);

export function ArtStyleProvider({ children }: { children: React.ReactNode }) {
  const [artStyle] = useState<ArtStyle>("sketch");

  return (
    <ArtStyleContext.Provider
      value={{
        artStyle,
        currentStyle: ART_STYLES.sketch
      }}
    >
      {children}
    </ArtStyleContext.Provider>
  );
}

export function useArtStyle() {
  const context = useContext(ArtStyleContext);
  if (!context) {
    throw new Error("useArtStyle must be used within an ArtStyleProvider");
  }
  return context;
}
