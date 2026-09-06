"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Sparkles, TrendingUp, Users, Heart, Lock, ChevronLeft, ChevronRight, CheckCircle2, Clock, PenLine } from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";

export interface WeeklyHighlight {
  id: string;
  dayLabel: string;
  title: string;
  summary: string;
  imageUrl?: string;
  people?: string[];
  mood?: string;
}

interface Props {
  weekLabel?: string;
  captures?: any[];
  highlights?: WeeklyHighlight[];
  weeklyPeople?: string[];
  weeklyInsight?: string;
  onSelectHighlight?: (id: string) => void;
  uniqueDaysLogged?: number;
  isUnlocked?: boolean;
  onOpenCapture?: (prompt?: string) => void;
  onGoReflect?: (view: any) => void;
}

const HISTORICAL_WEEK_PRESETS: Record<number, { title: string; rangeLabel: string; insight: string; highlights: WeeklyHighlight[] }> = {
  0: {
    title: "Sept 1 – Sept 7, 2026 (Week 1)",
    rangeLabel: "Sept 1 – Sept 7",
    insight: "Your current week is taking shape. Moments captured between Sept 1st and Sept 7th synthesize dynamically as you log thoughts, photos, and voice notes.",
    highlights: [
      {
        id: "cap_sep_06",
        dayLabel: "Sat, Sep 6",
        title: "Morning Journaling & Studio Planning",
        summary: "Reflective session discussing studio priorities around depth, creative focus, and grounded collaboration.",
        people: ["Kirti", "Mansa"],
        mood: "Grounded & Relieved"
      },
      {
        id: "cap_sep_05",
        dayLabel: "Fri, Sep 5",
        title: "Design Jam & Memory Engine Work",
        summary: "Worked through UI architecture with the team. Great breakthrough on narrative memory synthesis.",
        people: ["Kirti", "Mansa"],
        mood: "Inspired"
      }
    ]
  },
  "-1": {
    title: "Aug 25 – Aug 31, 2026 (Completed)",
    rangeLabel: "Aug 25 – Aug 31",
    insight: "Your week shifted from intense sprint work into peaceful evening walks at KBR Park, coffee dates with Maya, and creative tea breaks with Ananya.",
    highlights: [
      {
        id: "mock_aug_31",
        dayLabel: "Mon, Aug 31",
        title: "Evening Walk & Reflections at KBR Park",
        summary: "Voice memo recorded during a peaceful evening stroll contemplating how memories evolve over time.",
        imageUrl: "/collages/daily_collage_sketch.jpg",
        people: ["Maya"],
        mood: "Reflective"
      },
      {
        id: "mock_aug_29",
        dayLabel: "Sat, Aug 29",
        title: "Third Wave Coffee Date with Maya",
        summary: "Coffee and long conversation about her upcoming move to London and physical journal rituals.",
        imageUrl: "/collages/daily_collage_risograph.jpg",
        people: ["Maya"],
        mood: "Contemplative"
      },
      {
        id: "mock_aug_28",
        dayLabel: "Fri, Aug 28",
        title: "Monsoon Skyline & Tea Break with Ananya",
        summary: "Captured photos of dramatic monsoon clouds over Jubilee Hills after an intense design session.",
        imageUrl: "/collages/daily_collage_ghibli.jpg",
        people: ["Ananya"],
        mood: "Joyful"
      }
    ]
  },
  "-2": {
    title: "Aug 18 – Aug 24, 2026 (Completed)",
    rangeLabel: "Aug 18 – Aug 24",
    insight: "Focused sprint energy mid-week, balanced by restful terrace acoustic sessions with Rohan and clear project intentions.",
    highlights: [
      {
        id: "mock_aug_24",
        dayLabel: "Sun, Aug 24",
        title: "Quiet Evening Intentions & Studio Plan",
        summary: "Logged reflections on studio goals and personal creative boundaries.",
        people: ["Kabir"],
        mood: "Grounded"
      },
      {
        id: "mock_aug_22",
        dayLabel: "Fri, Aug 22",
        title: "Sunset Acoustic Session with Rohan",
        summary: "Rohan played new acoustic guitar tunes on the terrace as the sun went down over the city skyline.",
        people: ["Rohan"],
        mood: "Restorative"
      },
      {
        id: "mock_aug_19",
        dayLabel: "Tue, Aug 19",
        title: "Product Architecture Sprint with Kabir",
        summary: "Deep dive into memory store schemas and graph traversal algorithms.",
        people: ["Kabir"],
        mood: "Focused"
      }
    ]
  },
  "-3": {
    title: "Aug 11 – Aug 17, 2026 (Completed)",
    rangeLabel: "Aug 11 – Aug 17",
    insight: "Strategic clarity and team ideation laid strong foundations for late-August project milestones.",
    highlights: [
      {
        id: "mock_aug_15",
        dayLabel: "Fri, Aug 15",
        title: "Studio Dinner & Milestone Celebration",
        summary: "Celebrated early prototype milestones with Ananya, Kabir, and Priya over dinner.",
        people: ["Ananya", "Kabir", "Priya"],
        mood: "Celebratory"
      },
      {
        id: "mock_aug_12",
        dayLabel: "Wed, Aug 12",
        title: "Brand Strategy Session with Priya",
        summary: "Mapped out visual identity tokens, hand-drawn illustration styles, and brand voice.",
        people: ["Priya"],
        mood: "Creative"
      }
    ]
  }
};

function synthesizeWeeklyNarrativeArc(captures: any[], fallbackInsight: string): string {
  if (!captures || captures.length === 0) {
    return fallbackInsight;
  }

  const count = captures.length;
  const people = Array.from(new Set(captures.flatMap((c) => c.dimensions?.people || []))).filter(Boolean);
  const moods = Array.from(new Set(captures.map((c) => c.dimensions?.mood).filter(Boolean)));
  const topics = Array.from(new Set(captures.flatMap((c) => c.dimensions?.topics || []))).filter(Boolean);

  const snippets = captures
    .map((c) => c.dimensions?.summary || c.title || (c.content ? c.content.substring(0, 50) : ""))
    .filter(Boolean);

  const peopleStr = people.length > 0
    ? (people.length === 1 ? people[0] : people.slice(0, -1).join(", ") + " and " + people[people.length - 1])
    : "";

  const moodStr = moods.length > 0
    ? moods.slice(0, 3).join(", ").toLowerCase()
    : "reflective and steady";

  if (peopleStr && moods.length > 0) {
    return `Your week brought a balance of ${moodStr} energy, shaped by creative focus and meaningful moments shared with ${peopleStr}.`;
  }

  if (peopleStr) {
    return `Across ${count} moments this week, your narrative centered on creative progress, personal clarity, and quality time with ${peopleStr}.`;
  }

  if (snippets.length >= 2) {
    const startSnippet = snippets[0].toLowerCase().replace(/\.$/, "");
    const endSnippet = snippets[snippets.length - 1].toLowerCase().replace(/\.$/, "");
    return `Your weekly arc unfolded across ${count} captured moments—moving from ${startSnippet} to ${endSnippet}, reflecting a ${moodStr} progression.`;
  }

  if (moods.length > 0) {
    return `Your week reflected an emotional progression through ${moodStr} reflections as your daily moments unfolded.`;
  }

  if (topics.length > 0) {
    return `Your week focused on ${topics.slice(0, 3).join(", ").toLowerCase()} and personal priorities.`;
  }

  return `Your week brought together ${count} captured moments into a coherent narrative of personal clarity and creative flow.`;
}

interface Props {
  weekLabel?: string;
  captures?: any[];
  highlights?: WeeklyHighlight[];
  weeklyPeople?: string[];
  weeklyInsight?: string;
  onSelectHighlight?: (id: string) => void;
  uniqueDaysLogged?: number;
  isUnlocked?: boolean;
  isDemoMode?: boolean;
  onOpenCapture?: (prompt?: string) => void;
  onGoReflect?: (view: any) => void;
}

export function WeeklyRecapBoard({
  weekLabel = "This Week",
  captures = [],
  highlights = [],
  weeklyPeople = [],
  weeklyInsight,
  onSelectHighlight,
  uniqueDaysLogged = 0,
  isUnlocked = false,
  isDemoMode = false,
  onOpenCapture,
  onGoReflect,
}: Props) {
  // weekIndex: 0 = current week (Sept 1 - Sept 7), -1 = previous week (Aug 25 - Aug 31), -2 = Aug 18 - Aug 24
  const [weekIndex, setWeekIndex] = useState<number>(0);
  const [userReflection, setUserReflection] = useState<string>("");
  const [savedToast, setSavedToast] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentDayOfWeek = 4;
  const totalDaysInWeek = 7;

  // Calculate exact start and end dates for selected weekIndex relative to Sept 1, 2026
  const getWeekBounds = (idx: number) => {
    const baseStart = new Date(2026, 8, 1); // Sept 1, 2026
    const start = new Date(baseStart);
    start.setDate(start.getDate() + idx * 7);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const { start: weekStart, end: weekEnd } = getWeekBounds(weekIndex);

  // Filter actual captures matching the selected week
  const filteredCaptures = captures.filter((c) => {
    const d = new Date(c.createdAt);
    return d >= weekStart && d <= weekEnd;
  });

  const preset = HISTORICAL_WEEK_PRESETS[weekIndex] || HISTORICAL_WEEK_PRESETS["-1"];

  const rangeLabel =
    weekIndex === 0
      ? "Sept 1 – Sept 7"
      : weekIndex === -1
      ? "Aug 25 – Aug 31"
      : `Aug ${Math.max(1, 25 + (weekIndex + 1) * 7)} – Aug ${Math.max(7, 31 + (weekIndex + 1) * 7)}`;

  const weekTitle =
    weekIndex === 0
      ? "Sept 1 – Sept 7, 2026 (Week 1)"
      : preset.title;

  // Highlights for the selected week: show real captures if exist, preset ONLY if isDemoMode is true, otherwise empty
  const activeHighlights: WeeklyHighlight[] =
    filteredCaptures.length > 0
      ? filteredCaptures.map((c) => ({
          id: c.id,
          dayLabel: new Date(c.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
          title: c.dimensions?.summary || c.title || (c.content ? c.content.substring(0, 40) + "..." : "Memory Entry"),
          summary: c.content,
          imageUrl: c.mediaUrl,
          people: c.dimensions?.people || [],
          mood: c.dimensions?.mood,
        }))
      : (isDemoMode ? preset.highlights : []);

  const activePeople =
    filteredCaptures.length > 0
      ? Array.from(new Set(filteredCaptures.flatMap((c) => c.dimensions?.people || [])))
      : (isDemoMode ? Array.from(new Set(preset.highlights.flatMap((h) => h.people || []))) : []);

  const dynamicWeeklyInsight =
    filteredCaptures.length > 0
      ? synthesizeWeeklyNarrativeArc(filteredCaptures, preset.insight)
      : (isDemoMode ? preset.insight : "Your story canvas for this period is open. Log a reflection to synthesize your weekly arc.");

  // Load reflection from localStorage on weekIndex change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`memoiary_user_reflection_week_${weekIndex}`);
      setUserReflection(saved || "");
    } catch (e) {
      setUserReflection("");
    }
  }, [weekIndex]);

  const handleSaveReflection = (val: string) => {
    setUserReflection(val);
    try {
      localStorage.setItem(`memoiary_user_reflection_week_${weekIndex}`, val);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
    } catch (e) {
      console.warn("Failed to save reflection", e);
    }
  };

  return (
    <section className="my-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1C1917] relative overflow-hidden font-sans">
      {/* Background paper texture glow */}
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-[#DE5239]/10 blur-3xl pointer-events-none" />

      {/* Header with Week Navigation Controls & Collapse Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1917]/15 pb-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1917] flex items-center gap-2">
              <Sparkles size={20} className="text-[#DE5239]" />
              <span>Your Story This Week</span>
            </h3>
            <p className="text-xs text-[#665F56] font-sans mt-0.5">{weekTitle}</p>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sm:hidden p-1.5 rounded-xl border border-[#1C1917]/20 bg-white text-[#1C1917]"
            title={isCollapsed ? "Expand Section" : "Collapse Section"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Week Navigator (Previous / Next Week Controls) */}
        <div className="flex items-center gap-2 bg-white border border-[#1C1917]/20 p-1.5 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setWeekIndex((prev) => prev - 1)}
            className="p-1.5 rounded-xl border border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer transition-colors"
            title="Previous Week"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs font-mono font-bold text-[#1C1917] px-2 min-w-[7.5rem] text-center">
            {weekIndex === 0 ? "Sept 1 – Sept 7" : weekIndex === -1 ? "Aug 25 – Aug 31" : `Aug ${18 + (weekIndex + 2) * 7} – Aug ${24 + (weekIndex + 2) * 7}`}
          </span>

          <button
            onClick={() => setWeekIndex((prev) => Math.min(0, prev + 1))}
            disabled={weekIndex === 0}
            className={`p-1.5 rounded-xl border transition-colors ${
              weekIndex === 0
                ? "border-[#1C1917]/10 bg-stone-100 text-stone-300 cursor-not-allowed"
                : "border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer"
            }`}
            title="Next Week"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden sm:block p-1.5 rounded-xl border border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer transition-colors ml-2"
            title={isCollapsed ? "Expand Section" : "Collapse Section"}
          >
            {isCollapsed ? "Show" : "Hide"}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>

      {/* VIEW 1: CURRENT WEEK IN PROGRESS (SEPT 1 - SEPT 7) */}
      {weekIndex === 0 && !isUnlocked && (
        <div className="space-y-6">
          {/* Week In Progress Status Banner */}
          <div className="p-6 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-4 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FDF2D0] border border-[#D97706]/40 rounded-2xl text-[#D97706]">
                  <Clock size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] block">
                    Week In Progress · Sept 1 – Sept 7
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#1C1917]">
                    Weekly Recap Unlocks at Week End
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/30 px-3 py-1 rounded-full w-fit">
                Day {currentDayOfWeek} of {totalDaysInWeek} Days
              </span>
            </div>

            {/* Weekly Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#665F56]">
                <span>Sept 1st</span>
                <span className="text-[#DE5239] font-mono">{totalDaysInWeek - currentDayOfWeek} Days Remaining</span>
                <span>Sept 7th</span>
              </div>
              <div className="w-full h-3 bg-[#FAF7F0] border border-[#1C1917]/30 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#DE5239] rounded-full transition-all duration-500"
                  style={{ width: `${(currentDayOfWeek / totalDaysInWeek) * 100}%` }}
                />
              </div>
            </div>

            {/* Freeform Current Week Reflection */}
            <div className="pt-2 space-y-2 border-t border-stone-100">
              <label className="text-xs font-bold text-[#1C1917] flex items-center justify-between">
                <span>✍️ Add your reflections for this week</span>
                {savedToast && <span className="text-[10px] font-mono text-[#059669]">✓ Saved</span>}
              </label>
              <textarea
                value={userReflection}
                onChange={(e) => handleSaveReflection(e.target.value)}
                placeholder="How are you feeling this week? Add any personal notes or thoughts..."
                rows={2}
                className="w-full p-3 bg-[#FAF7F0] border border-[#1C1917]/20 rounded-xl font-serif text-xs text-[#1C1917] focus:outline-none focus:border-[#DE5239] placeholder:italic"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPLETED WEEK VIEW (WEEK INDEX < 0 OR UNLOCKED) */}
      {(weekIndex < 0 || isUnlocked) && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Freeform Personal Weekly Reflection Box */}
          <div className="p-5 sm:p-6 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F5E5DC] text-[#DE5239] rounded-xl border border-[#DE5239]/30">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DE5239] block">
                    Personal Weekly Reflection
                  </span>
                  <h4 className="font-serif text-xl font-medium text-[#1C1917]">
                    How are you feeling about this period?
                  </h4>
                </div>
              </div>
              {savedToast && (
                <span className="text-xs font-mono font-bold text-[#059669] bg-[#E2EBD8] border border-[#059669]/30 px-3 py-1 rounded-full animate-in fade-in">
                  ✓ Saved to your story
                </span>
              )}
            </div>

            {/* Freeform Reflection Textarea */}
            <div className="space-y-3">
              <textarea
                value={userReflection}
                onChange={(e) => handleSaveReflection(e.target.value)}
                placeholder="Write your reflections here... How did this week feel for you? What were your favorite moments, insights, or intentions for next week?"
                rows={3}
                className="w-full p-4 bg-[#FAF7F0] border-[1.5px] border-[#1C1917]/25 rounded-2xl font-serif text-sm text-[#1C1917] focus:outline-none focus:border-[#DE5239] placeholder:italic placeholder:text-[#665F56]/60 leading-relaxed shadow-2xs"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[11px] font-mono text-[#665F56]">
                  {userReflection.trim() ? "✨ Saved in your personal reflection history" : "💡 Write freely or record a quick audio/photo reflection"}
                </span>

                {onOpenCapture && (
                  <button
                    onClick={() => onOpenCapture("Weekly Reflection: How did this week feel for you?")}
                    className="px-3.5 py-1.5 bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-xl text-xs font-sans font-bold shadow-[1px_2px_0px_#1C1917] border border-[#1C1917] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PenLine size={13} />
                    <span>Record Audio/Photo Reflection</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Weekly Emotional & Narrative Arc Synthesis Banner */}
          <div className="p-4 sm:p-5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex items-start gap-3 font-sans">
            <div className="p-2 bg-[#FDF2D0] border border-[#D97706]/40 rounded-xl text-[#D97706] shrink-0 mt-0.5">
              <TrendingUp size={18} />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider block">
                Weekly Emotional Arc &amp; Synthesis
              </span>
              <p className="font-serif text-sm sm:text-base text-[#1C1917] leading-relaxed">
                &ldquo;{dynamicWeeklyInsight}&rdquo;
              </p>
            </div>
          </div>

          {/* Grid of Scene Highlights for Selected Week */}
          {activeHighlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeHighlights.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHighlight?.(item.id)}
                  className="border-[1.5px] border-[#1C1917] bg-white rounded-2xl overflow-hidden shadow-[2px_3px_0px_#1C1917] flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer group font-sans"
                >
                  {item.imageUrl && (
                    <div className="h-40 w-full overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-[#1C1917] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {item.dayLabel}
                      </div>
                      {item.mood && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs border border-[#1C1917]/20 text-[#1C1917] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.mood}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#DE5239] uppercase">
                          {item.dayLabel}
                        </span>
                        {item.mood && !item.imageUrl && (
                          <span className="text-[10px] font-sans font-semibold text-[#1C1917] bg-[#FAF7F0] border border-[#1C1917]/20 px-2 py-0.5 rounded-full">
                            {item.mood}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-base font-medium text-[#1C1917] group-hover:text-[#DE5239] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-serif text-xs text-[#665F56] line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    {item.people && item.people.length > 0 && (
                      <div className="pt-2 border-t border-[#1C1917]/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#665F56] uppercase tracking-wider">
                          With:
                        </span>
                        <div className="flex items-center gap-1">
                          {item.people.map((p, idx) => (
                            <ArtisticAvatar key={idx} name={p} size="sm" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </>
      )}
    </section>
  );
}
