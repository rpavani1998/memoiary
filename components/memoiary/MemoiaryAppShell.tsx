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
  Loader2,
  CheckCircle2,
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
  MessageSquare,
  MessageSquarePlus,
  Layers,
  Share2,
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
import { WishlistIntentionsBoard } from "@/components/WishlistIntentionsBoard";
import { MemoryTimeCapsuleBanner } from "@/components/MemoryTimeCapsuleBanner";
import { InteractiveProductWalkthrough } from "@/components/InteractiveProductWalkthrough";
import { Brand, IconButton } from "./Brand";
import { GlobalAppHeader, PageHeader } from "./GlobalAppHeader";
import { DailySanctuaryHero } from "./DailySanctuaryHero";

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
      setLocalError(err?.message || "Sign in failed. Please check your Firebase API Key configuration.");
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
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 space-y-5 text-center relative overflow-hidden font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Centered Logo Badge & Title */}
        <div className="flex flex-col items-center justify-center pt-2 gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F0] border border-[#DE5239]/20 flex items-center justify-center p-2 shadow-2xs shrink-0">
            <img
              src="/logo-mark.png"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.endsWith("/logo.png")) {
                  target.src = "/logo.png";
                }
              }}
              alt="Memoiary logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-serif text-2xl font-semibold tracking-tight text-stone-900">
            Memoiary
          </span>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-xl font-medium text-stone-900">Sign in to save your memories</h2>
          <p className="text-xs text-stone-500 font-sans leading-relaxed">
            Keep your thoughts, photos, and voice notes safely connected across all your devices.
          </p>
        </div>

        {(localError || saveError) && (
          <div className="p-3 bg-amber-50 border border-amber-200/80 text-amber-900 rounded-xl text-xs text-left leading-relaxed font-sans space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Authentication Notice</span>
            </div>
            <p className="text-amber-900 text-[11px] leading-relaxed">{localError || saveError}</p>
          </div>
        )}

        <div className="space-y-2.5 pt-1">
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
            {signingIn ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <button
            onClick={handleGuestSignIn}
            disabled={signingIn}
            className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Continue as Guest / Demo Mode
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
  openCapture: (prompt?: string, targetDate?: Date) => void;
  newMemory: CapturedMemory | null;
  onSelectCapture: (c: any) => void;
}) {
  const { user, streak, captures, isDemoMode } = useJournal();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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
  const availableDates = Array.from(
    new Set(
      captures.map((c) => {
        const d = new Date(c.createdAt);
        const yr = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, "0");
        const dy = String(d.getDate()).padStart(2, "0");
        return `${yr}-${mo}-${dy}`;
      })
    )
  );

  const selectedDateStr = selectedDate.toDateString();
  const dayCaptures = captures.filter((c) => {
    const cDate = new Date(c.createdAt).toDateString();
    return cDate === selectedDateStr;
  });
  const recentCaptures = dayCaptures;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className="pb-32 font-sans px-4 sm:px-8 pt-2 space-y-4">
      {/* Daily Sanctuary Hero Section (Sleek Compact Top Bar) ONLY on first diary page (Day mode) */}
      {timelineMode === "day" && (
        <DailySanctuaryHero
          user={user}
          streak={streak}
          openCapture={(prompt, targetDate) => openCapture(prompt, targetDate || selectedDate)}
          go={go}
          capturesCount={dayCaptures.length}
          captures={captures}
          mode={timelineMode}
        />
      )}

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

      {/* Main Feed Content depending on Timeline Mode */}
      <main className="mt-6 px-5 sm:px-8 space-y-4">
        
        {/* WEEKLY MODE VIEW */}
        {timelineMode === "week" && (
          <WeeklyRecapBoard
            weekLabel="This Week"
            uniqueDaysLogged={uniqueDaysLogged}
            isUnlocked={uniqueDaysLogged >= 7}
            captures={captures}
            isDemoMode={isDemoMode}
            onSelectHighlight={() => setTimelineMode("day")}
            onOpenCapture={openCapture}
            onGoReflect={go}
          />
        )}

        {/* MONTHLY MODE VIEW */}
        {timelineMode === "month" && (
          <MonthlyCollageGrid
            monthLabel="September 2026"
            uniqueDaysLogged={uniqueDaysLogged}
            isUnlocked={uniqueDaysLogged >= 30}
            monthlyPeople={Array.from(new Set(captures.flatMap((c) => c.dimensions?.people || [])))}
            monthlySummary={captures.length > 0 ? captures[0]?.dimensions?.summary || captures[0]?.content : ""}
            isDemoMode={isDemoMode}
            onSelectCollage={() => setTimelineMode("day")}
            onOpenCapture={openCapture}
            onGoReflect={go}
          />
        )}

        {/* Memory Time Capsule / Revisiting Past Memories Banner */}
        <MemoryTimeCapsuleBanner captures={captures} onSelectCapture={onSelectCapture} />

        {/* DAY MODE VIEW: Clean single timeline feed of your captures */}
        {timelineMode === "day" && (
          <div className="space-y-4 relative before:absolute before:left-9 sm:before:left-12 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#1C1917]/15">

            {/* Real captures from Firestore or Mock cards */}
            {recentCaptures.length > 0 ? (
              recentCaptures.map((capture) => {
                const dims = capture.dimensions;
                const isAnalyzing = capture.status === "processing";
                const displayTitle = capture.title || dims?.title || (capture.content ? (capture.content.substring(0, 45) + (capture.content.length > 45 ? "..." : "")) : "Memory Entry");

                const aiStatusBadge = isAnalyzing ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#D97706] bg-[#FEF3C7] border border-[#D97706]/40 px-2.5 py-0.5 rounded-full shadow-xs">
                    <Loader2 size={11} className="animate-spin text-[#D97706]" />
                    Analyzing by AI…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-semibold text-emerald-800 bg-emerald-50 border border-emerald-600/30 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 size={11} className="text-emerald-600" />
                    AI Analyzed
                  </span>
                );

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
                        <div className="p-4 sm:p-5 space-y-2 bg-[#1C1917]">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase font-bold text-[#D97706] bg-[#D97706]/20 px-2 py-0.5 rounded-md border border-[#D97706]/40">
                              Recorded Video
                            </span>
                            {aiStatusBadge}
                          </div>
                          <h3 className="font-serif font-bold text-stone-100 text-xl leading-snug">
                            {displayTitle}
                          </h3>
                        </div>
                      </button>
                    ) : capture.source === "image" || (capture.mediaUrl && capture.mediaUrl.startsWith("data:image")) ? (
                      /* Photo Media Card */
                      <button
                        onClick={() => onSelectCapture(capture)}
                        className="w-full text-left border-[1.5px] border-[#1C1917] bg-white rounded-3xl overflow-hidden shadow-[2px_3px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer group"
                      >
                        <div className="h-64 w-full overflow-hidden bg-stone-100 relative">
                          <img
                            src={capture.mediaUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"}
                            alt="Memory photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 z-10">
                            {aiStatusBadge}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5 space-y-1">
                          <h3 className="font-serif font-bold text-[#1C1917] text-xl leading-snug">
                            {displayTitle}
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
                    ) : capture.source === "voice" || capture.mediaUrl?.startsWith("data:audio") ? (
                      <div
                        onClick={() => onSelectCapture(capture)}
                        className="w-full text-left p-4 sm:p-5 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-2xl shadow-[2px_3px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DE5239] bg-[#F5E5DC] px-2.5 py-0.5 rounded-md border border-[#DE5239]/30 flex items-center gap-1.5">
                              <Mic size={12} /> Voice Memory Recording
                            </span>
                            {aiStatusBadge}
                          </div>
                          <span className="text-xs text-[#665F56] font-mono">
                            {new Date(capture.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {/* Memory Title */}
                        <h3 className="font-serif font-bold text-lg text-[#1C1917] leading-snug">
                          {displayTitle}
                        </h3>

                        {/* Raw audio player */}
                        {capture.mediaUrl && (
                          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                            <audio controls src={capture.mediaUrl} className="w-full h-10 rounded-xl border border-[#1C1917]" />
                          </div>
                        )}

                        {/* Transcript script */}
                        <div className="p-3.5 bg-white border border-[#1C1917]/20 rounded-xl">
                          <span className="text-[10px] font-mono uppercase font-bold text-[#665F56] block mb-1">
                            Transcript Script:
                          </span>
                          <p className="font-serif text-sm sm:text-base text-[#1C1917] leading-relaxed">
                            &ldquo;{capture.content}&rdquo;
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectCapture(capture)}
                        className="w-full text-left p-5 border-[1.5px] border-[#1C1917] bg-white rounded-2xl shadow-[2px_3px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#665F56] font-mono">
                            {new Date(capture.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {aiStatusBadge}
                        </div>
                        <h3 className="font-serif font-bold text-lg text-[#1C1917] leading-snug">
                          {displayTitle}
                        </h3>
                        <p className="font-serif text-base text-[#665F56] leading-relaxed italic text-center sm:text-left">
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
            ) : (
              <div className="text-center py-10 px-6 border-[1.5px] border-dashed border-[#1C1917]/30 bg-[#FBF9F4] rounded-3xl space-y-3 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#D97706]/30 text-[#D97706] mx-auto flex items-center justify-center font-serif text-xl font-bold shadow-xs">
                  ✨
                </div>
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  No memories on {formattedSelectedDate}
                </h3>
                <p className="text-xs font-sans text-[#665F56] max-w-sm mx-auto leading-relaxed">
                  You haven&apos;t recorded any moments for this day yet. Capture a voice note, photo, or thought to remember how it felt.
                </p>
                <button
                  onClick={() => openCapture(undefined, selectedDate)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] hover:bg-[#DE5239] text-white text-xs font-bold rounded-2xl shadow-[2px_3px_0px_#1C1917] hover:shadow-[4px_5px_0px_#1C1917] transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add memory for this day
                </button>
              </div>
            )}

            {/* Prompt suggestion tiles ONLY in day mode */}
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
                      onClick={() => openCapture(prompt, selectedDate)}
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
              <button className="w-full text-center py-3.5 border-[1.5px] border-dashed border-[#1C1917]/40 bg-[#FBF9F4] rounded-2xl text-sm font-sans font-medium text-[#665F56] hover:border-[#DE5239] hover:text-[#DE5239] transition-all cursor-pointer" onClick={() => openCapture(undefined, selectedDate)}>
                <Plus size={16} className="inline -mt-0.5 mr-1" /> Capture what this moment feels like
              </button>
            </div>
          </div>
        )}
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

function PlacesViewSection({ go, onSelectPlace }: { go: (view: View) => void; onSelectPlace: (name: string) => void }) {
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
    <div className="pb-28 font-sans">
      <PageHeader title="My Places" eyebrow="A geography of you" onBack={() => go("explore")} />
      <main className="px-5 sm:px-8">
        <p className="intro-copy">Places where your life was lived.</p>
        {places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
            {places.map((place) => (
              <button
                key={place.name}
                onClick={() => { onSelectPlace(place.name); go("place"); }}
                className="group border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl p-4 shadow-[2px_3px_0px_#1C1917] hover:shadow-[4px_6px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 bg-[#F5E5DC] rounded-xl border border-[#DE5239]/30 text-[#DE5239] shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className="font-serif text-lg font-medium text-[#1C1917] truncate">{place.name}</h3>
                    <span className="text-[11px] font-sans text-[#DE5239] font-semibold bg-[#F5E5DC] border border-[#DE5239]/20 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {place.count} memor{place.count === 1 ? "y" : "ies"} logged
                    </span>
                    {place.lastNote && <p className="text-xs font-serif text-[#665F56] line-clamp-1 italic mt-1">{place.lastNote}</p>}
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#DE5239] opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-stone-400 text-sm text-center py-8">No places detected yet. Capture memories with location context.</p>
        )}
      </main>
    </div>
  );
}


function PlaceViewSection({ go, selectedPlace = "Third Wave Coffee, Jubilee Hills" }: { go: (view: View) => void; selectedPlace?: string }) {
  const { captures } = useJournal();
  
  const placeCaptures = captures.filter((c) => {
    const textMatch = c.content.toLowerCase().includes(selectedPlace.toLowerCase());
    const placeTagMatch = c.dimensions?.places?.some(
      (p: string) => p.toLowerCase() === selectedPlace.toLowerCase()
    );
    return textMatch || placeTagMatch;
  });

  return (
    <div className="pb-28 font-sans">
      <PageHeader
        title={selectedPlace}
        eyebrow={`${placeCaptures.length} memories grounded in this location`}
        onBack={() => go("places")}
      />
      <main className="px-5 sm:px-8 space-y-5 mt-2">
        <div className="p-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl shadow-[3px_4px_0px_#1C1917] flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-[#F5E5DC] rounded-full border-[1.5px] border-[#1C1917]">
            <MapPin size={32} className="text-[#DE5239]" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">{selectedPlace}</h2>
            <p className="text-xs font-serif text-[#DE5239] font-semibold bg-[#F5E5DC] border border-[#DE5239]/20 px-3 py-1 rounded-full w-fit mx-auto mt-1">
              {placeCaptures.length} memor{placeCaptures.length === 1 ? "y" : "ies"} logged here
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-2">
            <h3 className="font-serif text-lg font-medium text-[#1C1917]">
              Memories at {selectedPlace} ({placeCaptures.length})
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#DE5239] bg-[#F5E5DC] px-2.5 py-0.5 rounded-full uppercase border border-[#DE5239]/20">
              Grounded Location Memories
            </span>
          </div>

          {placeCaptures.length > 0 ? (
            placeCaptures.map((c) => {
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
                  <h4 className="font-serif text-base font-bold text-[#1C1917]">{c.title || c.dimensions?.title || "Memory Entry"}</h4>
                  <p className="font-serif text-sm text-[#1C1917] leading-relaxed">
                    {c.content}
                  </p>
                  {c.dimensions?.people && c.dimensions.people.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-xs text-[#665F56] font-sans font-medium">With:</span>
                      <div className="flex items-center gap-1">
                        {c.dimensions.people.map((p: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1 bg-[#F5F1E8] border border-[#1C1917]/20 rounded-full px-2 py-0.5 text-xs text-[#1C1917] font-semibold">
                            <ArtisticAvatar name={p} size="sm" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-stone-500 text-sm py-6 text-center italic">
              No entries found specifically tagged at {selectedPlace}.
            </p>
          )}
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

function SearchViewSection({
  go,
  onSelectCapture,
  initialQuery = "",
  onQueryChange,
}: {
  go: (view: View) => void;
  onSelectCapture: (c: any) => void;
  initialQuery?: string;
  onQueryChange?: (q: string) => void;
}) {
  const { user, captures, isDemoMode } = useJournal();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const suggestions = [
    "That cafe you went to with Sarah...",
    "When did I first think about starting something?",
    "People I've been thinking about",
    "Moments that made me smile",
  ];

  const handleSearch = async (searchTerm = query) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setSearching(true);
    setSearchMessage("");

    try {
      // 1. Attempt Server-Side AI Search if user is authenticated and not in demo mode
      if (user && !isDemoMode) {
        const idToken = typeof user.getIdToken === "function" ? await user.getIdToken() : "";
        if (idToken) {
          const res = await fetch("/api/v1/search", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
            body: JSON.stringify({ query: trimmed })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              setResults(data.results);
              if (data.message) setSearchMessage(data.message);
              setSearching(false);
              return;
            }
          }
        }
      }

      // 2. Smart Client-Side & Demo Mode Hybrid Search across active captures
      const lowerQ = trimmed.toLowerCase();
      const keywords = lowerQ
        .split(/\s+/)
        .map((w) => w.replace(/[^a-z0-9]/gi, ""))
        .filter((w) => w.length > 2 && !["the", "and", "was", "for", "with", "went", "this", "that", "about", "have", "you"].includes(w));

      const scored = captures.map((c: any) => {
        let score = 0;
        const reasons: string[] = [];
        const contentLower = (c.content || "").toLowerCase();
        const titleLower = (c.title || c.dimensions?.title || "").toLowerCase();
        const summaryLower = (c.dimensions?.summary || "").toLowerCase();
        const peopleList = (c.dimensions?.people || []).map((p: string) => p.toLowerCase());
        const placesList = (c.dimensions?.places || []).map((pl: string) => pl.toLowerCase());
        const topicsList = (c.dimensions?.topics || []).map((t: string) => t.toLowerCase());

        // Full phrase or query match
        if (contentLower.includes(lowerQ) || titleLower.includes(lowerQ) || summaryLower.includes(lowerQ)) {
          score += 0.8;
          reasons.push("Direct phrase match");
        }

        // Keywords matching people, places, topics & content
        keywords.forEach((kw) => {
          if (peopleList.some((p: string) => p.includes(kw))) {
            score += 0.4;
            reasons.push(`Tag: ${kw}`);
          }
          if (placesList.some((pl: string) => pl.includes(kw))) {
            score += 0.4;
            reasons.push(`Location: ${kw}`);
          }
          if (topicsList.some((t: string) => t.includes(kw))) {
            score += 0.3;
            reasons.push(`Topic: ${kw}`);
          }
          if (titleLower.includes(kw) || summaryLower.includes(kw)) {
            score += 0.3;
            reasons.push(`Title/summary match`);
          } else if (contentLower.includes(kw)) {
            score += 0.2;
            reasons.push(`Mentioned: ${kw}`);
          }
        });

        // Synonym handling for "cafe" / "coffee"
        if (lowerQ.includes("cafe") || lowerQ.includes("coffee")) {
          if (
            contentLower.includes("coffee") ||
            contentLower.includes("cafe") ||
            placesList.some((p: string) => p.includes("coffee") || p.includes("roastery") || p.includes("tattva") || p.includes("third wave"))
          ) {
            score += 0.25;
          }
        }

        return {
          capture: c,
          relevance: Math.min(1, score),
          reason: Array.from(new Set(reasons)).join(" · ") || "Matched search term"
        };
      });

      const matched = scored
        .filter((s: any) => s.relevance > 0.2)
        .sort((a: any, b: any) => b.relevance - a.relevance);

      setResults(matched);
      if (matched.length === 0) {
        setSearchMessage(`No memories found matching "${trimmed}"`);
      }
    } catch {
      setSearchMessage("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (initialQuery.trim()) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

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
            onChange={(e) => {
              setQuery(e.target.value);
              if (onQueryChange) onQueryChange(e.target.value);
            }}
            placeholder="That cafe you went to with Sarah..."
          />
          {query && (
            <IconButton label="Clear" onClick={() => { setQuery(""); if (onQueryChange) onQueryChange(""); setResults([]); setSearchMessage(""); }}>
              <X size={15} />
            </IconButton>
          )}
        </form>
        {!query && results.length === 0 ? (
          <div className="space-y-4 mt-6">
            <p className="eyebrow text-xs font-sans font-bold text-[#665F56] uppercase tracking-wider">Try searching for</p>
            <div className="search-suggestions space-y-2 font-sans">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuery(q);
                    if (onQueryChange) onQueryChange(q);
                    handleSearch(q);
                  }}
                  className="w-full p-3.5 bg-white border border-[#1C1917]/15 rounded-2xl text-left text-xs font-medium text-[#1C1917] hover:bg-[#F5E5DC] hover:border-[#DE5239]/40 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span>{q}</span>
                  <ChevronRight size={15} className="text-[#665F56] group-hover:text-[#DE5239] transition-colors" />
                </button>
              ))}
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
  const { updateCapture, reanalyzeCapture, deleteCapture } = useJournal();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(capture?.title || capture?.dimensions?.title || "");
  const [editedContent, setEditedContent] = useState(capture?.content || "");
  const [copiedText, setCopiedText] = useState(false);

  const [showAiFeedbackPanel, setShowAiFeedbackPanel] = useState(false);
  const [aiFeedbackText, setAiFeedbackText] = useState("");
  const [editedMood, setEditedMood] = useState(capture?.dimensions?.mood || "");
  const [editedPeople, setEditedPeople] = useState<string[]>(capture?.dimensions?.people || []);
  const [editedTopics, setEditedTopics] = useState<string[]>(capture?.dimensions?.topics || []);
  const [editedSummary, setEditedSummary] = useState(capture?.dimensions?.summary || "");
  const [newPersonInput, setNewPersonInput] = useState("");
  const [newTopicInput, setNewTopicInput] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  useEffect(() => {
    setEditedTitle(capture?.title || capture?.dimensions?.title || "");
    setEditedContent(capture?.content || "");
    setEditedMood(capture?.dimensions?.mood || "");
    setEditedPeople(capture?.dimensions?.people || []);
    setEditedTopics(capture?.dimensions?.topics || []);
    setEditedSummary(capture?.dimensions?.summary || "");
  }, [capture?.title, capture?.content, capture?.dimensions]);

  if (!capture) {
    return (
      <div className="pb-32 font-sans px-5 sm:px-8 mt-6">
        <PageHeader title="Memory Not Found" eyebrow="Memoiary Entry" onBack={() => go("life")} />
        <div className="mt-8 text-center p-8 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[3px_4px_0px_#1C1917] space-y-4">
          <p className="text-stone-500 font-serif text-lg">This memory entry is no longer available or was deleted.</p>
          <button
            onClick={() => go("life")}
            className="px-5 py-2.5 bg-[#DE5239] border-[1.5px] border-[#1C1917] text-white font-bold text-xs rounded-xl shadow-[2px_3px_0px_#1C1917]"
          >
            Return to Sanctuary Feed
          </button>
        </div>
      </div>
    );
  }

  const dims = capture?.dimensions;
  const isAiProcessing = capture?.status === "processing";
  const date = capture?.createdAt ? new Date(capture.createdAt) : new Date();
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  
  const displayTitle = capture?.title || dims?.title || dims?.summary || (capture?.content ? capture.content.substring(0, 45) + (capture.content.length > 45 ? "..." : "") : "Memory Moment");

  const handleSaveEdit = async () => {
    if (!editedContent.trim() && !editedTitle.trim()) return;
    await updateCapture(capture.id, { content: editedContent.trim(), title: editedTitle.trim() });
    setIsEditing(false);
  };

  const handleCopyText = () => {
    if (capture?.content) {
      navigator.clipboard.writeText(capture.content);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleSaveDimensions = async () => {
    await updateCapture(capture.id, {
      dimensions: {
        mood: editedMood.trim(),
        people: editedPeople,
        topics: editedTopics,
        summary: editedSummary.trim()
      }
    });
    setSaveSuccessMsg("✓ AI dimensions & entities updated!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleSendAiFeedback = async () => {
    if (!aiFeedbackText.trim()) return;
    setIsSubmittingFeedback(true);
    try {
      await reanalyzeCapture(capture.id, aiFeedbackText.trim());
      setAiFeedbackText("");
      setSaveSuccessMsg("✨ AI re-analyzed with your feedback!");
      setTimeout(() => setSaveSuccessMsg(""), 3000);
    } catch (err) {
      console.error("AI feedback error:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleAddPerson = () => {
    if (!newPersonInput.trim()) return;
    const name = newPersonInput.trim();
    if (!editedPeople.includes(name)) {
      setEditedPeople([...editedPeople, name]);
    }
    setNewPersonInput("");
  };

  const handleRemovePerson = (name: string) => {
    setEditedPeople(editedPeople.filter((p) => p !== name));
  };

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    const topic = newTopicInput.trim();
    if (!editedTopics.includes(topic)) {
      setEditedTopics([...editedTopics, topic]);
    }
    setNewTopicInput("");
  };

  const handleRemoveTopic = (topic: string) => {
    setEditedTopics(editedTopics.filter((t) => t !== topic));
  };

  const sourceTypeLabel = 
    capture?.source === "video" ? "Recorded Video" :
    capture?.source === "voice" ? "Voice Recording" :
    capture?.source === "image" ? "Photo Memory" : "Written Memory";

  return (
    <div className="pb-32 font-sans">
      <PageHeader
        title={displayTitle}
        eyebrow={`${sourceTypeLabel} · ${dateStr}`}
        onBack={() => go("life")}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-xl text-xs font-bold text-[#1C1917] shadow-[1px_2px_0px_#1C1917] hover:bg-[#F5E5DC] cursor-pointer transition-all"
            >
              <PenLine size={14} className="text-[#DE5239]" />
              <span>{isEditing ? "Cancel Edit" : "Edit"}</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border-[1.5px] border-rose-300 rounded-xl text-xs font-bold text-rose-700 shadow-[1px_2px_0px_#b91c1c] hover:bg-rose-100 cursor-pointer transition-all"
              title="Delete Memory"
            >
              <Trash2 size={14} className="text-rose-600" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        }
      />

      <main className="px-5 sm:px-8 mt-4 space-y-6">
        <div className={`p-3.5 border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex items-center justify-between gap-3 text-xs font-sans font-bold ${
          isAiProcessing ? "bg-[#FDF2D0] text-[#D97706]" : "bg-[#FAF7F0] text-[#1C1917]"
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className={isAiProcessing ? "animate-spin text-[#D97706]" : "text-[#DE5239]"} />
            <span>
              {isAiProcessing
                ? "⏳ AI Processing in Progress... Extracting mood, emotions & topics"
                : "✨ AI Analysis Complete & Grounded in your context"}
            </span>
          </div>
          <button
            onClick={() => reanalyzeCapture(capture.id)}
            disabled={isAiProcessing}
            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#1C1917] rounded-lg text-[10px] uppercase font-mono font-bold text-[#DE5239] hover:bg-[#F5E5DC] shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={11} className={isAiProcessing ? "animate-spin" : ""} />
            <span>{isAiProcessing ? "Analyzing" : "Re-Analyze"}</span>
          </button>
        </div>

        {isEditing ? (
          <div className="p-6 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[4px_5px_0px_#1C1917] space-y-5 font-sans animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-3">
              <div className="flex items-center gap-2">
                <PenLine size={20} className="text-[#DE5239]" />
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">Edit Memory Entry</h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#F5E5DC] text-[#DE5239] border border-[#DE5239]/30 px-2 py-0.5 rounded-md font-bold">
                {sourceTypeLabel}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1917] font-sans flex items-center justify-between">
                <span>Memory Title</span>
                <span className="text-[10px] text-[#665F56] font-normal">Optional (AI generates one if left blank)</span>
              </label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-4 py-3 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-xl text-[#1C1917] font-serif text-lg focus:outline-none shadow-[1px_2px_0px_#1C1917]"
                placeholder="Title / Key Moment of this memory…"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1917] font-sans flex items-center justify-between">
                <span>Captured Content / Transcript</span>
                <span className="text-[10px] text-[#665F56] font-mono">{editedContent.length} chars</span>
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[12rem] p-4 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl text-[#1C1917] font-serif text-base focus:outline-none resize-y leading-relaxed shadow-[2px_3px_0px_#1C1917]"
                placeholder="What happened or what was spoken…"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                <Trash2 size={14} /> Delete Entry
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-stone-100 border border-[#1C1917]/20 rounded-xl text-xs font-bold text-[#665F56] hover:bg-stone-200 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2.5 bg-[#DE5239] border-[1.5px] border-[#1C1917] rounded-xl text-xs font-bold text-white shadow-[2px_3px_0px_#1C1917] hover:bg-[#c9452d] cursor-pointer transition-all"
                >
                  Save &amp; Re-Analyze AI
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[3px_4px_0px_#1C1917] space-y-4 font-sans relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    {capture?.source === "video" ? <Video size={13} /> : capture?.source === "voice" ? <Mic size={13} /> : capture?.source === "image" ? <Camera size={13} /> : <PenLine size={13} />}
                    {sourceTypeLabel}
                  </span>
                </div>
                <span className="text-xs text-[#665F56] font-mono font-medium">
                  {dateStr} at {timeStr}
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] leading-tight">
                  {displayTitle}
                </h2>
              </div>

              {(capture?.source === "video" || capture?.mediaUrl?.startsWith("data:video") || capture?.mediaUrl?.includes(".mp4")) && (
                <div className="mt-4 rounded-2xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] bg-black">
                  <video controls src={capture.mediaUrl} className="w-full max-h-80 object-contain" />
                </div>
              )}

              {(capture?.source === "voice" || capture?.mediaUrl?.startsWith("data:audio")) && (
                <div className="mt-4 p-4 bg-[#F5E5DC] border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                      <Mic size={14} className="text-[#DE5239]" /> Original Audio Recording
                    </span>
                    <span className="text-[10px] font-mono text-[#665F56]">Original Clip</span>
                  </div>
                  {capture.mediaUrl ? (
                    <audio controls src={capture.mediaUrl} className="w-full h-10 rounded-xl border border-[#1C1917] bg-white" />
                  ) : (
                    <p className="text-xs text-[#665F56] italic">Audio clip saved with transcript.</p>
                  )}
                </div>
              )}

              {(capture?.source === "image" || (capture?.mediaUrl && capture?.mediaUrl?.startsWith("data:image"))) && (
                <div className="mt-4 rounded-2xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917]">
                  <img src={capture.mediaUrl} alt="Raw memory photo" className="w-full max-h-80 object-cover" />
                </div>
              )}
            </div>

            <div className="p-6 bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-3xl shadow-[3px_4px_0px_#1C1917] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#FEF3C7] border border-[#D97706]/40 rounded-lg">
                    <Sparkles size={16} className="text-[#D97706]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1917]">AI Witness Reflection &amp; Understanding</h3>
                </div>
                <button
                  onClick={() => setShowAiFeedbackPanel(!showAiFeedbackPanel)}
                  className="flex items-center gap-1 px-3 py-1 bg-[#F5E5DC] border border-[#DE5239]/40 rounded-full text-xs font-bold text-[#DE5239] hover:bg-[#F0D5C7] cursor-pointer transition-all shadow-2xs"
                >
                  <Sparkles size={13} />
                  <span>{showAiFeedbackPanel ? "Close Feedback" : "Edit AI Analysis & Feedback"}</span>
                </button>
              </div>

              {isAiProcessing ? (
                <div className="p-6 text-center space-y-2">
                  <Sparkles size={24} className="text-[#D97706] animate-spin mx-auto" />
                  <p className="text-sm font-serif text-[#1C1917]">Gemini is analyzing mood &amp; context…</p>
                </div>
              ) : (
                <div className="space-y-4 font-sans">
                  <p className="font-serif text-lg text-[#1C1917] leading-relaxed italic bg-white p-4 rounded-2xl border border-[#1C1917]/15">
                    &ldquo;{dims?.summary || dims?.rawAnalysis || "AI captured and reconciled memory moment."}&rdquo;
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#665F56] block">
                      Extracted Dimensions &amp; Entities:
                    </span>

                    <div className="flex flex-wrap gap-2 text-xs font-sans">
                      {dims?.mood && (
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-[#F5E5DC] border border-[#DE5239]/40 rounded-full font-bold text-[#DE5239]">
                          <Heart size={13} /> Mood: {dims.mood}
                        </span>
                      )}
                      {dims?.emotions?.map((e: any, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-full font-medium text-amber-800">
                          ✨ {typeof e === "string" ? e : e.label}
                        </span>
                      ))}
                      {dims?.people?.map((person: string, i: number) => (
                        <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#1C1917]/30 rounded-full font-semibold text-[#1C1917] shadow-xs">
                          <ArtisticAvatar name={person} size="sm" />
                          <span>{person}</span>
                        </span>
                      ))}
                      {dims?.places?.map((place: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#1C1917]/30 rounded-full font-medium text-[#1C1917] shadow-xs">
                          <MapPin size={13} className="text-[#DE5239]" /> {place}
                        </span>
                      ))}
                      {dims?.topics?.map((topic: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F1E8] border border-[#1C1917]/20 rounded-full font-medium text-[#1C1917]">
                          # {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl text-center animate-in fade-in">
                      {saveSuccessMsg}
                    </div>
                  )}

                  {/* AI FEEDBACK & EDITING PANEL */}
                  {showAiFeedbackPanel && (
                    <div className="mt-4 p-5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-5 font-sans animate-in fade-in duration-200">
                      <div className="border-b border-[#1C1917]/15 pb-2">
                        <h4 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
                          <Sparkles size={16} className="text-[#DE5239]" />
                          Give Feedback to AI &amp; Edit Entities
                        </h4>
                        <p className="text-xs text-[#665F56]">Correct Gemini&apos;s mood, add missed people, adjust topics, or provide natural language feedback to teach the model.</p>
                      </div>

                      {/* 1. Natural Language AI Feedback */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#1C1917] block">
                          💬 Feedback or Correction for Gemini
                        </label>
                        <textarea
                          value={aiFeedbackText}
                          onChange={(e) => setAiFeedbackText(e.target.value)}
                          placeholder="e.g., 'Tag Mansa as my creative partner', 'Adjust mood to Grounded Clarity', 'Remove Hearing from people'..."
                          className="w-full p-3 text-xs font-sans border border-[#1C1917]/30 bg-[#FBF9F4] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#DE5239]"
                          rows={2}
                        />
                        <button
                          onClick={handleSendAiFeedback}
                          disabled={isSubmittingFeedback || !aiFeedbackText.trim()}
                          className="px-4 py-2 bg-[#DE5239] text-white text-xs font-bold rounded-xl border border-[#1C1917] shadow-2xs hover:bg-[#c9452d] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <Sparkles size={13} className={isSubmittingFeedback ? "animate-spin" : ""} />
                          <span>{isSubmittingFeedback ? "Updating AI..." : "Re-Analyze with Feedback"}</span>
                        </button>
                      </div>

                      <hr className="border-[#1C1917]/10" />

                      {/* 2. Direct Field Editors */}
                      <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[#665F56]">Direct Entity &amp; Dimension Editing</h5>

                        {/* Summary */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[#1C1917]">AI Summary</label>
                          <textarea
                            value={editedSummary}
                            onChange={(e) => setEditedSummary(e.target.value)}
                            className="w-full p-2.5 text-xs font-serif border border-[#1C1917]/30 bg-[#FBF9F4] rounded-xl text-[#1C1917] focus:outline-none"
                            rows={2}
                          />
                        </div>

                        {/* Mood */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-[#1C1917]">Mood</label>
                          <input
                            type="text"
                            value={editedMood}
                            onChange={(e) => setEditedMood(e.target.value)}
                            placeholder="e.g., Grounded & Relieved"
                            className="w-full px-3 py-2 text-xs border border-[#1C1917]/30 bg-[#FBF9F4] rounded-xl text-[#1C1917] focus:outline-none"
                          />
                        </div>

                        {/* People Entities */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-[#1C1917]">People Entities</label>
                          <div className="flex flex-wrap gap-1.5">
                            {editedPeople.map((p) => (
                              <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-semibold text-amber-900">
                                {p}
                                <button onClick={() => handleRemovePerson(p)} className="hover:text-rose-600 cursor-pointer font-bold ml-1">×</button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newPersonInput}
                              onChange={(e) => setNewPersonInput(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddPerson(); } }}
                              placeholder="Add person name (e.g. Mansa, Kirti)…"
                              className="flex-1 px-3 py-1.5 text-xs border border-[#1C1917]/30 bg-[#FBF9F4] rounded-xl text-[#1C1917] focus:outline-none"
                            />
                            <button onClick={handleAddPerson} className="px-3 py-1.5 bg-[#1C1917] text-white text-xs font-bold rounded-xl cursor-pointer">+ Add</button>
                          </div>
                        </div>

                        {/* Topics */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-[#1C1917]">Topics &amp; Tags</label>
                          <div className="flex flex-wrap gap-1.5">
                            {editedTopics.map((t) => (
                              <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-300 rounded-full text-xs font-semibold text-stone-800">
                                #{t}
                                <button onClick={() => handleRemoveTopic(t)} className="hover:text-rose-600 cursor-pointer font-bold ml-1">×</button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTopicInput}
                              onChange={(e) => setNewTopicInput(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTopic(); } }}
                              placeholder="Add topic (e.g. Studio Work, Project Planning)…"
                              className="flex-1 px-3 py-1.5 text-xs border border-[#1C1917]/30 bg-[#FBF9F4] rounded-xl text-[#1C1917] focus:outline-none"
                            />
                            <button onClick={handleAddTopic} className="px-3 py-1.5 bg-[#1C1917] text-white text-xs font-bold rounded-xl cursor-pointer">+ Add</button>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={handleSaveDimensions}
                            className="px-5 py-2 bg-[#1C1917] text-white text-xs font-bold rounded-xl shadow-2xs hover:bg-stone-800 cursor-pointer"
                          >
                            Save Manual Dimension Edits
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RAW CAPTURED CONTENT & TRANSCRIPT */}
            <div className="p-6 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[3px_4px_0px_#1C1917] space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#665F56] block">
                  Exact Raw Text / Spoken Transcript
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="text-xs font-bold text-[#665F56] hover:text-[#1C1917] cursor-pointer transition-colors"
                  >
                    {copiedText ? "✓ Copied!" : "Copy Text"}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-[#DE5239] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <p className="font-serif text-lg text-[#1C1917] leading-relaxed italic">
                &ldquo;{capture?.content || "No raw text recorded."}&rdquo;
              </p>
            </div>

            {/* BOTTOM QUICK ACTIONS TOOLBAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border-[1.5px] border-rose-300 rounded-2xl text-xs font-bold text-rose-700 shadow-[2px_3px_0px_#b91c1c] hover:bg-rose-100 cursor-pointer transition-all"
              >
                <Trash2 size={15} /> Delete Memory
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#DE5239] border-[1.5px] border-[#1C1917] rounded-2xl text-xs font-bold text-white shadow-[2px_3px_0px_#1C1917] hover:bg-[#c9452d] cursor-pointer transition-all"
                >
                  <PenLine size={15} /> Edit Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CONFIRMATION MODAL FOR DELETING MEMORY */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] border-[2px] border-[#1C1917] rounded-3xl p-6 max-w-md w-full shadow-[4px_6px_0px_#1C1917] space-y-4 animate-in fade-in zoom-in duration-150 font-sans">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-100 border border-rose-300 rounded-2xl text-rose-600 shrink-0">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">Delete Memory?</h3>
                <p className="text-xs text-[#665F56] leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-[#1C1917]">&ldquo;{displayTitle}&rdquo;</span>? This will permanently remove it from your timeline.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C1917]/10">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 bg-white border border-[#1C1917]/20 rounded-xl text-xs font-bold text-[#665F56] hover:bg-stone-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteCapture(capture.id);
                  setShowDeleteModal(false);
                  go("life");
                }}
                className="px-5 py-2.5 bg-rose-600 border-[1.5px] border-[#1C1917] rounded-xl text-xs font-bold text-white shadow-[2px_3px_0px_#1C1917] hover:bg-rose-700 cursor-pointer transition-all"
              >
                Yes, Delete Memory
              </button>
            </div>
          </div>
        </div>
      )}
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

function ProfileViewSection({ go, onOpenLogin }: { go: (view: View) => void; onOpenLogin?: () => void }) {
  const { user, isDemoMode, logOut, streak, captures, clearAllData } = useJournal();
  const { artStyle, currentStyle } = useArtStyle();

  return (
    <div data-tour="profile-section" className="pb-24">
      <PageHeader title="Profile & Account" eyebrow="Your memory, in your hands" />
      <main className="px-5 sm:px-8 space-y-4">
        {isDemoMode ? (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full">
                Demo Mode Active
              </span>
              <span className="text-xs text-amber-700 font-medium">Sample Dataset</span>
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900">
              You are exploring sample memories
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              The memories currently shown (Maya&apos;s rooftop chai, Kabir&apos;s design ideas, Ananya&apos;s art) are pre-populated sample entries demonstrating Memoiary&apos;s memory graph.
            </p>
            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="w-full py-3 px-4 bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <UserRound size={16} />
                Sign In with Google to Start Your Personal Sanctuary
              </button>
            )}
          </div>
        ) : (
          <div className="profile-mark bg-white border border-stone-200 p-4 rounded-2xl shadow-2xs">
            <img src={user?.photoURL || imageAssets.logo} alt="Memoiary avatar" className="w-12 h-12 rounded-full border border-stone-300 object-cover" />
            <div>
              <strong className="font-serif text-xl font-medium text-stone-900">
                {user?.displayName || "Journaler"}
              </strong>
              <p className="text-xs text-stone-500 font-mono">{user?.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Account Connected & Synced ({captures.length} memories)
              </span>
            </div>
          </div>
        )}

        {/* Streak Card */}
        {streak.currentStreak > 0 && !isDemoMode && (
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl font-sans">
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

        <div className="border-[1.5px] border-[#1C1917] bg-[#F4F9F5] rounded-2xl p-5 shadow-[3px_4px_0px_#1C1917] space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-700 shrink-0" />
              <h3 className="font-serif text-lg font-medium text-[#1C1917]">Privacy &amp; Data Isolation</h3>
            </div>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              Encrypted &amp; UID Scoped
            </span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed font-sans">
            Memoiary guarantees complete privacy. All database records, local cache keys, entity graphs, and saved AI chat reflections are strictly scoped to your unique user ID (UID). Sample demo data and authenticated accounts are 100% isolated—your personal memories remain private, encrypted, and yours alone.
          </p>
        </div>

        {/* Artwork Theme Card */}
        <div className="border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-2xl p-5 shadow-[3px_4px_0px_#1C1917] space-y-2 font-sans">
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

        <div className="settings-list font-sans">
          {isDemoMode && onOpenLogin ? (
            <button onClick={onOpenLogin} className="cursor-pointer text-[#DE5239] font-bold border-[#DE5239]/30 bg-[#F5E5DC]/50 hover:bg-[#F5E5DC]">
              <UserRound className="text-[#DE5239]" />
              <span>
                <strong className="text-[#DE5239]">Sign In with Google</strong>
                <small className="text-[#665F56]">Save memories to your personal account</small>
              </span>
              <ChevronRight className="text-[#DE5239]" />
            </button>
          ) : (
            <button onClick={logOut} className="cursor-pointer text-rose-700 hover:bg-rose-50 border-rose-200">
              <LogOut className="text-rose-600" />
              <span>
                <strong className="text-rose-700">Sign Out</strong>
                <small className="text-rose-500">Log out of {user?.email || "your account"}</small>
              </span>
              <ChevronRight className="text-rose-600" />
            </button>
          )}

          <button onClick={async () => { await clearAllData(); alert("All system data cleared!"); }} className="cursor-pointer text-stone-600 hover:bg-stone-100">
            <Trash2 className="text-stone-500" />
            <span>
              <strong>Clear All Local Data</strong>
              <small className="text-stone-400">Reset local memory cache</small>
            </span>
            <ChevronRight />
          </button>
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
  const [customTitleInput, setCustomTitleInput] = useState("");
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

  const resetCaptureState = () => {
    setItems([]);
    setCustomTitleInput("");
    setTextInput("");
    setLocation(undefined);
    setLocationInput("");
    setShowLocationInput(false);
    setIsRecordingVoice(false);
    setVoiceDone(false);
    setLiveTranscript("");
    setVoiceSeconds(0);
  };

  // Set active tab based on mode prop and reset state from previous capture session
  useEffect(() => {
    if (!mode) return;
    resetCaptureState();
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
    try { recognition.start(); recognitionRef.current = recognition; setIsRecordingVoice(true); } catch {}
  };

  const stopVoiceRecording = async () => {
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }
    try {
      const audioResult = await media.stopAudioRecording();
      if (audioResult && audioResult.base64) {
        setItems((prev) => [
          ...prev,
          {
            kind: "voice",
            label: "Voice Recording",
            base64: audioResult.base64,
            mimeType: audioResult.mimeType || "audio/webm",
            text: liveTranscript.trim() || undefined,
          },
        ]);
      }
    } catch {}
    setVoiceDone(true);
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }
    media.stopAudioRecording().catch(() => {});
    setVoiceDone(false);
    setLiveTranscript("");
    setVoiceSeconds(0);
  };

  const resetVoice = () => {
    cancelVoiceRecording();
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
      await submitCapture(content, detectedSource, mediaCtx || undefined, mediaUrl, dateIso, customTitleInput.trim() || undefined);
      onSaved({ kind: "written", text: content, location });
      resetCaptureState(); // Clear all capture inputs immediately after save!
      setMode(null); // Automatically close modal after saving!
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

        {/* Optional Title Input */}
        <div className="px-5 pb-2">
          <input
            type="text"
            value={customTitleInput}
            onChange={(e) => setCustomTitleInput(e.target.value)}
            placeholder="Title or Key Moment (optional - AI auto-generates if empty)"
            className="w-full px-3.5 py-2 border-[1.5px] border-[#1C1917] bg-white rounded-xl text-xs font-serif font-medium text-[#1C1917] focus:outline-none shadow-[1px_2px_0px_#1C1917]"
          />
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
      <button
        data-tour="nav-sanctuary"
        className={`cursor-pointer ${active === "life" ? "active" : ""}`}
        onClick={() => go("life")}
        title="Journal Sanctuary"
        aria-label="Journal Sanctuary"
      >
        <BookOpen size={22} />
      </button>

      <button
        data-tour="nav-elements"
        className={`cursor-pointer ${active === "entities" || active === "people" || active === "places" ? "active" : ""}`}
        onClick={() => go("entities")}
        title="Elements (People, Places & Wishlist)"
        aria-label="Elements"
      >
        <Layers size={22} />
      </button>

      {/* Floating Capture Button Container */}
      <div
        data-tour="nav-capture"
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

      <button
        data-tour="nav-mindmap"
        className={`cursor-pointer ${active === "collections" ? "active" : ""}`}
        onClick={() => go("collections")}
        title="Mind Map & Themes"
        aria-label="Mind Map & Themes"
      >
        <Share2 size={22} />
      </button>

      <button
        data-tour="nav-reflect"
        className={`cursor-pointer ${active === "reflect" ? "active" : ""}`}
        onClick={() => go("reflect")}
        title="AI Reflect"
        aria-label="AI Reflect"
      >
        <MessageSquare size={22} />
      </button>
    </nav>
  );
}

export function MemoiaryAppShell() {
  const { user, isDemoMode, captures, streak = 0 } = useJournal();
  const [view, setView] = useState<View>("life");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSplash, setIsSplash] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>(null);
  const [capturePrompt, setCapturePrompt] = useState<string>("");
  const [pendingCaptureMode, setPendingCaptureMode] = useState<CaptureMode>(null);
  const [selectedCaptureDate, setSelectedCaptureDate] = useState<Date | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [newMemory, setNewMemory] = useState<CapturedMemory | null>(null);
  const [selectedCapture, setSelectedCapture] = useState<any>(null);
  const [selectedPersonName, setSelectedPersonName] = useState<string>("Maya");
  const [selectedPlaceName, setSelectedPlaceName] = useState<string>("Third Wave Coffee, Jubilee Hills");
  const [reflectMessages, setReflectMessages] = useState<any[]>([]);

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

  const go = (v: View) => {
    if (isDemoMode && ["reflect", "explore"].includes(v)) {
      setShowLoginModal(true);
      return;
    }
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCapture = (promptOrMode?: string | CaptureMode, targetDate?: Date) => {
    setSelectedCaptureDate(targetDate);
    const isPrompt = typeof promptOrMode === "string" && !["menu", "write", "voice", "photo", "video"].includes(promptOrMode);
    const mode: CaptureMode = isPrompt ? "write" : ((promptOrMode || "menu") as CaptureMode);

    if (isDemoMode) {
      setPendingCaptureMode(mode);
      if (isPrompt) setCapturePrompt(promptOrMode as string);
      setShowLoginModal(true);
      return;
    }

    if (isPrompt) setCapturePrompt(promptOrMode as string);
    else setCapturePrompt("");
    setCaptureMode(mode);
  };

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    if (pendingCaptureMode) {
      setCaptureMode(pendingCaptureMode);
      setPendingCaptureMode(null);
    }
  };

  const onSaved = (mem: CapturedMemory) => {
    setNewMemory(mem);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const content = useMemo(() => {
    switch (view) {
      case "life":
        return <LifeHome go={go} openCapture={(prompt, targetDate) => handleOpenCapture(prompt || "menu", targetDate)} newMemory={newMemory} onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }} />;
      case "entities":
        return (
          <div className="px-5 sm:px-8 mt-2">
            <EntitiesViewSection
              captures={captures}
              onSelectPerson={(name: string) => { setSelectedPersonName(name); go("person"); }}
              onSelectCapture={(c: any) => { setSelectedCapture(c); go("memory"); }}
              onOpenCapture={handleOpenCapture}
            />
          </div>
        );
      case "collections":
        return <CollectionsSection go={go} onSelectPerson={(name: string) => { setSelectedPersonName(name); go("person"); }} onSelectCapture={(c: any) => { setSelectedCapture(c); go("memory"); }} />;
      case "reflect":
        return (
          <div className="px-3 sm:px-6 h-full flex-1 flex flex-col overflow-hidden pb-1">
            <ReflectionChatboard
              captures={captures}
              messages={reflectMessages}
              onMessagesChange={setReflectMessages}
            />
          </div>
        );
      case "people":
        return <PeopleViewSection go={go} onSelectPerson={(name: string) => setSelectedPersonName(name)} />;
      case "person":
        return <PersonViewSection go={go} selectedPerson={selectedPersonName} />;
      case "explore":
        return <ExploreViewSection go={go} />;
      case "places":
        return <PlacesViewSection go={go} onSelectPlace={(name: string) => setSelectedPlaceName(name)} />;
      case "place":
        return <PlaceViewSection go={go} selectedPlace={selectedPlaceName} />;
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
        return (
          <SearchViewSection
            go={go}
            initialQuery={searchQuery}
            onQueryChange={setSearchQuery}
            onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }}
          />
        );
      case "profile":
        return <ProfileViewSection go={go} onOpenLogin={() => setShowLoginModal(true)} />;
      case "memory":
        return <MemoryDetailSection go={go} capture={selectedCapture} />;
      case "empty":
        return <EmptyViewSection go={go} capture={() => handleOpenCapture("menu")} />;
      case "onboarding":
        return <LifeHome go={go} openCapture={(prompt) => handleOpenCapture(prompt || "menu")} newMemory={newMemory} onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }} />;
    }
  }, [view, newMemory, user, isDemoMode, selectedCapture, captures, selectedPersonName, searchQuery, reflectMessages, handleOpenCapture]);

  const hideNav = ["story", "empty", "connections"].includes(view);

  return (
    <div className="app-shell h-screen flex flex-col overflow-hidden bg-[#FAF7F0]">
      {isSplash && <SplashScreen />}
      <div className="app-frame flex flex-col flex-1 h-full overflow-hidden relative max-w-3xl mx-auto w-full">
        <GlobalAppHeader
          activeView={view}
          go={go}
          streak={streak}
          user={user}
          isDemoMode={isDemoMode}
          onOpenLogin={() => setShowLoginModal(true)}
          onStartTour={() => setIsTourOpen(true)}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onBack={["person", "place", "search", "thought", "story", "memory"].includes(view) ? () => go("life") : undefined}
        />
        <main className={`flex-1 min-h-0 ${view === "reflect" ? "flex flex-col overflow-hidden pb-0" : "overflow-y-auto pb-28 scroll-smooth"}`}>
          {content}
        </main>
      </div>
      {!hideNav && (
        <BottomNav
          active={view}
          go={go}
          capture={() => handleOpenCapture("menu")}
          onSelectMode={(mode) => handleOpenCapture(mode)}
        />
      )}
      <CaptureOverlay mode={captureMode} setMode={setCaptureMode} onSaved={onSaved} initialPrompt={capturePrompt} selectedDate={selectedCaptureDate} />
      <AuthLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAuthSuccess}
      />
      <InteractiveProductWalkthrough
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateView={(targetView) => {
          setView(targetView);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      {saved && <SavedMomentToast />}
    </div>
  );
}
