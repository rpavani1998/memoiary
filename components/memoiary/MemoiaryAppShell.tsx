"use client";

import React, { useEffect, useMemo, useState } from "react";
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
}: {
  go: (view: View) => void;
  openCapture: () => void;
  newMemory: CapturedMemory | null;
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

        {!user && !bannerDismissed && (
          <BrandStoryBanner onClose={() => setBannerDismissed(true)} />
        )}
      </header>

      <main className="life-mosaic mt-8 px-5 sm:px-8">
        {/* New memory from current session */}
        {newMemory && (
          <section className="new-memory-cluster" aria-label="Your newest memory">
            <div className="new-memory-thread" aria-hidden="true">
              <i /><i /><i /><span />
            </div>
            <button className="new-memory-card cursor-pointer" onClick={() => go("memory")}>
              <span className="flex items-center justify-between">
                <span className="memory-kicker">Just captured</span>
                <span className="memory-meta">Now</span>
              </span>
              <p>{newMemory.text}</p>
              <span className="new-memory-context">
                {getSourceIcon(newMemory.kind)}
                {newMemory.location && (
                  <>
                    <MapPin size={13} />
                    {newMemory.location}
                  </>
                )}
              </span>
            </button>
            <p>
              <Sparkles size={13} /> It&apos;s already finding its place in your memory graph.
            </p>
          </section>
        )}

        {/* Real captures from Firestore */}
        {recentCaptures.map((capture) => {
          const dims = capture.dimensions;
          return (
            <button
              key={capture.id}
              className="thought-memory cursor-pointer"
              onClick={() => go("memory")}
            >
              <span className="flex items-center justify-between">
                <span className="memory-kicker">
                  {getSourceIcon(capture.source)}
                  {" "}
                  {capture.source === "voice" ? "Voice memory" : capture.source === "image" ? "Photo" : "Capture"}
                </span>
                <span className="memory-meta">{formatTime(capture.createdAt)}</span>
              </span>
              {dims ? (
                <>
                  <blockquote className="font-serif">&ldquo;{dims.summary}&rdquo;</blockquote>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {dims.mood && (
                      <span className="text-[0.65rem] px-2 py-0.5 bg-stone-100 rounded-full text-stone-600">
                        {dims.mood}
                      </span>
                    )}
                    {dims.emotions?.slice(0, 2).map((e, i) => (
                      <span key={i} className="text-[0.65rem] px-2 py-0.5 bg-amber-50 rounded-full text-amber-700">
                        {e.label}
                      </span>
                    ))}
                    {dims.people?.slice(0, 2).map((p, i) => (
                      <span key={i} className="text-[0.65rem] px-2 py-0.5 bg-blue-50 rounded-full text-blue-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <blockquote className="font-serif">&ldquo;{capture.content.substring(0, 120)}{capture.content.length > 120 ? "..." : ""}&rdquo;</blockquote>
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
  const people = [
    { name: "Sarah", count: 42, note: "Started with a coffee in March 2024", image: imageAssets.rooftopChai },
    { name: "Mom", count: 87, note: "Home, recipes, quiet phone calls", image: imageAssets.cafeNotes },
    { name: "Arjun", count: 28, note: "Goa, old jokes, and long walks", image: imageAssets.doorwayShoes },
  ];
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
        <div className="people-stack">
          {people.map((person, index) => (
            <button key={person.name} onClick={() => go("person")} className="person-row cursor-pointer hover:bg-stone-50/60 px-2 rounded-lg transition-colors">
              <span className="person-portrait">
                <img src={person.image} alt={person.name} loading="lazy" /> <i>{index + 1}</i>
              </span>
              <span className="min-w-0 text-left">
                <strong className="font-serif text-lg font-medium text-stone-900">{person.name}</strong>
                <small>{person.count} memories together</small>
                <em>{person.note}</em>
              </span>
              <ChevronRight size={17} className="text-stone-400" />
            </button>
          ))}
        </div>
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
  return (
    <div className="pb-28">
      <PageHeader title="My Places" eyebrow="A geography of you" onBack={() => go("explore")} />
      <main>
        <div className="memory-map" aria-label="Memory map of Hyderabad">
          <div className="map-roads" />
          <button className="map-marker marker-home cursor-pointer">
            <i />Home<small>31</small>
          </button>
          <button onClick={() => go("place")} className="map-marker marker-cafe cursor-pointer">
            <i />Third Wave<small>17</small>
          </button>
          <button className="map-marker marker-park cursor-pointer">
            <i />KBR Park<small>8</small>
          </button>
          <div className="map-label font-serif text-stone-900">Hyderabad</div>
        </div>
        <section className="px-5 sm:px-8">
          <p className="eyebrow mt-7">Places that hold you</p>
          <button onClick={() => go("place")} className="place-feature cursor-pointer">
            <div>
              <strong className="font-serif text-xl font-medium text-stone-900">Third Wave Coffee</strong>
              <small>17 memories · 2025—2026</small>
              <q>You seem to think differently when you’re here.</q>
            </div>
            <ChevronRight size={18} className="text-stone-400" />
          </button>
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
  return (
    <div className="pb-28">
      <PageHeader title="My Thoughts" eyebrow="Ideas in motion" onBack={() => go("explore")} />
      <main className="px-5 sm:px-8">
        <p className="intro-copy">Not notes. The paths your thoughts have taken.</p>
        <button className="thought-feature cursor-pointer" onClick={() => go("thought")}>
          <span className="memory-kicker">Evolving since April</span>
          <h2 className="font-serif font-medium text-stone-900">Starting my own company</h2>
          <div className="mini-evolution">
            <i /><i /><i /><i /><i />
          </div>
          <p>Question → Exploration → Decision → Action</p>
          <ChevronRight size={18} className="text-stone-400" />
        </button>
        <button className="thought-feature quiet cursor-pointer" onClick={() => go("thought")}>
          <span className="memory-kicker">Returning thought</span>
          <h2 className="font-serif font-medium text-stone-900">What does home mean now?</h2>
          <p>12 fragments across 3 years</p>
          <ChevronRight size={18} className="text-stone-400" />
        </button>
      </main>
    </div>
  );
}

function ThoughtThreadSection({ go }: { go: (view: View) => void }) {
  const points = [
    ["April", "THOUGHT", "Sometimes I wonder whether I should build something myself."],
    ["June", "QUESTION", "Sarah thinks we could actually make this work."],
    ["July", "EXPLORATION", "What would I even build?"],
    ["August", "DECISION", "I’m seriously thinking about leaving."],
    ["September", "ACTION", "I decided I’m going to try."],
    ["December", "REFLECTION", "You did."],
  ];
  return (
    <div className="pb-24">
      <PageHeader title="Starting my own company" eyebrow="An evolving thought" onBack={() => go("thoughts")} />
      <main className="px-5 sm:px-8">
        <div className="evolution-thread">
          {points.map(([month, type, text], i) => (
            <article key={month} className={i === points.length - 1 ? "final" : ""}>
              <span className="thread-node" />
              <small>
                {month} · {type}
              </small>
              {i === 5 && <img src={imageAssets.cafeNotes} alt="First office ideas" />}
              <blockquote className="font-serif text-stone-800">“{text}”</blockquote>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

function ConnectionsViewSection({ go }: { go: (view: View) => void }) {
  const [focus, setFocus] = useState("Sarah");
  const nodes =
    focus === "Sarah"
      ? ["Goa", "Startup", "Third Wave", "Birthday", "Design", "Hyderabad"]
      : ["Sarah", "Monsoon", "Home", "2026", "Airport", "Chai"];
  return (
    <div className="min-h-screen bg-constellation pb-24 text-constellation">
      <PageHeader title="Connections" eyebrow="Your memory constellation" onBack={() => go("explore")} />
      <main className="px-4">
        <p className="constellation-hint">Tap any point. Watch your life rearrange around it.</p>
        <div className="constellation" key={focus}>
          <svg viewBox="0 0 360 420" aria-hidden="true">
            <path d="M180 205 C118 142 83 115 48 80 M180 205 C250 140 287 105 315 74 M180 205 C110 220 74 244 45 278 M180 205 C247 220 290 245 323 283 M180 205 C165 285 149 327 120 359 M180 205 C214 291 235 325 270 356" />
          </svg>
          <button
            className="center-node cursor-pointer"
            onClick={() => setFocus(focus === "Sarah" ? "Goa" : "Sarah")}
          >
            {focus}
            <small>{focus === "Sarah" ? "42 memories" : "11 moments"}</small>
          </button>
          {nodes.map((node, i) => (
            <button
              key={node}
              className={`orbit-node n${i + 1} cursor-pointer`}
              onClick={() => setFocus(node)}
            >
              <i />
              {node}
            </button>
          ))}
        </div>
        <p className="text-center font-serif text-lg italic mt-4">
          “The same idea appears wherever you and Sarah talk over coffee.”
        </p>
        <p className="mt-2 text-center text-xs text-constellation-muted">Possible connection · You can correct this</p>
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

function SearchViewSection({ go }: { go: (view: View) => void }) {
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
                    <button key={c.id || i} onClick={() => go("memory")} className="cursor-pointer">
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

function MemoryDetailSection({ go }: { go: (view: View) => void }) {
  return (
    <div className="pb-24">
      <PageHeader
        title="Sunday chai"
        eyebrow="A memory"
        onBack={() => go("life")}
        action={
          <IconButton label="More options">
            <MoreHorizontal size={18} />
          </IconButton>
        }
      />
      <main>
        <img className="memory-hero" src={imageAssets.rooftopChai} alt="Two friends sharing Sunday chai" />
        <section className="memory-detail px-5 sm:px-8">
          <p className="exact-words font-serif text-stone-900">
            “Maybe we should actually stop talking about it and build it.”
          </p>
          <p className="memory-meta mt-3">You said · September 2 · 6:42 PM</p>
          <div className="context-grid">
            <span>
              <MapPin /> Third Wave Coffee
            </span>
            <span>
              <UserRound /> Sarah
            </span>
            <span>
              <Heart /> Excited · uncertain
            </span>
            <span>
              <PenLine /> Starting the company
            </span>
          </div>
          <div className="noticed">
            <span>
              <Sparkles /> Memoiary noticed
            </span>
            <p className="font-serif">This may be connected to <strong>Starting my own company</strong>.</p>
            <div>
              <button className="cursor-pointer font-medium">Correct</button>
              <button className="cursor-pointer">Not related</button>
            </div>
          </div>
          <h2 className="section-title font-serif font-medium text-stone-900">Connected to</h2>
          <div className="connected-row">
            <button onClick={() => go("memory")} className="cursor-pointer">
              <small>June 14</small>Coffee with Sarah
            </button>
            <button onClick={() => go("thought")} className="cursor-pointer">
              <small>July 3</small>“Maybe we should build this.”
            </button>
            <button onClick={() => go("explore")} className="cursor-pointer">
              <small>August</small>Startup ideas
            </button>
          </div>
          <div className="insight">
            <span>Looking back</span>
            <p className="font-serif text-stone-800">
              You returned to this idea five times before this moment. This was the first time you said <em>build</em>, not{" "}
              <em>maybe</em>.
            </p>
          </div>
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
  const [quickText, setQuickText] = useState("");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(true);
  const [location, setLocation] = useState<string>();
  const [voicePrompt, setVoicePrompt] = useState("What happened that you don't want to lose?");
  const [saving, setSaving] = useState(false);

  if (!mode) return null;

  const toggleLocation = () => setLocation((current) => (current ? undefined : "Banjara Hills, Hyderabad"));
  const memoryWithLocation = (kind: CapturedMemory["kind"], memoryText: string): CapturedMemory =>
    location ? { kind, text: memoryText, location } : { kind, text: memoryText };

  const persistCapture = async (kind: CapturedMemory["kind"], content: string) => {
    setSaving(true);
    try {
      await submitCapture(content, kind === "voice" ? "voice" : kind === "photo" ? "image" : "text");
    } catch {
      // silently continue — local state still shows the memory
    } finally {
      setSaving(false);
    }
  };

  const handleQuickTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quickText.trim()) {
      await persistCapture("written", quickText.trim());
      onSaved(memoryWithLocation("written", quickText.trim()));
      setQuickText("");
    }
  };

  return (
    <div
      className="capture-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Capture a memory"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) setMode(null);
      }}
    >
      <section className={`capture-sheet ${mode}`}>
        <div className="capture-handle" />
        <div className="capture-top">
          <Brand compact />
          <IconButton label="Close capture" onClick={() => setMode(null)}>
            <X size={18} />
          </IconButton>
        </div>

        {mode === "menu" && (
          <div className="space-y-5 pt-2">
            <div className="capture-intro">
              <span className="memory-kicker">A new memory</span>
              <h2 className="font-serif font-medium text-stone-900 text-2xl mt-1">What do you want to keep?</h2>
              <p className="text-stone-500 text-xs mt-1">No organizing. Start wherever the moment is.</p>
            </div>

            {/* Conversation Hero Banner */}
            <button
              className="voice-invitation cursor-pointer hover:scale-[1.01] transition-transform shadow-sm"
              onClick={() => setMode("voice")}
            >
              <span className="voice-spark" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <i key={i} style={{ "--i": i } as React.CSSProperties} />
                ))}
              </span>
              <span>
                <small className="text-amber-700 font-semibold tracking-wider">Memoiary is listening</small>
                <strong className="font-serif text-base text-stone-900 font-medium">Tell me what happened…</strong>
              </span>
              <div className="w-10 h-10 rounded-full bg-amber-100/80 flex items-center justify-center text-amber-700">
                <Mic size={20} />
              </div>
            </button>

            {/* Combined Sleek Modern Text + Voice Input Bar */}
            <form onSubmit={handleQuickTextSubmit} className="relative flex items-center mt-2">
              <input
                type="text"
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="What's on your mind? (type or tap mic)..."
                className="w-full py-3.5 pl-4 pr-24 bg-white border border-stone-200 rounded-2xl text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-500 shadow-2xs font-sans transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setMode("voice")}
                  className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                  title="One-touch voice record"
                >
                  <Mic size={18} />
                </button>
                {quickText.trim() && (
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium cursor-pointer shadow-2xs transition-colors"
                  >
                    Save
                  </button>
                )}
              </div>
            </form>

            {/* 4 Clean Action Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                onClick={() => setMode("write")}
                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-2xl gap-2 transition-all hover:border-amber-400/60 shadow-2xs group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
                  <PenLine size={20} />
                </div>
                <span className="text-sm font-semibold text-stone-800">Write</span>
                <span className="text-xs text-stone-500 font-sans">Draft a thought</span>
              </button>

              <button
                onClick={() => setMode("voice")}
                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-2xl gap-2 transition-all hover:border-amber-400/60 shadow-2xs group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
                  <Mic size={20} />
                </div>
                <span className="text-sm font-semibold text-stone-800">Speak</span>
                <span className="text-xs text-stone-500 font-sans">Record voice</span>
              </button>

              <button
                onClick={() => setMode("photo")}
                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-2xl gap-2 transition-all hover:border-amber-400/60 shadow-2xs group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
                  <Camera size={20} />
                </div>
                <span className="text-sm font-semibold text-stone-800">Photo</span>
                <span className="text-xs text-stone-500 font-sans">Visual keepsake</span>
              </button>

              <button
                onClick={() => setMode("photo")}
                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-2xl gap-2 transition-all hover:border-amber-400/60 shadow-2xs group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
                  <Video size={20} />
                </div>
                <span className="text-sm font-semibold text-stone-800">Video</span>
                <span className="text-xs text-stone-500 font-sans">Live moment</span>
              </button>
            </div>
          </div>
        )}

        {mode === "write" && (
          <>
            <span className="memory-kicker">A thought, exactly as it is</span>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What’s on your mind?"
            />
            <button
              className={`location-capture cursor-pointer ${location ? "active" : ""}`}
              onClick={toggleLocation}
            >
              <MapPin size={15} />
              {location ?? "Capture my location"}
              {location && <span>Added</span>}
            </button>
            <p className="capture-reassurance text-xs text-muted-foreground mt-2">No title. No tags. Just this moment.</p>
            <button
              className="primary-action cursor-pointer mt-4"
              disabled={!text.trim() || saving}
              onClick={async () => {
                await persistCapture("written", text.trim());
                onSaved(memoryWithLocation("written", text.trim()));
              }}
            >
              {saving ? "Saving..." : "Keep this memory"}
            </button>
          </>
        )}

        {mode === "voice" && (
          <div className="voice-capture">
            <span className="recording-dot" />
            <h2 className="font-serif font-medium">{recording ? "Just speak." : "Your voice is here."}</h2>
            <p>{recording ? "I’ll hold the thread while you remember." : "0:18 · Ready to keep"}</p>
            <button
              className="voice-chat cursor-pointer"
              onClick={() => setVoicePrompt("What was her name again — and what made you smile?")}
            >
              <Sparkles size={14} />
              <span>
                <small>Memoiary asks</small>
                {voicePrompt}
              </span>
            </button>
            <div className={`voice-orbit ${recording ? "active" : ""}`}>
              {Array.from({ length: 24 }).map((_, i) => (
                <i key={i} style={{ "--i": i } as React.CSSProperties} />
              ))}
            </div>
            <button
              className="record-button cursor-pointer"
              aria-label={recording ? "Pause recording" : "Continue recording"}
              onClick={() => setRecording(!recording)}
            >
              {recording ? <Pause /> : <Mic />}
            </button>
            <button
              className={`location-capture cursor-pointer ${location ? "active" : ""}`}
              onClick={toggleLocation}
            >
              <MapPin size={15} />
              {location ?? "Capture my location"}
              {location && <span>Added</span>}
            </button>
            {!recording && (
              <button
                className="primary-action cursor-pointer mt-4"
                disabled={saving}
                onClick={async () => {
                  const voiceText = "That tiny laugh before she answered — I want to remember how light everything felt.";
                  await persistCapture("voice", voiceText);
                  onSaved(memoryWithLocation("voice", voiceText));
                }}
              >
                {saving ? "Saving..." : "Keep this memory"}
              </button>
            )}
          </div>
        )}

        {mode === "photo" && (
          <div className="photo-capture">
            <div className="camera-frame">
              <img src={imageAssets.rooftopChai} alt="Photo ready to capture" />
              <span />
              <i />
            </div>
            <p className="font-serif">Keep the moment as it is.</p>
            <button className="location-capture cursor-pointer" onClick={toggleLocation}>
              <MapPin size={15} />
              {location ?? "Capture my location"}
            </button>
            <button
              className="shutter cursor-pointer"
              onClick={() => onSaved(memoryWithLocation("photo", "Sunday chai on the rooftop"))}
            >
              <span />
            </button>
          </div>
        )}
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
        return <LifeHome go={go} openCapture={() => handleOpenCapture("menu")} newMemory={newMemory} />;
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
        return <SearchViewSection go={go} />;
      case "profile":
        return <ProfileViewSection go={go} />;
      case "memory":
        return <MemoryDetailSection go={go} />;
      case "empty":
        return <EmptyViewSection go={go} capture={() => handleOpenCapture("menu")} />;
      case "onboarding":
        return <LifeHome go={go} openCapture={() => handleOpenCapture("menu")} newMemory={newMemory} />;
    }
  }, [view, newMemory, user]);

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
