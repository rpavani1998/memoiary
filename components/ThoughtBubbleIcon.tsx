import React from "react";

interface Props {
  className?: string;
  size?: number;
}

export function ThoughtBubbleIcon({ className = "w-6 h-6", size }: Props) {
  const sizeProps = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...sizeProps}
    >
      {/* Smooth Thought Cloud with warm semi-fill */}
      <path
        d="M17.5 17.5H8.8A6.8 6.8 0 1 1 15.3 8.7h1.9a4.3 4.3 0 1 1 0 8.8Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M17.5 17.5H8.8A6.8 6.8 0 1 1 15.3 8.7h1.9a4.3 4.3 0 1 1 0 8.8Z" />

      {/* Heart motif centered in the thought cloud */}
      <path
        d="M12.5 13.8s-2.8-1.8-2.8-3.4c0-0.9 0.7-1.6 1.6-1.6 0.6 0 1.1 0.3 1.4 0.8 0.3-0.5 0.8-0.8 1.4-0.8 0.9 0 1.6 0.7 1.6 1.6 0 1.6-2.8 3.4-2.8 3.4z"
        fill="currentColor"
        stroke="none"
      />

      {/* Trailing thought dots */}
      <circle cx="5" cy="18.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="2.2" cy="21" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
