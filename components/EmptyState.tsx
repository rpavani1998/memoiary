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
  title = "Nothing here yet.",
  subtitle = "Start talking. Your memories will grow with you.",
  actionButton,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center max-w-sm mx-auto space-y-4 my-8">
      <div className="p-4 bg-[#FDF6F0] rounded-full border border-[#E8E2D9]">
        <HandDrawnIllustration type={illustration} size={52} />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif-editorial text-xl font-medium text-stone-800">
          {title}
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed font-sans-clean">
          {subtitle}
        </p>
      </div>

      {actionButton && <div className="pt-2">{actionButton}</div>}
    </div>
  );
}
