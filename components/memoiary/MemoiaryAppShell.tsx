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
} from "lucide-react";
import { useJournal } from "@/lib/context/JournalContext";
import { useMediaCapture } from "@/lib/hooks/useMediaCapture";
import { BrandStoryBanner } from "@/components/BrandStoryBanner";
import { ThoughtBubbleIcon } from "@/components/ThoughtBubbleIcon";
import { CaptureSession } from "@/lib/memory-engine/types";

export type View =
  | "life"
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
    <header className="page-header">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        {onBack ? (
          <IconButton label="Go back" onClick={onBack}>
            <ArrowLeft size={19} />
          </IconButton>
        ) : (
          <Brand compact />
        )}
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="truncate font-serif text-xl font-medium text-stone-900">{title}</h1>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </header>
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
  openCapture: () => void;
  newMemory: CapturedMemory | null;
  onSelectCapture: (capture: any) => void;
}) {
  const { user, captures, streak } = useJournal();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const recentCaptures = captures.slice(0, 8);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "voice": return <Mic size={13} />;
      case "image": return <Camera size={13} />;
      case "video": return <Video size={13} />;
      default: return <PenLine size={13} />;
    }
  };

  return (
    <div className="pb-32">
      <header className="px-5 pt-7 sm:px-8 sm:pt-10">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <Brand />
          <IconButton label="Search your life" onClick={() => go("search")}>
            <Search size={18} />
          </IconButton>
        </div>

        <p className="eyebrow mt-6">{currentDate}</p>
        <h1 className="mt-2 font-serif text-[2rem] leading-tight font-medium text-stone-900">Your life lately</h1>
        <p className="mt-3 max-w-[34rem] text-sm leading-relaxed text-muted-foreground font-sans">
          {recentCaptures.length > 0
            ? `${recentCaptures.length} capture${recentCaptures.length !== 1 ? "s" : ""} from the last few days.`
            : "Capture anything you want to remember."}
        </p>

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

      </header>

      <main className="life-mosaic mt-8 px-5 sm:px-8">
        {/* New memory from current session */}
        {newMemory && (
          <section className="new-memory-cluster border-[1.5px] border-[#1C1917] bg-[#F5E5DC] rounded-3xl p-5 shadow-[3px_4px_0px_#1C1917]" aria-label="Your newest memory">
            <div className="new-memory-thread" aria-hidden="true">
              <i /><i /><i /><span />
            </div>
            <button className="new-memory-card cursor-pointer border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl p-4" onClick={() => go("memory")}>
              <span className="flex items-center justify-between">
                <span className="memory-kicker flex items-center gap-1.5 text-[#DE5239]">
                  <span className="node-dot" />
                  Just captured
                </span>
                <span className="memory-meta text-[#665F56]">Now</span>
              </span>
              <p className="font-serif text-[#1C1917] text-lg leading-relaxed mt-2">{newMemory.text}</p>
              <span className="new-memory-context text-xs text-[#665F56] mt-3">
                {getSourceIcon(newMemory.kind)}
                {newMemory.location && (
                  <>
                    <MapPin size={13} className="text-[#DE5239]" />
                    {newMemory.location}
                  </>
                )}
              </span>
            </button>
            <p className="flex items-center gap-1.5 text-xs text-[#665F56] mt-3 font-sans">
              <Sparkles size={14} className="text-[#DE5239]" /> It&apos;s already finding its place in your memory graph.
            </p>
          </section>
        )}

        {/* Real captures from Firestore */}
        {recentCaptures.map((capture) => {
          const dims = capture.dimensions;
          return (
            <button
              key={capture.id}
              className="w-full text-left p-4 sm:p-5 border-[1.5px] border-[#1C1917] bg-[#FBF9F4] rounded-2xl shadow-[2px_3px_0px_rgba(28,25,23,0.08)] hover:shadow-[3px_5px_12px_-2px_rgba(28,25,23,0.15)] hover:-translate-y-0.5 transition-all cursor-pointer"
              onClick={() => onSelectCapture(capture)}
            >
              <span className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#DE5239]">
                  <span className="node-dot" />
                  {getSourceIcon(capture.source)}
                  {" "}
                  {capture.source === "voice" ? "Voice memory" : capture.source === "image" ? "Photo" : "Capture"}
                </span>
                <span className="text-xs text-[#665F56] font-sans">{formatTime(capture.createdAt)}</span>
              </span>
              {(capture.episodes?.[0]?.title || dims?.summary) && (
                <h3 className="font-serif font-medium text-[#1C1917] text-lg leading-snug mb-1">
                  {capture.episodes?.[0]?.title || dims?.summary?.substring(0, 50)}
                </h3>
              )}
              {dims ? (
                <>
                  <blockquote className="font-serif text-[#665F56] text-sm italic border-l-2 border-[#DE5239]/40 pl-2.5 my-2">&ldquo;{dims.summary}&rdquo;</blockquote>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {dims.mood && (
                      <span className="text-[10px] px-2.5 py-0.5 bg-[#F5F1E8] border border-[#1C1917]/20 rounded-full font-sans font-medium text-[#1C1917]">
                        {dims.mood}
                      </span>
                    )}
                    {dims.emotions?.slice(0, 2).map((e, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-0.5 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full font-sans font-medium text-[#DE5239]">
                        {e.label}
                      </span>
                    ))}
                    {dims.people?.slice(0, 2).map((p, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-0.5 bg-[#F5F1E8] border border-[#1C1917]/20 rounded-full font-sans font-medium text-[#1C1917]">
                        {p}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <blockquote className="font-serif text-[#1C1917] text-sm italic">&ldquo;{capture.content.substring(0, 120)}{capture.content.length > 120 ? "..." : ""}&rdquo;</blockquote>
              )}
            </button>
          );
        })}

        {/* Empty state */}
        {recentCaptures.length === 0 && !newMemory && (
          <>
            <button className="capture-inline cursor-pointer hover:bg-stone-100/60 rounded-xl py-3 transition-colors" onClick={openCapture}>
              <Plus size={18} /> Capture your first memory
            </button>
            <p className="text-center text-xs text-stone-400 mt-4 font-sans">
              Text, voice, photo, or video — anything you want to remember.
            </p>
          </>
        )}

        {recentCaptures.length > 0 && (
          <button className="capture-inline cursor-pointer hover:bg-stone-100/60 rounded-xl py-3 transition-colors" onClick={openCapture}>
            <Plus size={18} /> Capture what this moment feels like
          </button>
        )}
      </main>
    </div>
  );
}

function PeopleViewSection({ go }: { go: (view: View) => void }) {
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
    <div className="pb-32">
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
          <div className="people-stack">
            {people.map((person, index) => (
              <button key={person.name} onClick={() => go("person")} className="person-row cursor-pointer hover:bg-stone-50/60 px-2 rounded-lg transition-colors">
                <span className="person-portrait">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-serif text-lg">{person.name[0]}</div>
                  <i>{index + 1}</i>
                </span>
                <span className="min-w-0 text-left">
                  <strong className="font-serif text-lg font-medium text-stone-900">{person.name}</strong>
                  <small>{person.count} memor{person.count === 1 ? "y" : "ies"} together</small>
                  {person.lastNote && <em>{person.lastNote}</em>}
                </span>
                <ChevronRight size={17} className="text-stone-400" />
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


function PersonViewSection({ go }: { go: (view: View) => void }) {
  const moments = [
    "First meeting",
    "Coffee conversations",
    "Trip to Goa",
    "Started talking about a company",
    "Three months apart",
    "Met again",
  ];
  return (
    <div className="pb-24">
      <PageHeader
        title="Sarah"
        eyebrow="42 memories together"
        onBack={() => go("people")}
        action={
          <IconButton label="More">
            <MoreHorizontal size={18} />
          </IconButton>
        }
      />
      <main className="px-5 sm:px-8">
        <div className="person-hero">
          <img src={imageAssets.rooftopChai} alt="Memories with Sarah" />
          <span className="portrait-orbit">
            <i /><i /><i />
          </span>
        </div>
        <p className="mt-5 text-center font-serif text-xl italic text-stone-800">“What if we actually made it?”</p>
        <p className="mt-2 text-center text-xs text-muted-foreground">First memory · March 2024</p>
        <button className="soft-action mx-auto mt-5 cursor-pointer" onClick={() => go("search")}>
          <Search size={15} /> Show me my memories with Sarah
        </button>
        <div className="relationship-thread">
          {moments.map((m, i) => (
            <button key={m} onClick={() => go("memory")} className={`cursor-pointer ${i % 2 ? "offset" : ""}`}>
              <span>
                {i === 2 || i === 5 ? (
                  <img src={i === 2 ? imageAssets.doorwayShoes : imageAssets.cafeNotes} alt="" />
                ) : (
                  <i />
                )}
              </span>
              <div>
                <small>
                  {["March 2024", "April 2024", "July 2024", "August 2025", "January 2026", "April 2026"][i]}
                </small>
                <strong>{m}</strong>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

const exploreItems: { title: string; subtitle: string; icon: React.ReactNode; view: View }[] = [
  { title: "Places", subtitle: "A geography of your life", icon: <MapPin />, view: "places" },
  { title: "Thoughts", subtitle: "See how your ideas evolved", icon: <PenLine />, view: "thoughts" },
  { title: "Journeys", subtitle: "Paths, departures, returns", icon: <Map />, view: "journeys" },
  { title: "Chapters", subtitle: "The seasons that emerged", icon: <BookOpen />, view: "chapters" },
  { title: "Connections", subtitle: "Explore the invisible threads", icon: <Sparkles />, view: "connections" },
  { title: "Stories", subtitle: "Your memories, quietly told", icon: <Play />, view: "story" },
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
        <p className="intro-copy">There are many ways back into a life.</p>
        <div className="explore-list">
          {exploreItems.map((item, i) => (
            <button key={item.title} onClick={() => go(item.view)} className="cursor-pointer hover:bg-stone-50/60 px-2 rounded-lg transition-colors">
              <span className="explore-icon">
                {item.icon}
                <i style={{ animationDelay: `${i * 0.2}s` }} />
              </span>
              <span>
                <strong className="font-serif text-stone-900">{item.title}</strong>
                <small>{item.subtitle}</small>
              </span>
              <ChevronRight size={17} className="text-stone-400" />
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
          <>
            <p className="eyebrow mt-8">Try remembering</p>
            <div className="search-suggestions">
              {suggestions.map((q) => (
                <button key={q} onClick={() => { setQuery(q); }} className="cursor-pointer">
                  {q}
                  <ChevronRight size={15} className="text-stone-400" />
                </button>
              ))}
            </div>
          </>
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
  const dims = capture?.dimensions;
  const date = capture?.createdAt ? new Date(capture.createdAt) : new Date();
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const dateStr = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const sourceLabel = capture?.source === "voice" ? "Voice memory" : capture?.source === "image" ? "Photo" : capture?.source === "video" ? "Video" : "Capture";

  return (
    <div className="pb-24">
      <PageHeader
        title={dims?.summary?.substring(0, 40) || sourceLabel}
        eyebrow="A memory"
        onBack={() => go("life")}
        action={
          <IconButton label="More options">
            <MoreHorizontal size={18} />
          </IconButton>
        }
      />
      <main>
        <section className="memory-detail px-5 sm:px-8">
          <p className="exact-words font-serif text-stone-900">
            &ldquo;{capture?.content || "No content"}&rdquo;
          </p>
          <p className="memory-meta mt-3">You said · {dateStr} · {timeStr}</p>
          <div className="context-grid">
            {dims?.places?.[0] && (
              <span><MapPin /> {dims.places[0]}</span>
            )}
            {dims?.people?.map((p: string, i: number) => (
              <span key={i}><UserRound /> {p}</span>
            ))}
            {dims?.mood && (
              <span><Heart /> {dims.mood}</span>
            )}
            {dims?.topics?.slice(0, 2).map((t: string, i: number) => (
              <span key={i}><PenLine /> {t}</span>
            ))}
          </div>
          {dims?.emotions?.length > 0 && (
            <div className="mt-3">
              <span className="text-xs text-stone-500 font-sans">Emotions</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {dims.emotions.map((e: any, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-amber-50 rounded-full text-amber-700">{e.label}</span>
                ))}
              </div>
            </div>
          )}
          {dims?.tone && (
            <p className="text-sm text-stone-500 mt-3">Tone: {dims.tone}</p>
          )}
          {capture?.mediaCtx && (
            <div className="mt-3 p-3 bg-stone-50 rounded-xl">
              <span className="text-xs text-stone-500 font-sans">AI Analysis</span>
              <p className="text-sm text-stone-700 mt-1">{capture.mediaCtx}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


function ProfileViewSection({ go }: { go: (view: View) => void }) {
  const { user, logOut, streak, captures } = useJournal();

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
        <div className="settings-list">
          <button className="cursor-pointer">
            <LockKeyhole />
            <span>
              <strong>Privacy & security</strong>
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
}: {
  mode: CaptureMode;
  setMode: (m: CaptureMode) => void;
  onSaved: (memory: CapturedMemory) => void;
}) {
  const { submitCapture } = useJournal();
  const media = useMediaCapture();

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
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Camera setup for photo/video modes
  useEffect(() => {
    if (mode === "photo" || mode === "video") {
      setCameraReady(false);
      const el = videoElRef.current;
      if (el) {
        const start = mode === "video" ? () => media.startVideoRecording(el) : () => media.startCamera(el);
        start().then(() => setCameraReady(true)).catch(() => {});
      }
    } else {
      media.stopCamera();
      setCameraReady(false);
    }
    return () => media.stopCamera();
  }, [mode]); // eslint-disable-line

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
  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: just use MediaRecorder without transcription
      media.startAudioRecording().then(() => setIsRecordingVoice(true)).catch(() => {});
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => {
      let final = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(final || interim);
    };
    recognition.onerror = () => {};
    recognition.onend = () => {};
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecordingVoice(true);
    media.startAudioRecording().catch(() => {});
  };

  const stopVoiceRecording = async () => {
    setIsRecordingVoice(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    try {
      const result = await media.stopAudioRecording();
      // Store raw audio — NO processing yet
      setItems((prev) => [...prev, {
        kind: "voice",
        label: liveTranscript ? `"${liveTranscript.substring(0, 60)}"` : "Voice recording",
        base64: result.base64,
        mimeType: result.mimeType,
        text: liveTranscript || undefined
      }]);
      setLiveTranscript("");
    } catch {
      // If MediaRecorder failed, still save the transcript
      if (liveTranscript) {
        setItems((prev) => [...prev, { kind: "voice", label: `"${liveTranscript.substring(0, 60)}"`, text: liveTranscript }]);
        setLiveTranscript("");
      }
    }
  };

  // ── Photo capture ──
  const capturePhoto = () => {
    const result = media.capturePhoto();
    if (!result) return;
    // Store raw image — NO processing yet
    setItems((prev) => [...prev, { kind: "photo", label: "Photo", base64: result.base64, mimeType: result.mimeType }]);
  };

  // ── Video capture ──
  const stopVideoRecording = async () => {
    try {
      const result = await media.stopVideoRecording();
      // Store raw video — NO processing yet
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

  // ── Add text ──
  const addText = () => {
    if (!textInput.trim()) return;
    setItems((prev) => [...prev, { kind: "text", label: textInput.trim().substring(0, 50), text: textInput.trim() }]);
    setTextInput("");
  };

  // ── Save everything ──
  const saveMemory = async () => {
    const textParts = items.filter((i) => i.kind === "text" || i.text).map((i) => i.text || i.label);
    if (!textInput.trim() && textParts.length === 0 && items.length === 0) return;
    if (textInput.trim()) textParts.unshift(textInput.trim());
    setSaving(true);
    try {
      // Send text content + location. Media items stay local for now.
      const content = textParts.join("\n\n");
      const mediaCtx = items.filter((i) => i.kind !== "text").map((i) => `${i.kind}: ${i.label}`).join(" | ");
      await submitCapture(content, "mixed", mediaCtx || undefined);
      onSaved({ kind: "written", text: content, location });
    } catch {} finally { setSaving(false); }
  };

  const hasContent = textInput.trim() || items.length > 0;

  return (
    <div className="capture-backdrop" role="dialog" aria-modal="true" aria-label="Capture a memory"
      onMouseDown={(e) => { if (e.currentTarget === e.target) setMode(null); }}>
      <section className={`capture-sheet ${mode}`}>
        <div className="capture-handle" />
        <div className="capture-top">
          <Brand compact />
          <IconButton label="Close capture" onClick={() => setMode(null)}><X size={18} /></IconButton>
        </div>

        <div className="space-y-3 pt-2">
          <span className="memory-kicker">A new memory</span>
          <h2 className="font-serif font-medium text-stone-900 text-xl">What do you want to remember?</h2>

          {/* ── Text input ── */}
          <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full min-h-[4rem] p-3 border border-stone-200 rounded-2xl text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-500 resize-none font-sans" />
          {textInput.trim() && (
            <button onClick={addText} className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl cursor-pointer hover:bg-amber-100">
              + Add text
            </button>
          )}

          {/* ── Items added so far ── */}
          {items.length > 0 && (
            <div className="space-y-1.5">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl text-xs">
                  <span className="text-stone-500">{item.kind === "text" ? "✍" : item.kind === "voice" ? "🎤" : item.kind === "photo" ? "📷" : "🎬"}</span>
                  <span className="flex-1 truncate text-stone-600">{item.label}</span>
                  <button onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))} className="text-stone-400 hover:text-red-500 cursor-pointer ml-1">✕</button>
                </div>
              ))}
            </div>
          )}

          {/* ── Media buttons ── */}
          <div className="grid grid-cols-2 gap-2">
            {/* Voice */}
            <div className="border border-stone-200 rounded-xl p-3">
              {isRecordingVoice ? (
                <div className="text-center">
                  <span className="recording-dot" />
                  <p className="text-xs text-amber-600 mt-1">Recording... {media.duration}s</p>
                  {liveTranscript && <p className="text-xs text-stone-600 mt-1 italic max-h-16 overflow-y-auto">{liveTranscript}</p>}
                  <button onClick={stopVoiceRecording} className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg text-xs cursor-pointer">Stop</button>
                </div>
              ) : (
                <button onClick={startVoiceRecording} disabled={saving}
                  className="w-full flex flex-col items-center gap-1 text-xs text-stone-600 hover:text-amber-700 cursor-pointer">
                  <Mic size={18} /> Record voice
                </button>
              )}
            </div>

            {/* Photo */}
            {(mode === "photo" || mode === "menu" || !mode) && (
              <div className="border border-stone-200 rounded-xl p-3">
                {mode === "photo" ? (
                  <div className="text-center">
                    <video ref={videoElRef} autoPlay playsInline muted className="w-full max-h-32 rounded-lg object-cover" />
                    <button onClick={capturePhoto} disabled={!cameraReady}
                      className="mt-2 px-3 py-1 bg-amber-600 text-white rounded-lg text-xs cursor-pointer">Take photo</button>
                    <button onClick={() => setMode("menu")} className="mt-1 text-xs text-stone-400 cursor-pointer">Back</button>
                  </div>
                ) : (
                  <button onClick={() => setMode("photo")} className="w-full flex flex-col items-center gap-1 text-xs text-stone-600 hover:text-amber-700 cursor-pointer">
                    <Camera size={18} /> Take photo
                  </button>
                )}
              </div>
            )}

            {/* Video */}
            {(mode === "video" || mode === "menu" || !mode) && (
              <div className="border border-stone-200 rounded-xl p-3">
                {mode === "video" ? (
                  <div className="text-center">
                    <video ref={videoElRef} autoPlay playsInline muted className="w-full max-h-32 rounded-lg object-cover" />
                    {media.isRecording && <p className="text-xs text-amber-600 mt-1">Recording {media.duration}s</p>}
                    <div className="flex gap-2 justify-center mt-2">
                      <button onClick={() => { if (media.isRecording) stopVideoRecording(); else { setCameraReady(false); videoElRef.current && media.startVideoRecording(videoElRef.current).then(() => setCameraReady(true)); } }}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs cursor-pointer">
                        {media.isRecording ? "Stop" : "Start video"}
                      </button>
                      <button onClick={() => setMode("menu")} className="text-xs text-stone-400 cursor-pointer">Back</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setMode("video")} className="w-full flex flex-col items-center gap-1 text-xs text-stone-600 hover:text-amber-700 cursor-pointer">
                    <Video size={18} /> Record video
                  </button>
                )}
              </div>
            )}

            {/* File upload */}
            <label className="border border-dashed border-stone-300 rounded-xl p-3 flex flex-col items-center gap-1 text-xs text-stone-500 cursor-pointer hover:border-amber-400">
              <Plus size={18} /> Upload file
              <input type="file" accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {/* ── Location ── */}
          <div className="flex items-center gap-2">
            <button className={`location-capture cursor-pointer flex-1 ${location ? "active" : ""}`} onClick={toggleLocation}>
              <MapPin size={15} /> {location ?? "Add a place"} {location && <span>Added</span>}
            </button>
            {!location && showLocationInput && (
              <div className="flex gap-1.5 flex-1">
                <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") applyLocationInput(); }}
                  placeholder="Type a place name..." autoFocus
                  className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-amber-500" />
                <button onClick={applyLocationInput} className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-xl cursor-pointer">OK</button>
                <button onClick={detectLocation} className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-xl cursor-pointer" title="Use GPS"><MapPin size={12} /></button>
              </div>
            )}
          </div>

          {/* ── Save ── */}
          {hasContent && (
            <button className="primary-action cursor-pointer w-full" onClick={saveMemory} disabled={saving}>
              {saving ? "Saving..." : `Keep this memory${items.length > 0 ? ` (${items.length + (textInput.trim() ? 1 : 0)} parts)` : ""}`}
            </button>
          )}
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
        className={`cursor-pointer ${active === "people" || active === "person" ? "active" : ""}`}
        onClick={() => go("people")}
      >
        <Users />
        <span>People</span>
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

      <button className={`cursor-pointer ${active === "explore" ? "active" : ""}`} onClick={() => go("explore")}>
        <Compass />
        <span>Explore</span>
      </button>
      <button className={`cursor-pointer ${active === "profile" ? "active" : ""}`} onClick={() => go("profile")}>
        <CircleUserRound />
        <span>You</span>
      </button>
    </nav>
  );
}

export function MemoiaryAppShell() {
  const { user } = useJournal();
  const [view, setView] = useState<View>("life");
  const [isSplash, setIsSplash] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>(null);
  const [pendingCaptureMode, setPendingCaptureMode] = useState<CaptureMode>(null);
  const [saved, setSaved] = useState(false);
  const [newMemory, setNewMemory] = useState<CapturedMemory | null>(null);
  const [selectedCapture, setSelectedCapture] = useState<any>(null);

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

  const handleOpenCapture = (mode: CaptureMode = "menu") => {
    if (!user) {
      setPendingCaptureMode(mode);
      setShowLoginModal(true);
      return;
    }
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
        return <LifeHome go={go} openCapture={() => handleOpenCapture("menu")} newMemory={newMemory} onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }} />;
      case "people":
        return <PeopleViewSection go={go} />;
      case "person":
        return <PersonViewSection go={go} />;
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
        return <LifeHome go={go} openCapture={() => handleOpenCapture("menu")} newMemory={newMemory} onSelectCapture={(c) => { setSelectedCapture(c); go("memory"); }} />;
    }
  }, [view, newMemory, user, selectedCapture]);

  const hideNav = ["story", "empty", "connections"].includes(view);

  return (
    <div className="app-shell">
      {isSplash && <SplashScreen />}
      <div className="app-frame">{content}</div>
      {!hideNav && (
        <BottomNav
          active={view}
          go={go}
          capture={() => handleOpenCapture("menu")}
          onSelectMode={(mode) => handleOpenCapture(mode)}
        />
      )}
      <CaptureOverlay mode={captureMode} setMode={setCaptureMode} onSaved={onSaved} />
      <AuthLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAuthSuccess}
      />
      {saved && <SavedMomentToast />}
    </div>
  );
}
