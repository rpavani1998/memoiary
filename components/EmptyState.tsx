"use client";

import React from "react";
import { HandDrawnIllustration, IllustrationType } from "./HandDrawnIllustration";

interface Props {
  illustration?: IllustrationType;
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function EmptyState({
  illustration = "empty",
  title = "Your canvas is quiet.",
  subtitle = "Start expressing your thoughts. Memoiary will weave them into connected meaning over time.",
  actionButton,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center max-w-sm mx-auto space-y-4 my-8">
      <div className="p-4 bg-[#FAF0EB] rounded-full border border-[#F2D5CB]">
        <HandDrawnIllustration type={illustration} size={52} />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif-editorial text-xl font-medium text-[#1A1D20]">
          {title}
        </h3>
        <p className="text-sm text-[#656C75] leading-relaxed font-sans-clean">
          {subtitle}
        </p>
      </div>

      {actionButton && <div className="pt-2">{actionButton}</div>}
    </div>
  );
}
