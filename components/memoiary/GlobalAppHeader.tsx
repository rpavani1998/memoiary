"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Flame, Search, UserRound, X } from "lucide-react";
import { Brand, IconButton } from "./Brand";

export type View =
  | "life"
  | "entities"
  | "collections"
  | "reflect"
  | "people"
  | "person"
  | "explore"
  | "places"
  | "place"
  | "thoughts"
  | "thought"
  | "connections"
  | "chapters"
  | "journeys"
  | "story"
  | "search"
  | "profile"
  | "memory"
  | "empty"
  | "onboarding";

export function GlobalAppHeader({
  activeView,
  go,
  streak,
  user,
  isDemoMode,
  onOpenLogin,
  onBack,
  searchQuery = "",
  onSearchQueryChange,
}: {
  activeView: View;
  go: (view: View) => void;
  streak: any;
  user: any;
  isDemoMode?: boolean;
  onOpenLogin?: () => void;
  onBack?: () => void;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
}) {
  const streakCount = typeof streak === "number" ? streak : (streak?.currentStreak || 0);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        if (activeView !== "search") {
          go("search");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView, go]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchQueryChange) {
      onSearchQueryChange(localQuery);
    }
    if (activeView !== "search") {
      go("search");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    }
    if (val.trim() && activeView !== "search") {
      go("search");
    }
  };

  const clearSearch = () => {
    setLocalQuery("");
    if (onSearchQueryChange) {
      onSearchQueryChange("");
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full shrink-0 font-sans">
      {isDemoMode && (
        <div className="bg-[#FFF8E7] border-b border-[#E6C875] px-3 sm:px-6 py-1.5 text-center text-xs font-sans text-[#7A5B04] flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono font-bold text-[10px] uppercase bg-[#F7E198] text-[#5C4200] px-2 py-0.5 rounded-md tracking-wider">
              Demo Mode
            </span>
            <span className="truncate">Viewing sample data (Maya, Kabir, Ananya)</span>
          </div>
          <button
            onClick={onOpenLogin}
            className="px-2.5 py-0.5 bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-lg font-bold text-[11px] cursor-pointer shrink-0 transition-transform active:scale-95 shadow-2xs"
          >
            Sign In with Google →
          </button>
        </div>
      )}

      <header className="bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#1C1917]/15 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs font-sans">
        {/* Left: Back button + Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onBack && (
            <IconButton label="Go back" onClick={onBack} className="mr-0.5">
              <ArrowLeft size={18} />
            </IconButton>
          )}
          <Brand compact />
        </div>

        {/* Center: Prominent Top Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="relative flex-1 max-w-md mx-1 sm:mx-4 group"
        >
          <div className="relative flex items-center w-full">
            <Search
              size={16}
              className="absolute left-3 text-[#665F56] group-focus-within:text-[#DE5239] transition-colors pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (activeView !== "search" && localQuery.trim()) {
                  go("search");
                }
              }}
              placeholder="Search memories, people, places, thoughts..."
              className="w-full pl-9 pr-14 py-1.5 text-xs font-sans rounded-2xl bg-white border border-[#1C1917]/20 text-[#1C1917] placeholder:text-[#665F56]/60 focus:outline-none focus:border-[#DE5239] focus:ring-2 focus:ring-[#DE5239]/15 shadow-2xs transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-1">
              {localQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 rounded-full text-[#665F56] hover:text-[#DE5239] hover:bg-[#F5E5DC] transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="p-1 rounded-full text-[#DE5239] hover:bg-[#F5E5DC] transition-colors cursor-pointer flex items-center justify-center"
                  title="Execute search"
                >
                  <Search size={14} />
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Right: Streak & Profile / Sign In */}
        <div className="flex items-center gap-2 shrink-0">
          {streakCount > 0 && !isDemoMode && (
            <div className="hidden xs:flex items-center gap-1 bg-[#F5E5DC] border border-[#DE5239]/20 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-[#DE5239]">
              <Flame size={14} className="fill-[#DE5239]" />
              <span>{streakCount}d</span>
            </div>
          )}

          {isDemoMode ? (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DE5239] hover:bg-[#C6422A] text-white text-xs font-sans font-bold rounded-full shadow-2xs transition-transform active:scale-95 cursor-pointer"
              title="Sign in to save your memories"
            >
              <UserRound size={14} />
              <span>Sign In</span>
            </button>
          ) : (
            <button
              onClick={() => go("profile")}
              className="w-8.5 h-8.5 rounded-full border border-[#1C1917] overflow-hidden bg-stone-200 cursor-pointer shadow-2xs transition-transform active:scale-95 shrink-0"
              title={`Logged in as ${user?.displayName || user?.email || "Account"}`}
            >
              <img src={user?.photoURL || "/logo-mark.png"} alt="User avatar" className="w-full h-full object-cover" />
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

export function PageHeader({
  title,
  eyebrow,
  onBack,
  action,
}: {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-2 mb-3 font-sans">
      <div>
        {eyebrow && <p className="text-[10px] uppercase tracking-wider text-[#DE5239] font-bold font-sans">{eyebrow}</p>}
        <h2 className="font-serif text-xl font-medium text-[#1C1917]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
