"use client";

import React from "react";

export type IllustrationType =
  | "notebook"
  | "microphone"
  | "search"
  | "place"
  | "cafe"
  | "camera"
  | "memory"
  | "book"
  | "person_abstract"
  | "envelope"
  | "thinking"
  | "empty"
  | "question"
  | "celebration"
  | "video"
  | "attach"
  | "location";

interface Props {
  type: IllustrationType;
  className?: string;
  size?: number;
}

export function HandDrawnIllustration({ type, className = "", size = 48 }: Props) {
  // Common organic SVG stroke style attributes
  const strokeProps = {
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "notebook":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Notebook cover fill */}
          <path
            d="M16 12C16 10.8954 16.8954 10 18 10H46C47.1046 10 48 10.8954 48 12V52C48 53.1046 47.1046 54 46 54H18C16.8954 54 16 53.1046 16 52V12Z"
            fill="#F3EFEA"
            stroke="#C86D51"
            {...strokeProps}
          />
          {/* Bookmark ribbon */}
          <path
            d="M36 10V28L40 25L44 28V10"
            fill="#C86D51"
            stroke="#B85C42"
            {...strokeProps}
          />
          {/* Spine rings / hand-drawn spiral binding */}
          <path d="M12 16H18" stroke="#4A453F" {...strokeProps} />
          <path d="M12 26H18" stroke="#4A453F" {...strokeProps} />
          <path d="M12 36H18" stroke="#4A453F" {...strokeProps} />
          <path d="M12 46H18" stroke="#4A453F" {...strokeProps} />
          {/* Cover hand-drawn line detail */}
          <path d="M24 38C28 36.5 34 39.5 38 38" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "microphone":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Mic capsule */}
          <rect
            x="24"
            y="10"
            width="16"
            height="26"
            rx="8"
            fill="#FDF6F0"
            stroke="#C86D51"
            {...strokeProps}
          />
          {/* Mesh lines */}
          <path d="M26 18H38" stroke="#D98268" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M27 24H37" stroke="#D98268" strokeWidth="1.5" strokeLinecap="round" />
          {/* U-stand */}
          <path
            d="M18 26C18 34 24 40 32 40C40 40 46 34 46 26"
            stroke="#4A453F"
            {...strokeProps}
          />
          {/* Stand stem & base */}
          <path d="M32 40V50" stroke="#4A453F" {...strokeProps} />
          <path d="M22 52C27 50.8 37 50.8 42 52" stroke="#4A453F" {...strokeProps} />
          {/* Sound wave arcs */}
          <path d="M12 24C10 28 10 32 12 36" stroke="#C86D51" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M52 24C54 28 54 32 52 36" stroke="#C86D51" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "search":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Lens */}
          <circle
            cx="27"
            cy="27"
            r="16"
            fill="#FAF7F2"
            stroke="#C86D51"
            {...strokeProps}
          />
          {/* Lens glare */}
          <path d="M22 18C25 15.5 29 15.5 32 17" stroke="#D98268" strokeWidth="1.5" strokeLinecap="round" />
          {/* Wooden handle */}
          <path
            d="M38 38L52 52"
            stroke="#4A453F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Handle wrap detail */}
          <path d="M41 41L44 44" stroke="#C86D51" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "cafe":
    case "place":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Coffee cup body */}
          <path
            d="M16 22C16 22 18 46 32 46C46 46 48 22 48 22H16Z"
            fill="#FDF6F0"
            stroke="#C86D51"
            {...strokeProps}
          />
          {/* Cup saucer */}
          <path d="M12 50C22 53 42 53 52 50" stroke="#4A453F" {...strokeProps} />
          {/* Cup handle */}
          <path
            d="M48 26C53 26 56 30 55 35C54 40 47 41 47 41"
            stroke="#C86D51"
            {...strokeProps}
          />
          {/* Steam wisps */}
          <path d="M24 16C23 12 27 10 26 6" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M32 18C31 13 35 11 34 7" stroke="#C86D51" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M40 16C39 12 43 10 42 6" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "camera":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Camera body */}
          <rect
            x="10"
            y="20"
            width="44"
            height="32"
            rx="6"
            fill="#FAF7F2"
            stroke="#4A453F"
            {...strokeProps}
          />
          {/* Top flash box */}
          <path d="M22 20V14C22 13 23 12 24 12H40C41 12 42 13 42 14V20" fill="#FDF6F0" stroke="#4A453F" {...strokeProps} />
          {/* Lens outer circle */}
          <circle cx="32" cy="36" r="11" fill="#FDF6F0" stroke="#C86D51" {...strokeProps} />
          {/* Lens inner circle */}
          <circle cx="32" cy="36" r="5" fill="#C86D51" />
          {/* Shutter button spark */}
          <circle cx="16" cy="26" r="1.5" fill="#C86D51" />
        </svg>
      );

    case "memory":
    case "book":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Open pages */}
          <path
            d="M32 18C24 14 14 16 10 18V50C14 48 24 46 32 50C40 46 50 48 54 50V18C50 16 40 14 32 18Z"
            fill="#FDF6F0"
            stroke="#4A453F"
            {...strokeProps}
          />
          {/* Spine center line */}
          <path d="M32 18V50" stroke="#C86D51" {...strokeProps} />
          {/* Left page text lines */}
          <path d="M16 26H26" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 33H24" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 40H26" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right page text lines */}
          <path d="M38 26H48" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38 33H46" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38 40H48" stroke="#A39E95" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case "person_abstract":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Head ◯ */}
          <circle cx="32" cy="18" r="8" fill="#FDF6F0" stroke="#C86D51" {...strokeProps} />
          {/* Body stem / arms /|\ */}
          <path d="M32 26V42" stroke="#4A453F" {...strokeProps} />
          <path d="M20 34C26 31 38 31 44 34" stroke="#4A453F" {...strokeProps} />
          {/* Legs / \ */}
          <path d="M32 42L22 54" stroke="#4A453F" {...strokeProps} />
          <path d="M32 42L42 54" stroke="#4A453F" {...strokeProps} />
        </svg>
      );

    case "envelope":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Envelope body */}
          <rect
            x="10"
            y="18"
            width="44"
            height="30"
            rx="4"
            fill="#FAF7F2"
            stroke="#4A453F"
            {...strokeProps}
          />
          {/* Flap lines */}
          <path d="M10 20L32 36L54 20" stroke="#C86D51" {...strokeProps} />
          {/* Heart seal */}
          <path
            d="M32 38C30 35 26 36 26 39C26 42 32 45 32 45C32 45 38 42 38 39C38 36 34 35 32 38Z"
            fill="#C86D51"
          />
        </svg>
      );

    case "thinking":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Abstract thought cloud doodle */}
          <path
            d="M20 42C15 42 12 37 14 31C11 27 13 20 18 19C21 13 30 11 36 15C41 12 49 15 50 20C54 23 54 30 50 34C52 40 47 44 41 43C37 46 25 46 20 42Z"
            fill="#FDF6F0"
            stroke="#C86D51"
            {...strokeProps}
          />
          {/* Little floating thought dots */}
          <circle cx="18" cy="50" r="3" fill="#C86D51" />
          <circle cx="12" cy="55" r="2" fill="#D98268" />
        </svg>
      );

    case "empty":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Empty journal page */}
          <rect
            x="14"
            y="10"
            width="36"
            height="44"
            rx="4"
            fill="#FDF6F0"
            stroke="#A39E95"
            {...strokeProps}
          />
          {/* Dotted placeholder lines */}
          <path d="M22 20H42" stroke="#E8E2D9" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M22 28H42" stroke="#E8E2D9" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M22 36H36" stroke="#E8E2D9" strokeWidth="2" strokeDasharray="3 3" />
          {/* Small hand-drawn sparkle */}
          <path d="M40 42L42 46L46 48L42 50L40 54L38 50L34 48L38 46L40 42Z" fill="#C86D51" />
        </svg>
      );

    case "question":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Hand-drawn ? doodle */}
          <path
            d="M24 22C24 16 30 12 36 13C41 14 44 19 42 24C40 29 32 31 32 38"
            stroke="#C86D51"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="32" cy="48" r="2.5" fill="#C86D51" />
          {/* Subtle outline aura */}
          <circle cx="32" cy="32" r="26" stroke="#E8E2D9" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      );

    case "celebration":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          {/* Sparkles & bursts */}
          <path d="M32 10V22M32 42V54M10 32H22M42 32H54" stroke="#C86D51" {...strokeProps} />
          <path d="M16 16L24 24M40 40L48 48M16 48L24 40M40 24L48 16" stroke="#D98268" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="32" r="4" fill="#C86D51" />
        </svg>
      );

    case "video":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          <rect x="10" y="16" width="44" height="32" rx="4" fill="#FAF7F2" stroke="#4A453F" {...strokeProps} />
          <path d="M26 24L42 32L26 40V24Z" fill="#C86D51" stroke="#C86D51" {...strokeProps} />
        </svg>
      );

    case "attach":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          <path
            d="M38 18L22 34C18 38 18 44 22 48C26 52 32 52 36 48L50 34C56 28 56 18 50 12C44 6 34 6 28 12L12 28C4 36 4 48 12 56"
            stroke="#C86D51"
            {...strokeProps}
          />
        </svg>
      );

    case "location":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`inline-block ${className}`}
        >
          <path
            d="M32 10C21 10 14 18 14 28C14 42 32 54 32 54C32 54 50 42 50 28C50 18 43 10 32 10Z"
            fill="#FDF6F0"
            stroke="#C86D51"
            {...strokeProps}
          />
          <circle cx="32" cy="26" r="6" fill="#C86D51" />
        </svg>
      );

    default:
      return null;
  }
}
