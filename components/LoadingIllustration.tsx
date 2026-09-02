"use client";

import React from "react";
import { HandDrawnIllustration, IllustrationType } from "./HandDrawnIllustration";
import { motion } from "motion/react";

interface Props {
  operation?: "processing" | "searching" | "voice" | "saving" | "thinking";
  label?: string;
}

export function LoadingIllustration({ operation = "processing", label }: Props) {
  let illustrationType: IllustrationType = "notebook";
  let defaultLabel = "Remembering...";

  switch (operation) {
    case "searching":
      illustrationType = "search";
      defaultLabel = "Searching your memory...";
      break;
    case "voice":
      illustrationType = "microphone";
      defaultLabel = "Listening...";
      break;
    case "saving":
      illustrationType = "envelope";
      defaultLabel = "Saving memory...";
      break;
    case "thinking":
      illustrationType = "thinking";
      defaultLabel = "Reflecting...";
      break;
    case "processing":
    default:
      illustrationType = "notebook";
      defaultLabel = "Remembering...";
      break;
  }

  const displayText = label || defaultLabel;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <motion.div
        animate={{
          scale: [0.96, 1.04, 0.96],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <HandDrawnIllustration type={illustrationType} size={56} />
      </motion.div>

      <p className="font-serif-editorial italic text-stone-700 text-lg tracking-wide">
        {displayText}
      </p>
    </div>
  );
}
