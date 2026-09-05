"use client";

import React from "react";

export function Brand({ compact = false }: { compact?: boolean }) {
  const [imgSrc, setImgSrc] = React.useState("/logo-mark.png");

  return (
    <div className="flex items-center gap-2.5 select-none" aria-label="Memoiary">
      <img
        src={imgSrc}
        onError={() => setImgSrc("/logo.png")}
        alt="Memoiary logo"
        className={`${compact ? "h-10 sm:h-12" : "h-14 sm:h-16"} w-auto object-contain shrink-0`}
      />
      <span className={`font-serif ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} font-semibold tracking-tight text-stone-900`}>
        Memoiary
      </span>
    </div>
  );
}

export function IconButton({
  label,
  onClick,
  children,
  className = "",
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`icon-button cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
