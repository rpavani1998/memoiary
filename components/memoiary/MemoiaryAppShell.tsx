"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  ChevronRight,
  CircleUserRound,
  Compass,
  Flame,
  Heart,
  House,
  Image as ImageIcon,
  LockKeyhole,
  Map,
  MapPin,
  Mic,
  MoreHorizontal,
  Pause,
  PenLine,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  MessageSquarePlus,
  UserRound,
  Users,
  Video,
  X,
  LogOut,
  Palette,
  Trash2,
} from "lucide-react";
import { useJournal } from "@/lib/context/JournalContext";
import { useMediaCapture } from "@/lib/hooks/useMediaCapture";
import { BrandStoryBanner } from "@/components/BrandStoryBanner";
import { CaptureSession } from "@/lib/memory-engine/types";
import { ThoughtBubbleIcon } from "@/components/ThoughtBubbleIcon";
import { ArtisticAvatar } from "@/components/ArtisticAvatar";
import { DailyStoryboard } from "@/components/DailyStoryboard";
import { WeeklyRecapBoard } from "@/components/WeeklyRecapBoard";
import { useArtStyle, ART_STYLES, ArtStyle } from "@/lib/context/ArtStyleContext";
import { getPersonVisualIdentity } from "@/lib/memory-engine/person-graph";
import { TimelineViewSwitcher, TimelineMode } from "@/components/TimelineViewSwitcher";
import { MonthlyCollageGrid } from "@/components/MonthlyCollageGrid";
import { UnifiedCollectionsGraphView } from "@/components/UnifiedCollectionsGraphView";
import { ReflectionChatboard } from "@/components/ReflectionChatboard";
import { EntitiesViewSection } from "@/components/EntitiesViewSection";

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

export type CaptureMode = "menu" | "write" | "voice" | "photo" | "video" | null;
export type CapturedMemory = { kind: "written" | "voice" | "photo" | "video"; text: string; location?: string };

const wave = [28, 62, 96, 54, 32, 70, 43, 88, 58, 35, 76, 100, 64, 42, 82, 51, 31, 68, 44, 91, 57, 37, 73, 49];

const imageAssets = {
  rooftopChai: "/images/rooftop-chai.jpg",
  cafeNotes: "/images/cafe-notes.jpg",
  doorwayShoes: "/images/doorway-shoes.jpg",
  logo: "/logo-mark.png",
};

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none" aria-label="Memoiary">
      <img
        src="/logo-mark.png"
        alt="Memoiary logo"
        className={`${compact ? "h-12 sm:h-13" : "h-15 sm:h-16"} w-auto object-contain shrink-0 scale-110 -my-1`}
      />
      <span className={`font-serif ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} font-semibold tracking-tight text-stone-900`}>
        Memoiary
      </span>
    </div>
  );
}

function IconButton({
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

function GlobalAppHeader({
  activeView,
  go,
  streak,
  user,
  onBack
}: {
  activeView: View;
  go: (view: View) => void;
  streak: number;
  user: any;
  onBack?: () => void;
}) {
  const getSubTitle = () => {
    switch (activeView) {
      case "life": return "Timeline & Daily Moments";
      case "entities": return "People, Places & Projects";
      case "collections": return "Memory Graph & Topics";
      case "reflect": return "Talk With Your Diary";
      case "search": return "Semantic Memory Search";
      case "person": return "Person Deep Dive";
      case "place": return "Place Memories";
      case "profile": return "Your Profile & Settings";
      default: return "Memories Connected";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#1C1917]/15 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs mb-3">
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <IconButton label="Go back" onClick={onBack} className="mr-1">
            <ArrowLeft size={19} />
          </IconButton>
        )}
        <Brand compact />
        <div className="hidden sm:block h-6 w-px bg-stone-300" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DE5239] bg-[#F5E5DC] px-2.5 py-0.5 rounded-full border border-[#DE5239]/20 hidden xs:inline-block truncate">
          {getSubTitle()}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => go("search")}
          className="p-2 rounded-xl bg-white border border-[#1C1917]/20 text-[#1C1917] hover:bg-[#F5E5DC] transition-colors cursor-pointer"
          title="Search Memories"
        >
          <Search size={16} />
        </button>

        {streak > 0 && (
          <div className="flex items-center gap-1 bg-[#F5E5DC] border border-[#DE5239]/20 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-[#DE5239]">
            <Flame size={14} className="fill-[#DE5239]" />
            <span>{streak}d</span>
          </div>
        )}

        <button
          onClick={() => go("profile")}
          className="w-8 h-8 rounded-full border border-[#1C1917] overflow-hidden bg-stone-200 cursor-pointer"
          title="Your Profile"
        >
          <img src={user?.photoURL || "/logo-mark.png"} alt="User avatar" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
}

function PageHeader({
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
    <div className="flex items-center justify-between border-b border-[#1C1917]/10 pb-2 mb-3">
      <div>
        {eyebrow && <p className="text-[10px] uppercase tracking-wider text-[#DE5239] font-bold font-sans">{eyebrow}</p>}
        <h2 className="font-serif text-xl font-medium text-[#1C1917]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] p-6 animate-fade-in select-none">
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/poster-end.png"
          className="memoiary-motion max-w-[280px]"
          aria-label="Memoiary logo animation"
        >
          <source src="/assets/memoiary-logo-motion.webm" type="video/webm" />
          <source src="/assets/memoiary-logo-motion-fallback.gif" type="image/gif" />
        </video>
        <p className="font-serif text-xl sm:text-2xl font-medium text-stone-900 mt-6 tracking-tight">
          Your memories, beautifully connected.
        </p>
      </div>
      <div className="pb-8 text-xs text-stone-400 font-sans tracking-wide">
        Loading your story…
      </div>
    </div>
  );
}

function AuthLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { signIn, signInAsGuest, saveError } = useJournal();
  const [signingIn, setSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setLocalError(null);
    try {
      await signIn();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setLocalError(err?.message || "Sign in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleGuestSignIn = async () => {
    setSigningIn(true);
    setLocalError(null);
    try {
      await signInAsGuest();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Guest Sign-In Error:", err);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 space-y-5 text-center relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex justify-center pt-2">
          <img src="/logo-mark.png" alt="Memoiary" className="h-16 w-auto object-contain" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-xl font-medium text-stone-900">Sign in to save your memories</h2>
          <p className="text-xs text-stone-500 font-sans leading-relaxed">
            Keep your thoughts, photos, and voice notes safely connected across all your devices.
          </p>
        </div>

        {(localError || saveError) && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs text-left">
            {localError || saveError}
          </div>
        )}

        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-xs font-medium flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {signingIn ? "Signing in..." : "Continue with Google"}
          </button>

          <button
            onClick={handleGuestSignIn}
            disabled={signingIn}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

function LifeHome({
  go,
  openCapture,
  newMemory,
  onSelectCapture,
}: {
  go: (view: View) => void;
  openCapture: (prompt?: string) => void;
  newMemory: CapturedMemory | null;
  onSelectCapture: (c: any) => void;
}) {
  const { user, streak, captures } = useJournal();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-09-02T12:00:00Z"));
  const [timelineMode, setTimelineMode] = useState<TimelineMode>("day");
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  const formattedSelectedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).toUpperCase();

  const changeDateByDays = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const uniqueDaysLogged = new Set(captures.map((c) => new Date(c.createdAt).toDateString())).size;
  const availableDates = Array.from(new Set(captures.map((c) => new Date(c.createdAt).toISOString().split("T")[0])));

  const selectedDateStr = selectedDate.toDateString();
  const dayCaptures = captures.filter((c) => {
    const cDate = new Date(c.createdAt).toDateString();
    return cDate === selectedDateStr;
  });
  const recentCaptures = dayCaptures.length > 0 ? dayCaptures : captures.slice(0, 6);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className="pb-32 font-sans px-5 sm:px-8 pt-2 space-y-4">
      {/* Timeline View Mode Switcher: DAY | WEEK | MONTH */}
      <TimelineViewSwitcher
        selectedDate={selectedDate}
        onSelectDate={(d) => setSelectedDate(d)}
        activeMode={timelineMode}
        onModeChange={(m) => setTimelineMode(m)}
        availableDates={availableDates}
        uniqueDaysLogged={uniqueDaysLogged}
        showFullCalendar={showFullCalendar}
        onToggleCalendar={() => setShowFullCalendar(!showFullCalendar)}
      />

        {/* Date Navigation Bar when in Day Mode */}
        {timelineMode === "day" && (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => changeDateByDays(-1)}
                className="p-1.5 rounded-full border border-[#1C1917]/20 bg-[#F5F1E8] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer"
                title="Previous day"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>

              <div className="text-center">
                <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#665F56] block">
                  {formattedSelectedDate}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl leading-tight font-medium text-[#1C1917] mt-0.5 flex items-center justify-center gap-2">
                  {isToday ? "Today's memories" : "Memories from this day"}
                  <button
                    onClick={() => setShowFullCalendar(!showFullCalendar)}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      showFullCalendar
                        ? "border-[#D97706] bg-[#D97706] text-white"
                        : "border-[#1C1917]/20 bg-[#F5F1E8] text-[#665F56] hover:bg-[#F5E5DC]"
                    }`}
                    title="Toggle calendar"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  </button>
                </h1>
              </div>

              <button
                onClick={() => changeDateByDays(1)}
                disabled={isToday}
                className={`p-1.5 rounded-full border transition-all ${
                  isToday
                    ? "border-[#1C1917]/10 bg-[#F5F1E8]/50 text-[#1C1917]/30 cursor-not-allowed"
                    : "border-[#1C1917]/20 bg-[#F5F1E8] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer"
                }`}
                title="Next day"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* Streak Banner */}
        {user && streak.currentStreak > 0 && (
          <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-amber-50 border border-amber-200/60 rounded-xl w-fit">
            <Flame size={16} className="text-amber-600" />
            <span className="text-xs font-medium text-amber-800">
              {streak.currentStreak} day streak
            </span>
            <span className="text-xs text-amber-600">
              · {streak.totalPoints} pts
            </span>
          </div>
        )}

      {/* Main Feed Content depending on Timeline Mode */}
      <main className="mt-6 px-5 sm:px-8 space-y-4">
        
        {/* WEEKLY MODE VIEW */}
        {timelineMode === "week" && (
          <WeeklyRecapBoard
            weekLabel="This Week"
            uniqueDaysLogged={uniqueDaysLogged}
            isUnlocked={uniqueDaysLogged >= 7}
            weeklyPeople={Array.from(new Set(captures.flatMap((c) => c.dimensions?.people || [])))}
            weeklyInsight={
              captures.length > 0
                ? "Your week shifted from intense early-week sprint stress into celebratory team milestones and deep restorative time with friends."
                : undefined
            }
            highlights={
              captures.length > 0
                ? captures.slice(0, 3).map((c, i) => ({
                    id: c.id,
                    dayLabel: new Date(c.createdAt).toLocaleDateString("en-US", { weekday: "short" }),
                    title: c.dimensions?.summary || c.content.substring(0, 30),
                    summary: c.content,
                    imageUrl: c.mediaUrl || "/collages/daily_collage_sketch_sep2.jpg",
                    people: c.dimensions?.people || [],
                    mood: c.dimensions?.mood
                  }))
                : []
            }
            onSelectHighlight={() => setTimelineMode("day")}
          />
        )}

        {/* MONTHLY MODE VIEW */}
        {timelineMode === "month" && (
          <MonthlyCollageGrid
            monthLabel="September 2026"
            uniqueDaysLogged={uniqueDaysLogged}
            isUnlocked={uniqueDaysLogged >= 30}
            monthlyPeople={Array.from(new Set(captures.flatMap((c) => c.dimensions?.people || [])))}
            onSelectCollage={() => setTimelineMode("day")}
          />
        )}

        {/* DAY MODE VIEW */}
        {timelineMode === "day" && (
          <div className="space-y-4 relative before:absolute before:left-9 sm:before:left-12 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#1C1917]/15">
            {/* New memory from current session */}
            {newMemory && (
              <section className="relative z-10 border-[1.5px] border-[#1C1917] bg-[#F5E5DC] rounded-3xl p-5 shadow-[3px_4px_0px_#1C1917]" aria-label="Your newest memory">
                <button className="w-full text-left cursor-pointer border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl p-4 shadow-[1px_2px_0px_#1C1917]" onClick={() => go("memory")}>
                  <span className="flex items-center justify-between">
                    <span className="memory-kicker flex items-center gap-1.5 text-[#DE5239] font-bold text-xs uppercase">
                      <span className="node-dot" />
                      Just captured
                    </span>
                    <span className="memory-meta text-[#665F56] text-xs">Now</span>
                  </span>
                  <p className="font-serif text-[#1C1917] text-lg leading-relaxed mt-2">{newMemory.text}</p>
                </button>
              </section>
            )}

            {/* Featured Date-Matched Daily Visual Storyboard */}
            {(() => {
              const storyboardCapture = captures.find((c) => c.episodes && c.episodes.length > 0);
              if (!storyboardCapture || !storyboardCapture.episodes) return null;
              return (
                <DailyStoryboard
                  dateStr={selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  scenes={storyboardCapture.episodes.map((ep: any, idx: number) => ({
                    id: ep.id || `sc_${idx}`,
                    panelNumber: idx + 1,
                    time: idx === 0 ? "11:00 AM" : idx === 1 ? "1:30 PM" : "7:30 PM",
                    title: ep.title,
                    summary: ep.summary,
                    location: ep.location || (idx === 0 ? "Engineering Office" : idx === 1 ? "Olive Bistro, Jubilee Hills" : "Durgam Cheruvu Lake"),
                    people: ep.entitiesInvolved && ep.entitiesInvolved.length > 0 ? ep.entitiesInvolved : (idx === 0 ? ["Kabir", "Ananya"] : idx === 1 ? ["Kabir", "Ananya"] : ["Maya"]),
                    imageUrl: "/collages/daily_collage_sketch_sep2.jpg"
                  }))}
                />
              );
            })()}

            {/* Real captures from Firestore or Mock cards */}
            {recentCaptures.length > 0 ? (
              recentCaptures.map((capture) => {
                const dims = capture.dimensions;
                return (
                  <div key={capture.id} className="relative z-10 space-y-3">
                    {capture.source === "video" || capture.mediaUrl?.startsWith("data:video") ? (
                      /* Video Media Card */
                      <button
                        onClick={() => onSelectCapture(capture)}
                        className="w-full text-left border-[1.5px] border-[#1C1917] bg-[#1C1917] text-white rounded-3xl overflow-hidden shadow-[2px_3px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer group"
                      >
                        <div className="max-h-72 w-full overflow-hidden bg-black flex items-center justify-center relative">
                          <video
                            src={capture.mediaUrl}
                            controls
                            className="w-full max-h-72 object-contain"
                          />
                        </div>
                        <div className="p-4 sm:p-5 space-y-1 bg-[#1C1917]">
                          <span className="text-[10px] font-mono uppercase font-bold text-[#D97706] bg-[#D97706]/20 px-2 py-0.5 rounded-md border border-[#D97706]/40">
                            Recorded Video
                          </span>
                          <h3 className="font-serif font-medium text-stone-100 text-xl leading-snug">
                            {capture.content || "Video Recording"}
                          </h3>
                        </div>
                      </button>
                    ) : capture.source === "image" || (capture.mediaUrl && capture.mediaUrl.startsWith("data:image")) ? (
                      /* Photo Media Card */
                      <button
                        onClick={() => onSelectCapture(capture)}
                        className="w-full text-left border-[1.5px] border-[#1C1917] bg-white rounded-3xl overflow-hidden shadow-[2px_3px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer group"
                      >
                        <div className="h-64 w-full overflow-hidden bg-stone-100">
                          <img
                            src={capture.mediaUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"}
                            alt="Memory photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 sm:p-5 space-y-1">
                          <h3 className="font-serif font-medium text-[#1C1917] text-xl leading-snug">
                            {dims?.places?.[0] || capture.content?.substring(0, 30) || "Photo Memory"}
                          </h3>
                          {dims?.people && dims.people.length > 0 && (
                            <div className="flex items-center gap-1.5 pt-1">
                              <span className="text-xs text-[#665F56] font-sans font-medium flex items-center gap-1">
                                with
                              </span>
                              <div className="flex items-center gap-1">
                                {dims.people.map((p: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-1 bg-[#F5F1E8] border border-[#1C1917]/20 rounded-full px-2 py-0.5 text-xs text-[#1C1917] font-semibold">
                                    <ArtisticAvatar name={p} size="sm" />
                                    <span>{p}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    ) : capture.source === "voice" ? (
                      <button
                        onClick={() => onSelectCapture(capture)}
                        className="w-full text-left p-4 border-[1.5px] border-[#1C1917] bg-white rounded-2xl shadow-[2px_3px_0px_#1C1917] flex items-center justify-between hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            onClick={(e) => { e.stopPropagation(); setIsPlayingAudio(!isPlayingAudio); }}
                            className="w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center cursor-pointer hover:bg-[#DE5239] transition-colors shrink-0"
                          >
                            {isPlayingAudio ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                          </div>
                          <div>
                            <div className="flex gap-0.5 items-center h-4 mb-1">
                              {[8, 14, 18, 12, 22, 16, 20, 10, 18, 14].map((h, i) => (
                                <span
                                  key={i}
                                  className={`w-1 rounded-full transition-all ${
                                    isPlayingAudio ? "bg-[#DE5239] animate-pulse" : "bg-[#1C1917]/40"
                                  }`}
                                  style={{ height: `${h}px` }}
                                />
                              ))}
                            </div>
                            <p className="font-serif text-sm text-[#665F56] italic">
                              &ldquo;{capture.content.substring(0, 45)}...&rdquo;
                            </p>
                          </div>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectCapture(capture)}
                        className="w-full text-left p-5 border-[1.5px] border-[#1C1917] bg-white rounded-2xl shadow-[2px_3px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <p className="font-serif text-lg text-[#1C1917] leading-relaxed italic text-center sm:text-left">
                          &ldquo;{capture.content}&rdquo;
                        </p>
                      </button>
                    )}

                    {dims?.places?.[0] && (
                      <div className="flex justify-center sm:justify-start">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-full text-xs font-semibold text-[#1C1917] shadow-[1px_2px_0px_#1C1917]">
                          <MapPin size={13} className="text-[#DE5239]" /> {dims.places[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : null}
          </div>
        )}

        {/* Prompt suggestion tiles */}
        {recentCaptures.length === 0 && !newMemory && (
          <div className="space-y-2.5 pt-4 relative z-10">
            <p className="text-[11px] uppercase tracking-wider font-sans font-bold text-[#DE5239] flex items-center gap-1.5">
              <span className="node-dot" />
              Start with something simple
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                "What made you smile today?",
                "A place that felt like home…",
                "Someone you're grateful for",
                "A conversation that stayed with you",
                "Something you don't want to forget",
              ].map((prompt, i) => (
                <button
                  key={prompt}
                  onClick={() => openCapture(prompt)}
                  className={`text-left p-3.5 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl shadow-[2px_3px_0px_#1C1917] hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer group ${
                    i === 4 ? "col-span-2" : ""
                  }`}
                >
                  <span className="font-serif text-sm text-[#1C1917] leading-snug group-hover:text-[#DE5239] transition-colors">&quot;{prompt}&quot;</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 relative z-10">
          <button className="w-full text-center py-3.5 border-[1.5px] border-dashed border-[#1C1917]/40 bg-[#FBF9F4] rounded-2xl text-sm font-sans font-medium text-[#665F56] hover:border-[#DE5239] hover:text-[#DE5239] transition-all cursor-pointer" onClick={() => openCapture()}>
            <Plus size={16} className="inline -mt-0.5 mr-1" /> Capture what this moment feels like
          </button>
        </div>
      </main>
    </div>
  );
}

function PeopleViewSection({ go, onSelectPerson }: { go: (view: View) => void; onSelectPerson: (name: string) => void }) {
  const { captures } = useJournal();
  const peopleAcc: Record<string, { count: number; lastNote: string }> = {};
  captures.forEach((c) => {
    c.dimensions?.people?.forEach((p: string) => {
      if (!peopleAcc[p]) peopleAcc[p] = { count: 0, lastNote: "" };
      peopleAcc[p].count++;
      if (c.dimensions?.summary) peopleAcc[p].lastNote = c.dimensions.summary.substring(0, 60);
    });
  });
  const people = Object.entries(peopleAcc)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="pb-28 font-sans">
      <PageHeader
        title="My People"
        eyebrow="Lives intertwined"
        action={
          <IconButton label="Search people" onClick={() => go("search")}>
            <Search size={18} />
          </IconButton>
        }
      />
      <main className="px-5 sm:px-8">
        <p className="intro-copy">The people who keep appearing in your memories.</p>
        {people.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
            {people.map((person) => (
              <button
                key={person.name}
                onClick={() => { onSelectPerson(person.name); go("person"); }}
                className="group border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl p-4 shadow-[2px_3px_0px_#1C1917] hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <ArtisticAvatar name={person.name} size="lg" />
                  <div className="text-left min-w-0">
                    <h3 className="font-serif text-lg font-medium text-[#1C1917] truncate">{person.name}</h3>
                    <span className="text-[11px] font-sans text-[#DE5239] font-semibold bg-[#F5E5DC] border border-[#DE5239]/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {person.count} memor{person.count === 1 ? "y" : "ies"} together
                    </span>
                    {person.lastNote && <p className="text-xs font-serif text-[#665F56] line-clamp-1 italic mt-1">{person.lastNote}</p>}
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#DE5239] opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-stone-400 text-sm text-center py-8">No people detected yet. Capture memories and Memoiary will find them.</p>
        )}
        <p className="notice">
          <Sparkles size={14} className="text-amber-600 shrink-0" />
          People emerge naturally as your life takes shape.
        </p>
      </main>
    </div>
  );
}


function PersonViewSection({ go, selectedPerson = "Maya" }: { go: (view: View) => void; selectedPerson?: string }) {
  const { captures } = useJournal();
  
  // Filter ONLY entries where this person is tagged or explicitly mentioned
  const personCaptures = captures.filter((c) => {
    const textMatch = c.content.toLowerCase().includes(selectedPerson.toLowerCase());
    const peopleTagMatch = c.dimensions?.people?.some(
      (p: string) => p.toLowerCase() === selectedPerson.toLowerCase()
    );
    return textMatch || peopleTagMatch;
  });

  const identity = getPersonVisualIdentity(selectedPerson);

  return (
    <div className="pb-28 font-sans">
      <PageHeader
        title={selectedPerson}
        eyebrow={`${personCaptures.length} entries grounded strictly in your journal`}
        onBack={() => go("people")}
      />
      <main className="px-5 sm:px-8 space-y-5 mt-2">
        {/* Person Header with Persistent Pencil Sketch Avatar */}
        <div className="p-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl shadow-[3px_4px_0px_#1C1917] flex flex-col items-center text-center space-y-3">
          <ArtisticAvatar name={selectedPerson} size="xl" />
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">{selectedPerson}</h2>
            <p className="text-xs font-serif text-[#DE5239] font-semibold bg-[#F5E5DC] border border-[#DE5239]/20 px-3 py-1 rounded-full w-fit mx-auto mt-1">
              {identity.role || "Friend in Your Memories"}
            </p>
          </div>
          <p className="text-xs text-[#665F56] font-sans max-w-sm italic">
            &ldquo;{identity.baseDescriptor}&rdquo;
          </p>
        </div>

        {/* Strictly Grounded Entries Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-2">
            <h3 className="font-serif text-lg font-medium text-[#1C1917]">
              Journal Entries Mentioning {selectedPerson} ({personCaptures.length})
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#DE5239] bg-[#F5E5DC] px-2.5 py-0.5 rounded-full uppercase border border-[#DE5239]/20">
              100% Factually Grounded
            </span>
          </div>

          {personCaptures.length > 0 ? (
            personCaptures.map((c) => {
              const date = new Date(c.createdAt);
              const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              return (
                <div
                  key={c.id}
                  className="p-4 border-[1.5px] border-[#1C1917] bg-white rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-2 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center justify-between text-xs text-[#DE5239] font-bold">
                    <span>{dateStr}</span>
                    <span className="text-[10px] font-mono text-[#665F56] uppercase bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {c.source} capture
                    </span>
                  </div>
                  <p className="font-serif text-sm text-[#1C1917] leading-relaxed">
                    {c.content}
                  </p>
                  {c.dimensions?.summary && (
                    <p className="text-xs text-[#665F56] font-sans italic bg-[#F5E5DC]/50 p-2.5 rounded-xl border border-[#DE5239]/15">
                      AI Summary: &ldquo;{c.dimensions.summary}&rdquo;
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-stone-500 text-sm py-6 text-center italic">
              No entries found specifically mentioning {selectedPerson}.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

const exploreItems: { title: string; subtitle: string; icon: React.ReactNode; view: View; hero?: boolean }[] = [
  { title: "Places", subtitle: "A geography of your life", icon: <MapPin size={28} />, view: "places", hero: true },
  { title: "Thoughts", subtitle: "See how your ideas evolved", icon: <PenLine size={24} />, view: "thoughts" },
  { title: "Journeys", subtitle: "Paths, departures, returns", icon: <Map size={24} />, view: "journeys" },
  { title: "Chapters", subtitle: "The seasons that emerged", icon: <BookOpen size={24} />, view: "chapters" },
  { title: "Connections", subtitle: "Explore the invisible threads", icon: <Sparkles size={24} />, view: "connections" },
  { title: "Stories", subtitle: "Your memories, quietly told", icon: <Play size={28} />, view: "story", hero: true },
];

function ExploreViewSection({ go }: { go: (view: View) => void }) {
  return (
    <div className="pb-32">
      <PageHeader
        title="Explore"
        eyebrow="Follow a thread"
        action={
          <IconButton label="Search" onClick={() => go("search")}>
            <Search size={18} />
          </IconButton>
        }
      />
      <main className="px-5 sm:px-8">
        <p className="text-sm text-[#665F56] font-sans mt-1 mb-5">There are many ways back into a life.</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {exploreItems.map((item) => (
            <button
              key={item.title}
              onClick={() => go(item.view)}
              className={`group text-left border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl shadow-[2px_3px_0px_#1C1917] hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-1 transition-all cursor-pointer ${
                item.hero ? "col-span-2 p-5 sm:p-6 flex items-center gap-4" : "col-span-1 p-4 sm:p-5 flex flex-col gap-3"
              }`}
            >
              <div className={`flex items-center justify-center rounded-2xl border-[1.5px] border-[#1C1917] bg-[#F5E5DC] text-[#DE5239] shrink-0 ${
                item.hero ? "w-14 h-14" : "w-12 h-12"
              }`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className={`font-serif font-medium text-[#1C1917] ${item.hero ? "text-xl" : "text-base"}`}>{item.title}</h3>
                <p className="text-xs text-[#665F56] font-sans mt-0.5 leading-relaxed">{item.subtitle}</p>
              </div>
              {item.hero && <ChevronRight size={20} className="text-[#DE5239] ml-auto opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

function PlacesViewSection({ go }: { go: (view: View) => void }) {
  const { captures } = useJournal();
  const placesAcc: Record<string, { count: number; lastNote: string }> = {};
  captures.forEach((c) => {
    c.dimensions?.places?.forEach((p: string) => {
      if (!placesAcc[p]) placesAcc[p] = { count: 0, lastNote: "" };
      placesAcc[p].count++;
      if (c.dimensions?.summary) placesAcc[p].lastNote = c.dimensions.summary.substring(0, 60);
    });
  });
  const places = Object.entries(placesAcc)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="pb-28">
      <PageHeader title="My Places" eyebrow="A geography of you" onBack={() => go("explore")} />
      <main>
        <section className="px-5 sm:px-8">
          <p className="eyebrow mt-7">Places that hold you</p>
          {places.length > 0 ? (
            places.map((place) => (
              <button key={place.name} onClick={() => go("place")} className="place-feature cursor-pointer">
                <div>
                  <strong className="font-serif text-xl font-medium text-stone-900">{place.name}</strong>
                  <small>{place.count} memor{place.count === 1 ? "y" : "ies"}</small>
                  {place.lastNote && <q>{place.lastNote}</q>}
                </div>
                <ChevronRight size={18} className="text-stone-400" />
              </button>
            ))
          ) : (
            <p className="text-stone-400 text-sm py-4">No places detected yet. Capture memories with location context.</p>
          )}
        </section>
      </main>
    </div>
  );
}


function PlaceViewSection({ go }: { go: (view: View) => void }) {
  return (
    <div className="pb-24">
      <PageHeader title="Third Wave Coffee" eyebrow="Jubilee Hills · Hyderabad" onBack={() => go("places")} />
      <main className="px-5 sm:px-8">
        <div className="place-cover">
          <img src={imageAssets.cafeNotes} alt="A notebook and chai at Third Wave Coffee" />
          <span>17 memories · 2025—2026</span>
        </div>
        <blockquote className="feature-quote font-serif text-stone-800">“You seem to think differently when you’re here.”</blockquote>
        <div className="place-timeline">
          <article>
            <small>September 2</small>
            <p>Maybe I’m finally ready to build this.</p>
          </article>
          <article>
            <small>August 18</small>
            <p>Two coffees, three pages, one idea that stayed.</p>
          </article>
          <article>
            <small>June 14</small>
            <img src={imageAssets.rooftopChai} alt="Coffee with Sarah" />
            <p>Coffee with Sarah</p>
          </article>
        </div>
      </main>
    </div>
  );
}

function ThoughtsViewSection({ go }: { go: (view: View) => void }) {
  const { captures } = useJournal();
  const topicsAcc: Record<string, { count: number; lastSummary: string }> = {};
  captures.forEach((c) => {
    c.dimensions?.topics?.forEach((t: string) => {
      if (!topicsAcc[t]) topicsAcc[t] = { count: 0, lastSummary: "" };
      topicsAcc[t].count++;
      if (c.dimensions?.summary) topicsAcc[t].lastSummary = c.dimensions.summary.substring(0, 80);
    });
  });
  const topics = Object.entries(topicsAcc)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="pb-28">
      <PageHeader title="Thought Threads" eyebrow="Ideas that recur" onBack={() => go("explore")} />
      <main className="px-5 sm:px-8">
        {topics.length > 0 ? (
          <div className="space-y-3">
            {topics.map((topic) => (
              <button key={topic.name} className="w-full text-left p-4 bg-white border border-stone-200/80 rounded-2xl hover:bg-stone-50 cursor-pointer transition-colors">
                <strong className="font-serif text-base font-medium text-stone-900">{topic.name}</strong>
                <small className="block text-stone-500 text-xs mt-1">{topic.count} related memories</small>
                {topic.lastSummary && <em className="block text-stone-600 text-sm mt-1">{topic.lastSummary}</em>}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-stone-400 text-sm py-8">No thought threads yet. Capture more memories and patterns will emerge.</p>
        )}
      </main>
    </div>
  );
}


function ChaptersViewSection({ go }: { go: (view: View) => void }) {
  const chapters = [
    ["Moving Back Home", "January — March 2026", imageAssets.doorwayShoes, "Home · Mom · Returning"],
    ["Figuring Out What’s Next", "April — July 2026", imageAssets.rooftopChai, "Sarah · Coffee · Questions"],
    ["Building Something New", "August 2026 →", imageAssets.cafeNotes, "Memoiary · Courage · Beginning"],
  ];
  return (
    <div className="pb-24">
      <PageHeader title="Chapters" eyebrow="The seasons that emerged" onBack={() => go("explore")} />
      <main className="chapter-list">
        {chapters.map(([title, date, img, meta], i) => (
          <article key={title as string} className="cursor-pointer" onClick={() => go("story")}>
            <img src={img as string} alt="" loading="lazy" />
            <div>
              <span>Chapter {i + 1}</span>
              <h2 className="font-serif font-medium">{title as string}</h2>
              <p>{date as string}</p>
              <small>{meta as string}</small>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}

function JourneysViewSection({ go }: { go: (view: View) => void }) {
  return (
    <div className="pb-24">
      <PageHeader title="Journeys" eyebrow="Paths through your life" onBack={() => go("explore")} />
      <main className="px-5 sm:px-8">
        <div className="journey-map">
          <svg viewBox="0 0 330 230" aria-hidden="true">
            <path d="M32 180 C80 132 108 162 141 115 S210 79 298 38" />
            <circle cx="32" cy="180" r="5" />
            <circle cx="141" cy="115" r="5" />
            <circle cx="298" cy="38" r="5" />
          </svg>
          <span className="j-start">Hyderabad</span>
          <span className="j-mid">Goa</span>
          <span className="j-end">Mumbai</span>
        </div>
        <h2 className="mt-7 font-serif text-2xl font-medium text-stone-900">The weekend we went to Goa</h2>
        <p className="mt-2 text-sm text-muted-foreground">3 days · 2 people · 18 memories</p>
        <button className="story-preview cursor-pointer" onClick={() => go("story")}>
          <img src={imageAssets.doorwayShoes} alt="The beginning of a journey" />
          <span>
            <Play size={18} /> Watch your story
          </span>
        </button>
      </main>
    </div>
  );
}

function StoryViewSection({ go }: { go: (view: View) => void }) {
  return (
    <div className="story-view">
      <IconButton label="Close story" onClick={() => go("journeys")} className="story-close">
        <X size={20} />
      </IconButton>
      <section className="story-panel">
        <img src={imageAssets.rooftopChai} alt="Friends on a rooftop in Goa" />
        <div className="story-overlay">
          <span>Goa · July 2025</span>
          <h1 className="font-serif">The weekend we stopped planning</h1>
          <p>“Let’s just see where the road goes.”</p>
        </div>
      </section>
      <section className="story-text">
        <span>Day two · 7:14 AM</span>
        <blockquote className="font-serif">The sea was louder than either of us expected.</blockquote>
        <div className="story-wave">
          {wave.map((h, i) => (
            <i key={i} style={{ "--h": `${h}%` } as React.CSSProperties} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SearchViewSection({ go, onSelectCapture }: { go: (view: View) => void; onSelectCapture: (c: any) => void }) {
  const { user } = useJournal();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const suggestions = [
    "When did I first think about starting something?",
    "People I've been thinking about",
    "Moments that made me smile",
  ];

  const handleSearch = async () => {
    if (!query.trim() || !user) return;
    setSearching(true);
    setSearchMessage("");
    try {
      const idToken = typeof user.getIdToken === "function" ? await user.getIdToken() : "demo_guest_token";
      const res = await fetch("/api/v1/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ query: query.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        if (data.message) setSearchMessage(data.message);
      }
    } catch {
      setSearchMessage("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "voice": return <Mic size={14} />;
      case "image": return <Camera size={14} />;
      case "video": return <Video size={14} />;
      default: return <PenLine size={14} />;
    }
  };

  return (
    <div className="pb-24">
      <PageHeader title="Search your life" eyebrow="Remember with help" onBack={() => go("life")} />
      <main className="px-5 sm:px-8">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="search-box">
          <Search size={19} className="text-stone-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="That cafe you went to with Sarah..."
          />
          {query && (
            <IconButton label="Clear" onClick={() => { setQuery(""); setResults([]); setSearchMessage(""); }}>
              <X size={15} />
            </IconButton>
          )}
        </form>
        {!query && results.length === 0 ? (
          <div className="space-y-6 mt-4">
            {/* Weekly Visual Recap Board */}
            <WeeklyRecapBoard
              weekLabel={user ? "This Week" : "Aug 28 – Sep 3, 2026"}
              weeklyPeople={Array.from(new Set(user ? [] : ["Maya", "Kabir", "Ananya"]))}
              weeklyInsight={user ? "Your weekly reflection will summarize as you capture moments throughout the week." : "Start capturing to see your weekly visual synthesis."}
              highlights={user ? [] : []}
              onSelectHighlight={() => go("life")}
            />

            <div>
              <p className="eyebrow mt-6">Try remembering</p>
              <div className="search-suggestions">
                {suggestions.map((q) => (
                  <button key={q} onClick={() => { setQuery(q); }} className="cursor-pointer">
                    {q}
                    <ChevronRight size={15} className="text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="search-results">
            {searching ? (
              <p className="text-sm text-stone-400 mt-4 text-center">Searching your memories...</p>
            ) : searchMessage ? (
              <p className="text-sm text-stone-500 mt-4 text-center">{searchMessage}</p>
            ) : results.length > 0 ? (
              <>
                <p className="eyebrow">{results.length} result{results.length !== 1 ? "s" : ""}</p>
                {results.map((r: any, i: number) => {
                  const c = r.capture;
                  const dims = c.dimensions;
                  return (
                    <button key={c.id || i} onClick={() => onSelectCapture(c)} className="cursor-pointer">
                      <span className="result-icon">
                        {getSourceIcon(c.source)}
                      </span>
                      <span>
                        <strong>{dims?.summary || c.content.substring(0, 60)}</strong>
                        <small>
                          {dims?.mood && `${dims.mood} · `}
                          {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {dims?.people?.length > 0 && ` · ${dims.people.join(", ")}`}
                        </small>
                        {r.reason && <em>{r.reason}</em>}
                      </span>
                    </button>
                  );
                })}
              </>
            ) : query && !searching ? (
              <p className="text-sm text-stone-500 mt-4 text-center">No memories found for &ldquo;{query}&rdquo;</p>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}

function ThoughtThreadSection({ go }: { go: (view: View) => void }) {
  return (
    <div className="pb-24">
      <PageHeader title="Thought Thread" eyebrow="A recurring idea" onBack={() => go("thoughts")} />
      <main className="px-5 sm:px-8">
        <p className="text-stone-400 text-sm py-8">This thought thread will populate as you capture more memories on this topic.</p>
      </main>
    </div>
  );
}

function ConnectionsViewSection({ go }: { go: (view: View) => void }) {
  return (
    <div className="pb-24">
      <PageHeader title="Connections" eyebrow="How memories link" onBack={() => go("life")} />
      <main className="px-5 sm:px-8">
        <p className="text-stone-400 text-sm py-8">Connections between your memories will appear here as patterns emerge.</p>
      </main>
    </div>
  );
}

function MemoryDetailSection({ go, capture }: { go: (view: View) => void; capture: any }) {
  const { updateCapture } = useJournal();
  const [activeTab, setActiveTab] = useState<"raw" | "analyzed">("analyzed");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(capture?.content || "");

  useEffect(() => {
    setEditedContent(capture?.content || "");
  }, [capture?.content]);

  const dims = capture?.dimensions;
  const episodes = capture?.episodes || [];
  const isAiProcessing = capture?.status === "processing" || (!dims && capture?.status !== "reconciled");
  const date = capture?.createdAt ? new Date(capture.createdAt) : new Date();
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  
  const titleText = dims?.summary || capture?.content?.substring(0, 50) || "Memory Detail";

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;
    await updateCapture(capture.id, { content: editedContent.trim() });
    setIsEditing(false);
  };

  return (
    <div className="pb-32 font-sans">
      <PageHeader
        title={titleText}
        eyebrow={`${capture?.source === "video" ? "Recorded Video" : capture?.source === "voice" ? "Voice Recording" : capture?.source === "image" ? "Photo Memory" : "Written Memory"} · ${dateStr}`}
        onBack={() => go("life")}
        action={
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-xl text-xs font-bold text-[#1C1917] shadow-[1px_2px_0px_#1C1917] hover:bg-[#F5E5DC] cursor-pointer"
          >
            <PenLine size={14} className="text-[#DE5239]" />
            <span>{isEditing ? "Cancel" : "Edit Memory"}</span>
          </button>
        }
      />
      <main className="px-5 sm:px-8 mt-4 space-y-5">
        {/* AI Analysis Status Banner */}
        <div className={`p-3.5 border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex items-center justify-between gap-3 text-xs font-sans font-bold ${
          isAiProcessing ? "bg-[#FDF2D0] text-[#D97706]" : "bg-[#FAF7F0] text-[#1C1917]"
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className={isAiProcessing ? "animate-spin text-[#D97706]" : "text-[#DE5239]"} />
            <span>
              {isAiProcessing
                ? "⏳ AI Processing in Progress... Extracting mood & timeline"
                : "✨ AI Analysis Complete & Grounded"}
            </span>
          </div>
          {isAiProcessing && (
            <span className="text-[10px] font-mono uppercase bg-[#D97706] text-white px-2 py-0.5 rounded-md">
              Analyzing
            </span>
          )}
        </div>

        {/* In-App Edit Memory View */}
        {isEditing ? (
          <div className="p-5 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[3px_4px_0px_#1C1917] space-y-4 font-sans">
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">Edit Your Memory Entry</h3>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[10rem] p-4 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl text-[#1C1917] font-serif text-base focus:outline-none resize-none shadow-[2px_3px_0px_#1C1917]"
              placeholder="Update what was captured…"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-stone-100 border border-[#1C1917]/20 rounded-xl text-xs font-bold text-[#665F56] hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#DE5239] border-[1.5px] border-[#1C1917] rounded-xl text-xs font-bold text-white shadow-[2px_3px_0px_#1C1917] hover:bg-[#c9452d] cursor-pointer"
              >
                Save Changes &amp; Re-Analyze
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Dual Tab Switcher: RAW vs ANALYZED */}
            <div className="flex border-b border-[#1C1917]/15 pb-1 gap-4">
              <button
                onClick={() => setActiveTab("analyzed")}
                className={`flex items-center gap-1.5 pb-2 text-xs font-sans font-semibold border-b-2 cursor-pointer transition-colors ${
                  activeTab === "analyzed"
                    ? "border-[#DE5239] text-[#DE5239]"
                    : "border-transparent text-[#665F56] hover:text-[#1C1917]"
                }`}
              >
                <Sparkles size={14} /> Understood &amp; Analyzed
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`flex items-center gap-1.5 pb-2 text-xs font-sans font-semibold border-b-2 cursor-pointer transition-colors ${
                  activeTab === "raw"
                    ? "border-[#DE5239] text-[#DE5239]"
                    : "border-transparent text-[#665F56] hover:text-[#1C1917]"
                }`}
              >
                <PenLine size={14} /> RAW Input
              </button>
            </div>

            {/* TAB 1: RAW INPUT */}
            {activeTab === "raw" && (
              <div className="space-y-4">
                <div className="p-5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#665F56] font-sans block">
                      Exact Captured Words · {dateStr} at {timeStr}
                    </span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-[#DE5239] hover:underline cursor-pointer"
                    >
                      Edit Text
                    </button>
                  </div>
                  <p className="font-serif text-lg text-[#1C1917] leading-relaxed italic">
                    &ldquo;{capture?.content || "Voice recording captured without text"}&rdquo;
                  </p>
                </div>

                {/* Video Player if video source */}
                {(capture?.source === "video" || capture?.mediaUrl?.startsWith("data:video") || capture?.mediaUrl?.includes(".mp4")) && (
                  <div className="rounded-2xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] bg-black">
                    <video controls src={capture.mediaUrl} className="w-full max-h-80 object-contain" />
                  </div>
                )}

                {/* Audio Player if voice source */}
                {(capture?.source === "voice" || capture?.mediaUrl?.startsWith("data:audio")) && (
                  <div className="p-4 bg-[#F5E5DC] border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 rounded-full bg-[#DE5239] text-white flex items-center justify-center cursor-pointer border border-[#1C1917] shadow-xs hover:scale-105 transition-transform"
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </button>
                      <div>
                        <span className="text-xs font-bold text-[#1C1917] block">Original Audio Recording</span>
                        <span className="text-[10px] text-[#665F56]">{timeStr} · Recorded Live</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5 items-center h-5">
                      {[10, 18, 14, 24, 20, 12, 22, 16, 26, 14].map((h, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            isPlaying ? "bg-[#DE5239] animate-pulse" : "bg-[#1C1917]/40"
                          }`}
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo if image source */}
                {(capture?.source === "image" || (capture?.mediaUrl && capture?.mediaUrl?.startsWith("data:image"))) && (
                  <div className="rounded-2xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917]">
                    <img src={capture.mediaUrl} alt="Raw memory photo" className="w-full max-h-72 object-cover" />
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: UNDERSTOOD & ANALYZED */}
            {activeTab === "analyzed" && (
              <div className="space-y-6">
                {isAiProcessing ? (
                  <div className="p-8 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-2xl text-center space-y-3">
                    <Sparkles size={24} className="text-[#D97706] animate-spin mx-auto" />
                    <h4 className="font-serif text-lg font-medium text-[#1C1917]">AI Analysis in progress</h4>
                    <p className="text-xs text-[#665F56] max-w-sm mx-auto font-sans">
                      Gemini AI is currently processing this entry. Extracted mood, emotions, and timeline will populate here shortly!
                    </p>
                  </div>
                ) : (
                  <div className="p-5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#DE5239] block">
                      AI Extracted Dimensions
                    </span>
                    <p className="font-serif text-base text-[#1C1917] leading-relaxed">
                      {dims?.summary || "AI parsed memory dimensions."}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs font-sans pt-1">
                      {dims?.mood && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full font-semibold text-[#DE5239]">
                          <Heart size={12} /> {dims.mood}
                        </span>
                      )}
                      {dims?.places?.map((place: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-[#F5F1E8] border border-[#1C1917]/30 rounded-full font-medium text-[#1C1917]">
                          <MapPin size={12} className="text-[#DE5239]" /> {place}
                        </span>
                      ))}
                      {dims?.people?.map((person: string, i: number) => (
                        <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-[#F5F1E8] border border-[#1C1917]/30 rounded-full font-medium text-[#1C1917]">
                          <ArtisticAvatar name={person} size="sm" />
                          <span>{person}</span>
                        </span>
                      ))}
                      {dims?.emotions?.map((e: any, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full font-medium text-[#DE5239]">
                          ✨ {e.label}
                        </span>
                      ))}
                      {dims?.topics?.map((topic: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-[#F5F1E8] border border-[#1C1917]/30 rounded-full font-medium text-[#1C1917]">
                          <PenLine size={12} /> {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function CollectionsSection({
  go,
  onSelectPerson,
  onSelectCapture
}: {
  go: (view: View) => void;
  onSelectPerson?: (name: string) => void;
  onSelectCapture?: (c: any) => void;
}) {
  const { captures } = useJournal();
  return (
    <div className="pb-32 font-sans px-5 sm:px-8 mt-4">
      <UnifiedCollectionsGraphView
        captures={captures}
        onSelectPerson={onSelectPerson}
        onSelectCapture={onSelectCapture}
        onSearchQuery={() => go("search")}
      />
    </div>
  );
}

function ProfileViewSection({ go }: { go: (view: View) => void }) {
  const { user, logOut, streak, captures, clearAllData } = useJournal();
  const { artStyle, currentStyle } = useArtStyle();

  return (
    <div className="pb-24">
      <PageHeader title="You" eyebrow="Your memory, in your hands" />
      <main className="px-5 sm:px-8">
        <div className="profile-mark">
          <img src={user?.photoURL || imageAssets.logo} alt="Memoiary avatar" className="rounded-full border border-stone-200" />
          <div>
            <strong className="font-serif text-xl font-medium text-stone-900">
              {user?.displayName || "Your Memoiary"}
            </strong>
            <small>{captures.length} memories{streak.longestStreak > 0 ? ` · Longest streak: ${streak.longestStreak} days` : ""}</small>
          </div>
        </div>

        {/* Streak Card */}
        {streak.currentStreak > 0 && (
          <div className="mt-5 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Flame size={22} className="text-amber-600" />
              </div>
              <div>
                <p className="font-serif font-medium text-stone-900">{streak.currentStreak} day streak</p>
                <p className="text-xs text-stone-500">{streak.totalPoints} points earned · {streak.totalCaptures} total captures</p>
              </div>
            </div>
          </div>
        )}

        <div className="privacy-panel">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <strong className="text-stone-900">Your memories are yours.</strong>
            <p>Original captures are never silently changed. Inferences are always labeled and correctable.</p>
          </div>
        </div>

        {/* Artwork Theme Card */}
        <div className="mt-5 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-2xl p-5 shadow-[3px_4px_0px_#1C1917] space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-[#D97706]" />
              <h3 className="font-serif text-lg font-medium text-[#1C1917]">Signature Journal Aesthetic</h3>
            </div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#D97706] bg-[#FDF2D0] border border-[#D97706]/30 px-2.5 py-0.5 rounded-full">
              Pencil & Graphite Sketch
            </span>
          </div>
          <p className="text-xs text-[#665F56] font-sans leading-relaxed">
            All daily storyboards, narrative collages, and person visual identities are rendered in expressive hand-drawn graphite pencil sketch linework on warm parchment paper stock.
          </p>
        </div>

        <div className="settings-list">
          <button onClick={async () => { await clearAllData(); alert("All system data cleared! You now have a fresh zero-entry journal."); }} className="cursor-pointer text-rose-700 font-bold border-rose-200 bg-rose-50/50 hover:bg-rose-100/50">
            <Trash2 className="text-rose-600" />
            <span>
              <strong className="text-rose-700">Clear All System Data</strong>
              <small className="text-rose-500">Delete all entries &amp; start completely fresh</small>
            </span>
            <ChevronRight className="text-rose-600" />
          </button>
          <button className="cursor-pointer">
            <LockKeyhole />
            <span>
              <strong>Privacy &amp; security</strong>
              <small>Memory access, export, app lock</small>
            </span>
            <ChevronRight />
          </button>
          <button onClick={() => go("empty")} className="cursor-pointer">
            <BookOpen />
            <span>
              <strong>See first-day experience</strong>
              <small>Preview an empty Memoiary</small>
            </span>
            <ChevronRight />
          </button>
          {user && (
            <button onClick={logOut} className="cursor-pointer text-rose-700">
              <LogOut />
              <span>
                <strong>Sign Out</strong>
                <small>Log out of your account</small>
              </span>
              <ChevronRight />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyViewSection({ go, capture }: { go: (view: View) => void; capture: () => void }) {
  return (
    <div className="empty-view">
      <button className="back-text cursor-pointer" onClick={() => go("profile")}>
        <ArrowLeft size={16} /> Back
      </button>
      <div className="empty-threads" aria-hidden="true">
        <i /><i /><i /><i /><i /><span />
      </div>
      <Brand />
      <h1 className="font-serif text-2xl font-medium text-stone-900">Your life starts here.</h1>
      <p>Capture anything you want to remember.</p>
      <div className="empty-list font-serif text-stone-700">
        <span>A thought.</span>
        <span>A photo.</span>
        <span>Something someone said.</span>
        <span>A place.</span>
        <span>A moment.</span>
        <strong>Anything.</strong>
      </div>
      <button className="primary-action cursor-pointer" onClick={capture}>
        <Plus /> Capture your first memory
      </button>
    </div>
  );
}

function CaptureOverlay({
  mode,
  setMode,
  onSaved,
  initialPrompt,
  selectedDate,
}: {
  mode: CaptureMode;
  setMode: (m: CaptureMode) => void;
  onSaved: (memory: CapturedMemory) => void;
  initialPrompt?: string;
  selectedDate?: Date;
}) {
  const { submitCapture } = useJournal();
  const media = useMediaCapture();

  type CaptureTab = "write" | "speak" | "capture";
  const [activeTab, setActiveTab] = useState<CaptureTab>("write");

  // ── Accumulated items (NO processing until save) ──
  const [items, setItems] = useState<{ kind: string; label: string; base64?: string; mimeType?: string; text?: string }[]>([]);
  const [textInput, setTextInput] = useState("");
  const [location, setLocation] = useState<string>();
  const [locationInput, setLocationInput] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDone, setVoiceDone] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const recognitionRef = useRef<any>(null);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [captureSubMode, setCaptureSubMode] = useState<"photo" | "video">("photo");

  // Set active tab based on mode prop
  useEffect(() => {
    if (!mode) return;
    if (mode === "voice") {
      setActiveTab("speak");
    } else if (mode === "photo") {
      setActiveTab("capture");
      setCaptureSubMode("photo");
    } else if (mode === "video") {
      setActiveTab("capture");
      setCaptureSubMode("video");
    } else if (initialPrompt) {
      setTextInput(initialPrompt);
      setActiveTab("write");
    } else {
      setActiveTab("write");
    }
  }, [mode, initialPrompt]);

  // Camera setup for capture tab
  useEffect(() => {
    if (activeTab === "capture" && mode) {
      setCameraReady(false);
      const el = videoElRef.current;
      if (el) {
        const start = captureSubMode === "video" ? () => media.startVideoRecording(el) : () => media.startCamera(el);
        start().then(() => setCameraReady(true)).catch(() => {});
      }
    } else {
      media.stopCamera();
      setCameraReady(false);
    }
    return () => media.stopCamera();
  }, [activeTab, mode, captureSubMode]); // eslint-disable-line

  // Cleanup on unmount
  useEffect(() => () => media.cleanup(), []); // eslint-disable-line

  if (!mode) return null;

  // ── Location ──
  const toggleLocation = () => {
    if (location) { setLocation(undefined); setLocationInput(""); setShowLocationInput(false); return; }
    setShowLocationInput(true);
  };
  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocation("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
      () => setLocation("Location unavailable"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };
  const applyLocationInput = () => {
    if (locationInput.trim()) setLocation(locationInput.trim());
    setShowLocationInput(false);
  };

  // ── Voice recording with live transcription ──
  const formatTimer = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const startVoiceRecording = () => {
    setVoiceDone(false);
    setLiveTranscript("");
    setVoiceSeconds(0);
    voiceTimerRef.current = setInterval(() => setVoiceSeconds((s) => s + 1), 1000);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      media.startAudioRecording().then(() => setIsRecordingVoice(true)).catch(() => {});
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => {
      let full = "";
      for (let i = 0; i < e.results.length; i++) full += e.results[i][0].transcript;
      setLiveTranscript(full);
    };
    recognition.onerror = () => {};
    recognition.onend = () => { if (isRecordingVoice) { try { recognition.start(); } catch {} } };
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecordingVoice(true);
    media.startAudioRecording().catch(() => {});
  };

  const stopVoiceRecording = async () => {
    setIsRecordingVoice(false);
    setVoiceDone(true);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    try {
      const result = await media.stopAudioRecording();
      setItems((prev) => [...prev, {
        kind: "voice",
        label: liveTranscript ? `"${liveTranscript.substring(0, 60)}"` : "Voice recording",
        base64: result.base64, mimeType: result.mimeType,
        text: liveTranscript || undefined
      }]);
    } catch {
      if (liveTranscript) {
        setItems((prev) => [...prev, { kind: "voice", label: `"${liveTranscript.substring(0, 60)}"`, text: liveTranscript }]);
      }
    }
  };

  const resetVoice = () => {
    setVoiceDone(false);
    setLiveTranscript("");
    setVoiceSeconds(0);
  };

  // ── Photo capture ──
  const capturePhoto = () => {
    const result = media.capturePhoto();
    if (!result) return;
    setItems((prev) => [...prev, { kind: "photo", label: "Photo", base64: result.base64, mimeType: result.mimeType }]);
  };

  // ── Video capture ──
  const stopVideoRecording = async () => {
    try {
      const result = await media.stopVideoRecording();
      setItems((prev) => [...prev, { kind: "video", label: "Video", base64: result.base64, mimeType: result.mimeType }]);
    } catch {}
  };

  // ── File upload ──
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
      reader.readAsDataURL(file);
    });
    const kind = file.type.startsWith("video") ? "video" : file.type.startsWith("audio") ? "voice" : "photo";
    setItems((prev) => [...prev, { kind, label: file.name, base64, mimeType: file.type }]);
    e.target.value = "";
  };

  // ── Save everything ──
  const saveMemory = async () => {
    const textParts = items.filter((i) => i.kind === "text" || i.text).map((i) => i.text || i.label);
    if (!textInput.trim() && textParts.length === 0 && items.length === 0 && !liveTranscript.trim()) return;
    if (textInput.trim()) textParts.unshift(textInput.trim());
    if (liveTranscript.trim() && !textParts.includes(liveTranscript.trim())) textParts.push(liveTranscript.trim());

    setSaving(true);
    try {
      const mediaItem = items.find((i) => i.base64);
      const mediaUrl = mediaItem
        ? `data:${mediaItem.mimeType || (mediaItem.kind === "video" ? "video/mp4" : mediaItem.kind === "voice" ? "audio/webm" : "image/jpeg")};base64,${mediaItem.base64}`
        : undefined;

      const detectedSource = items.some((i) => i.kind === "video")
        ? "video"
        : items.some((i) => i.kind === "voice") || liveTranscript.trim()
        ? "voice"
        : items.some((i) => i.kind === "photo")
        ? "image"
        : "text";

      let content = textParts.join("\n\n").trim();
      if (!content) {
        if (detectedSource === "video") content = "Recorded Video Memory";
        else if (detectedSource === "voice") content = "Voice Recording";
        else if (detectedSource === "image") content = "Captured Photo Memory";
        else content = "Personal Memory";
      }

      const mediaCtx = items.filter((i) => i.kind !== "text").map((i) => `${i.kind}: ${i.label}`).join(" | ");
      const dateIso = selectedDate ? selectedDate.toISOString() : undefined;
      await submitCapture(content, detectedSource, mediaCtx || undefined, mediaUrl, dateIso);
      onSaved({ kind: "written", text: content, location });
    } catch (err) {
      console.error("Save memory error:", err);
    } finally {
      setSaving(false);
    }
  };

  const hasContent = textInput.trim() || items.length > 0 || liveTranscript.trim();

  const tabItems: { key: CaptureTab; label: string; icon: React.ReactNode }[] = [
    { key: "write", label: "Write", icon: <PenLine size={16} /> },
    { key: "speak", label: "Speak", icon: <Mic size={16} /> },
    { key: "capture", label: "Capture", icon: <Camera size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/50 backdrop-blur-xs flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label="Capture a memory"
      onMouseDown={(e) => { if (e.currentTarget === e.target) setMode(null); }}>
      <section className="w-full sm:max-w-lg bg-[#FBF9F4] border-[1.5px] border-[#1C1917] sm:rounded-3xl rounded-t-3xl shadow-[4px_6px_0px_#1C1917] max-h-[92vh] overflow-y-auto font-sans">
        {/* Handle bar */}
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-[#1C1917]/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-sans font-bold text-[#DE5239] flex items-center gap-1.5">
              <span className="node-dot" /> A new memory
            </span>
            <h2 className="font-serif font-medium text-[#1C1917] text-xl mt-0.5">Tell me anything.</h2>
          </div>
          <button onClick={() => setMode(null)} className="p-2 rounded-full border border-[#1C1917]/20 bg-[#F5F1E8] text-[#665F56] hover:text-[#1C1917] cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex px-5 gap-1 mb-3">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#DE5239] text-white border-[1.5px] border-[#1C1917] shadow-[1px_2px_0px_#1C1917]"
                  : "bg-[#F5F1E8] text-[#665F56] border border-[#1C1917]/20 hover:bg-[#F5E5DC]"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-5 pb-4 space-y-3">

          {/* ── WRITE TAB ── */}
          {activeTab === "write" && (
            <div className="space-y-3">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Write whatever comes to mind…"
                autoFocus
                className="w-full min-h-[10rem] p-4 border-[1.5px] border-[#1C1917] bg-white rounded-2xl text-[#1C1917] placeholder-[#665F56]/60 text-base font-serif focus:outline-none resize-none shadow-[2px_3px_0px_#1C1917] leading-relaxed"
              />
            </div>
          )}

          {/* ── SPEAK TAB ── */}
          {activeTab === "speak" && (
            <div className="space-y-4 flex flex-col items-center">
              {/* Timer */}
              <p className="text-xs text-[#665F56] font-sans font-medium tracking-wider">
                {isRecordingVoice ? formatTimer(voiceSeconds) : voiceDone ? formatTimer(voiceSeconds) : "Tap to start"}
              </p>

              {/* Large animated recording orb */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Outer rotating ring */}
                <div className={`absolute inset-0 rounded-full border-2 border-dashed ${isRecordingVoice ? "border-[#DE5239]/60 animate-spin" : "border-[#1C1917]/15"}`}
                  style={isRecordingVoice ? { animationDuration: "8s" } : {}} />
                {/* Middle pulsing glow */}
                <div className={`absolute inset-3 rounded-full ${isRecordingVoice ? "bg-[#DE5239]/20 animate-pulse" : "bg-[#F5E5DC]"}`} />
                {/* Inner solid orb button */}
                <button
                  onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
                  disabled={saving || voiceDone}
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer border-[2px] border-[#1C1917] ${
                    isRecordingVoice
                      ? "bg-[#DE5239] text-white shadow-[0_0_20px_rgba(222,82,57,0.4)] scale-105"
                      : voiceDone
                      ? "bg-[#F5E5DC] text-[#DE5239]"
                      : "bg-[#DE5239] text-white hover:scale-105"
                  }`}
                >
                  {isRecordingVoice ? (
                    <div className="flex gap-0.5 items-end h-6">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className="w-1 bg-white rounded-full animate-pulse" style={{
                          height: `${8 + Math.random() * 16}px`,
                          animationDelay: `${i * 0.12}s`, animationDuration: "0.6s"
                        }} />
                      ))}
                    </div>
                  ) : voiceDone ? (
                    <span className="text-xs font-sans font-bold">✓</span>
                  ) : (
                    <Mic size={28} />
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[#665F56] font-sans">
                {isRecordingVoice ? "Tap to stop" : voiceDone ? "Recording saved" : "Tap the orb to record"}
              </p>

              {/* Live transcription */}
              {(isRecordingVoice || liveTranscript) && (
                <div className="w-full min-h-[6rem] p-4 border-[1.5px] border-[#1C1917] bg-white rounded-2xl shadow-[2px_3px_0px_#1C1917]">
                  {liveTranscript ? (
                    <textarea
                      value={liveTranscript}
                      onChange={(e) => setLiveTranscript(e.target.value)}
                      readOnly={isRecordingVoice}
                      className="w-full min-h-[5rem] text-base font-serif text-[#1C1917] leading-relaxed bg-transparent resize-none focus:outline-none"
                    />
                  ) : (
                    <p className="text-sm font-serif text-[#665F56] italic animate-pulse">Listening — your words appear here…</p>
                  )}
                </div>
              )}

              {/* Re-record button */}
              {voiceDone && (
                <button onClick={resetVoice} className="text-xs font-sans font-semibold text-[#DE5239] hover:underline cursor-pointer">
                  Re-record
                </button>
              )}
            </div>
          )}

          {/* ── CAPTURE TAB (Photo + Video) ── */}
          {activeTab === "capture" && (
            <div className="space-y-3">
              {/* Photo/Video toggle */}
              <div className="flex gap-1.5">
                <button onClick={() => setCaptureSubMode("photo")}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-sans font-semibold cursor-pointer transition-all ${
                    captureSubMode === "photo" ? "bg-[#F5E5DC] border-[1.5px] border-[#1C1917] text-[#DE5239]" : "bg-[#F5F1E8] border border-[#1C1917]/20 text-[#665F56]"
                  }`}>
                  <Camera size={14} /> Photo
                </button>
                <button onClick={() => setCaptureSubMode("video")}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-sans font-semibold cursor-pointer transition-all ${
                    captureSubMode === "video" ? "bg-[#F5E5DC] border-[1.5px] border-[#1C1917] text-[#DE5239]" : "bg-[#F5F1E8] border border-[#1C1917]/20 text-[#665F56]"
                  }`}>
                  <Video size={14} /> Video
                </button>
              </div>

              {/* Camera viewfinder */}
              <div className="relative rounded-2xl overflow-hidden border-[1.5px] border-[#1C1917] bg-[#1C1917] aspect-[4/3]">
                <video ref={videoElRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs font-sans">
                    Starting camera…
                  </div>
                )}
                {media.isRecording && captureSubMode === "video" && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-red-500 rounded-full text-white text-[10px] font-sans font-bold">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> REC {media.duration}s
                  </div>
                )}
              </div>

              {/* Camera controls */}
              <div className="flex items-center justify-center gap-4">
                {/* Gallery picker */}
                <label className="p-3 rounded-2xl border-[1.5px] border-[#1C1917] bg-[#F5F1E8] text-[#665F56] hover:bg-[#F5E5DC] cursor-pointer transition-colors">
                  <ImageIcon size={20} />
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
                </label>

                {/* Main capture button */}
                {captureSubMode === "photo" ? (
                  <button onClick={capturePhoto} disabled={!cameraReady}
                    className="w-16 h-16 rounded-full bg-[#DE5239] border-[3px] border-[#1C1917] text-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform disabled:opacity-40 shadow-[2px_3px_0px_#1C1917]">
                    <Camera size={24} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (media.isRecording) stopVideoRecording();
                      else { setCameraReady(false); videoElRef.current && media.startVideoRecording(videoElRef.current).then(() => setCameraReady(true)); }
                    }}
                    className={`w-16 h-16 rounded-full border-[3px] border-[#1C1917] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-[2px_3px_0px_#1C1917] ${
                      media.isRecording ? "bg-red-500 text-white" : "bg-[#DE5239] text-white"
                    }`}>
                    {media.isRecording ? <span className="w-5 h-5 rounded-sm bg-white" /> : <Video size={24} />}
                  </button>
                )}

                {/* Flip camera placeholder */}
                <div className="w-12" />
              </div>

              {/* Optional note for captured media */}
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Add a note about this…"
                className="w-full min-h-[3rem] p-3 border-[1.5px] border-[#1C1917] bg-white rounded-2xl text-sm text-[#1C1917] placeholder-[#665F56]/60 font-serif focus:outline-none resize-none shadow-[1px_2px_0px_#1C1917]"
              />
            </div>
          )}

          {/* ── Items added so far (thumbnail pills) ── */}
          {items.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-xl text-[10px] font-sans font-medium text-[#1C1917]">
                  <span>{item.kind === "text" ? "✍" : item.kind === "voice" ? "🎤" : item.kind === "photo" ? "📷" : "🎬"}</span>
                  <span className="max-w-[6rem] truncate">{item.label}</span>
                  <button onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))} className="text-[#DE5239] hover:text-red-600 cursor-pointer ml-0.5">✕</button>
                </div>
              ))}
            </div>
          )}

          {/* ── Bottom toolbar ── */}
          <div className="flex items-center gap-2 pt-1">
            {/* Attach file */}
            <label className="p-2.5 rounded-xl border border-[#1C1917]/20 bg-[#F5F1E8] text-[#665F56] hover:bg-[#F5E5DC] cursor-pointer transition-colors" title="Attach a file">
              <Plus size={16} />
              <input type="file" accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileUpload} />
            </label>

            {/* Location */}
            <button className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${location ? "border-[#DE5239] bg-[#F5E5DC] text-[#DE5239]" : "border-[#1C1917]/20 bg-[#F5F1E8] text-[#665F56] hover:bg-[#F5E5DC]"}`}
              onClick={toggleLocation} title={location || "Add location"}>
              <MapPin size={16} />
            </button>
            {!location && showLocationInput && (
              <div className="flex gap-1.5 flex-1">
                <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") applyLocationInput(); }}
                  placeholder="Place name…" autoFocus
                  className="flex-1 px-3 py-1.5 text-xs border border-[#1C1917]/30 rounded-xl focus:outline-none focus:border-[#DE5239] bg-white font-sans" />
                <button onClick={applyLocationInput} className="px-2.5 py-1 text-xs bg-[#F5E5DC] text-[#DE5239] border border-[#DE5239]/30 rounded-xl cursor-pointer font-semibold">OK</button>
                <button onClick={detectLocation} className="px-2 py-1 text-xs bg-[#F5F1E8] text-[#665F56] border border-[#1C1917]/20 rounded-xl cursor-pointer" title="Use GPS"><MapPin size={12} /></button>
              </div>
            )}
            {location && (
              <span className="text-[10px] font-sans text-[#DE5239] font-medium truncate max-w-[8rem]">📍 {location}</span>
            )}

            {/* Save button — always visible */}
            <button
              className={`ml-auto px-5 py-2.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] ${
                hasContent
                  ? "bg-[#DE5239] text-white hover:bg-[#C6422A]"
                  : "bg-[#F5F1E8] text-[#665F56]/40 pointer-events-none"
              }`}
              onClick={saveMemory}
              disabled={saving || !hasContent}
            >
              {saving ? "Saving…" : "Remember this"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


function SavedMomentToast() {
  return (
    <div className="saved-moment">
      <span />
      <p>Your memory found its place.</p>
    </div>
  );
}

function BottomNav({
  active,
  go,
  capture,
  onSelectMode,
}: {
  active: View;
  go: (v: View) => void;
  capture: () => void;
  onSelectMode: (mode: CaptureMode) => void;
}) {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    timerRef.current = setTimeout(() => {
      setShowQuickMenu(true);
    }, 300);
  };

  const handlePressEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (showQuickMenu) {
      e.stopPropagation();
      return;
    }
    capture();
  };

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      <button className={`cursor-pointer ${active === "life" ? "active" : ""}`} onClick={() => go("life")}>
        <House />
        <span>Life</span>
      </button>
      <button
        className={`cursor-pointer ${active === "entities" || active === "people" || active === "places" ? "active" : ""}`}
        onClick={() => go("entities")}
      >
        <Users />
        <span>Entities</span>
      </button>

      {/* Floating Capture Button Container */}
      <div
        className="capture-button-wrapper"
        onMouseEnter={() => setShowQuickMenu(true)}
        onMouseLeave={() => setShowQuickMenu(false)}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
      >
        {/* Radial Long Press Quick Menu */}
        {showQuickMenu && (
          <div className="radial-quick-menu">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickMenu(false);
                onSelectMode("voice");
              }}
              title="Voice Memory"
            >
              <Mic size={14} className="text-amber-600" /> Speak
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickMenu(false);
                onSelectMode("write");
              }}
              title="Write Memory"
            >
              <PenLine size={14} className="text-amber-600" /> Write
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickMenu(false);
                onSelectMode("photo");
              }}
              title="Photo Memory"
            >
              <Camera size={14} className="text-amber-600" /> Photo
            </button>
          </div>
        )}

        <button className="capture-button cursor-pointer flex items-center justify-center" onClick={handleClick} aria-label="Add a thought" title="Add a thought">
          <span className="capture-halo" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <ThoughtBubbleIcon size={26} className="text-white" />
        </button>
      </div>

      <button className={`cursor-pointer ${active === "collections" ? "active" : ""}`} onClick={() => go("collections")}>
        <ImageIcon size={20} />
        <span>Collections</span>
      </button>

      <button className={`cursor-pointer ${active === "reflect" ? "active" : ""}`} onClick={() => go("reflect")}>
        <Sparkles size={20} />
        <span>Reflect</span>
      </button>
    </nav>
  );
}

export function MemoiaryAppShell() {
  const { user, captures, streak = 0 } = useJournal();
  const [view, setView] = useState<View>("life");
  const [isSplash, setIsSplash] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>(null);
  const [capturePrompt, setCapturePrompt] = useState<string>("");
  const [pendingCaptureMode, setPendingCaptureMode] = useState<CaptureMode>(null);
  const [saved, setSaved] = useState(false);
  const [newMemory, setNewMemory] = useState<CapturedMemory | null>(null);
  const [selectedCapture, setSelectedCapture] = useState<any>(null);
  const [selectedPersonName, setSelectedPersonName] = useState<string>("Maya");

  // Splash loading screen timer (2.5 seconds like Swiggy/Blinkit)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const go = (next: View) => setView(next);

  const handleOpenCapture = (modeOrPrompt: CaptureMode | string = "menu") => {
    // If a string prompt was passed, open in write mode with prompt
    const isPrompt = typeof modeOrPrompt === "string" && !["menu", "write", "voice", "photo", "video"].includes(modeOrPrompt);
    const mode: CaptureMode = isPrompt ? "menu" : (modeOrPrompt as CaptureMode);
    if (!user) {
      setPendingCaptureMode(mode);
      setShowLoginModal(true);
      return;
    }
    if (isPrompt) setCapturePrompt(modeOrPrompt as string);
    else setCapturePrompt("");
    setCaptureMode(mode);
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    if (pendingCaptureMode) {
      setCaptureMode(pendingCaptureMode);
      setPendingCaptureMode(null);
    } else {
      setCaptureMode("menu");
    }
  };

  const onSaved = (memory: CapturedMemory) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setNewMemory(memory);
    setCaptureMode(null);
    setView("life");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  const content = useMemo(() => {
    switch (view) {
      case "life":
        return <LifeHome go={go} openCapture={(prompt) => handleOpenCapture(prompt || "menu")} newMemory={newMemory} onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }} />;
      case "entities":
        return (
          <div className="px-5 sm:px-8 mt-2">
            <EntitiesViewSection
              captures={captures}
              onSelectPerson={(name) => { setSelectedPersonName(name); go("person"); }}
              onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }}
            />
          </div>
        );
      case "collections":
        return <CollectionsSection go={go} onSelectPerson={(name) => { setSelectedPersonName(name); go("person"); }} onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }} />;
      case "reflect":
        return (
          <div className="px-3 sm:px-6 mt-1 flex-1 flex flex-col">
            <ReflectionChatboard captures={captures} />
          </div>
        );
      case "people":
        return <PeopleViewSection go={go} onSelectPerson={(name) => setSelectedPersonName(name)} />;
      case "person":
        return <PersonViewSection go={go} selectedPerson={selectedPersonName} />;
      case "explore":
        return <ExploreViewSection go={go} />;
      case "places":
        return <PlacesViewSection go={go} />;
      case "place":
        return <PlaceViewSection go={go} />;
      case "thoughts":
        return <ThoughtsViewSection go={go} />;
      case "thought":
        return <ThoughtThreadSection go={go} />;
      case "connections":
        return <ConnectionsViewSection go={go} />;
      case "chapters":
        return <ChaptersViewSection go={go} />;
      case "journeys":
        return <JourneysViewSection go={go} />;
      case "story":
        return <StoryViewSection go={go} />;
      case "search":
        return <SearchViewSection go={go} onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }} />;
      case "profile":
        return <ProfileViewSection go={go} />;
      case "memory":
        return <MemoryDetailSection go={go} capture={selectedCapture} />;
      case "empty":
        return <EmptyViewSection go={go} capture={() => handleOpenCapture("menu")} />;
      case "onboarding":
        return <LifeHome go={go} openCapture={(prompt) => handleOpenCapture(prompt || "menu")} newMemory={newMemory} onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }} />;
    }
  }, [view, newMemory, user, selectedCapture, captures, selectedPersonName, handleOpenCapture]);

  const hideNav = ["story", "empty", "connections"].includes(view);

  return (
    <div className="app-shell">
      {isSplash && <SplashScreen />}
      <div className="app-frame">
        <GlobalAppHeader
          activeView={view}
          go={go}
          streak={streak}
          user={user}
          onBack={["person", "place", "search", "thought", "story", "memory"].includes(view) ? () => go("life") : undefined}
        />
        {content}
      </div>
      {!hideNav && (
        <BottomNav
          active={view}
          go={go}
          capture={() => handleOpenCapture("menu")}
          onSelectMode={(mode) => handleOpenCapture(mode)}
        />
      )}
      <CaptureOverlay mode={captureMode} setMode={setCaptureMode} onSaved={onSaved} initialPrompt={capturePrompt} />
      <AuthLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAuthSuccess}
      />
      {saved && <SavedMomentToast />}
    </div>
  );
}
