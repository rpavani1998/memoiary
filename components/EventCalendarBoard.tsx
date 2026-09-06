"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Cake,
  Sparkles,
  Users,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  PartyPopper,
  BookmarkPlus,
  Tag
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";
import { ArtisticAvatar } from "./ArtisticAvatar";
import { useJournal } from "@/lib/context/JournalContext";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD or Month Day
  category: "birthday" | "milestone" | "gathering" | "celebration";
  people?: string[];
  location?: string;
  sourceNote?: string;
  isCustom?: boolean;
}

interface Props {
  captures?: CaptureSession[];
  onSelectPerson?: (personName: string) => void;
  onOpenCapture?: (prompt?: string) => void;
}

const DEFAULT_SEEDED_EVENTS: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Maya's Farewell Coffee & London Sendoff",
    date: "2026-08-29",
    category: "gathering",
    people: ["Maya"],
    location: "Third Wave Coffee",
    sourceNote: "Coffee date talking about her London move & physical journal rituals."
  },
  {
    id: "evt-2",
    title: "Ananya's Story Collage Exhibition",
    date: "2026-08-30",
    category: "celebration",
    people: ["Ananya", "Maya"],
    location: "Tattva Cafe",
    sourceNote: "Unveiled her hand-drawn visual story collage canvas on the terrace."
  },
  {
    id: "evt-3",
    title: "Rohan's Sunset Terrace Acoustic Session",
    date: "2026-08-22",
    category: "gathering",
    people: ["Rohan"],
    location: "Jubilee Hills Terrace",
    sourceNote: "Rohan played new acoustic guitar tunes over the city skyline."
  },
  {
    id: "evt-4",
    title: "Memoiary Privacy Architecture Milestone",
    date: "2026-08-18",
    category: "milestone",
    people: ["Sarah", "Kabir"],
    location: "Roastery Coffee House",
    sourceNote: "Finalized strict single-tenant user partitioning in Firestore."
  },
  {
    id: "evt-5",
    title: "Ananya's Birthday Celebration",
    date: "2026-09-14",
    category: "birthday",
    people: ["Ananya"],
    location: "Jubilee Hills Studio",
    sourceNote: "Upcoming birthday gathering with chai & cake."
  },
  {
    id: "evt-6",
    title: "Bengaluru Reunion Jam with Rohan",
    date: "2026-09-25",
    category: "gathering",
    people: ["Rohan", "Kabir"],
    location: "Bengaluru",
    sourceNote: "Promised weekend catchup & acoustic session."
  }
];

export function EventCalendarBoard({
  captures = [],
  onSelectPerson,
  onOpenCapture
}: Props) {
  const [activeCategory, setActiveCategory] = useState<"all" | "birthday" | "milestone" | "gathering">("all");
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number }>({ year: 2026, month: 8 }); // September 2026 (0-indexed 8)
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);

  // Add event modal/form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("2026-09-15");
  const [newCategory, setNewCategory] = useState<"birthday" | "milestone" | "gathering" | "celebration">("birthday");
  const [newPerson, setNewPerson] = useState("");
  const [newLocation, setNewLocation] = useState("");

  let user: any = null;
  try {
    const journalContext = useJournal();
    user = journalContext?.user;
  } catch {}

  const userEventsKey = user && !user.uid?.startsWith("guest_user_") && !user.uid?.startsWith("user_guest_")
    ? `memoiary_custom_events_${user.uid}`
    : "memoiary_custom_events_guest";

  const isDemoMode = !user || user.uid?.startsWith("guest_user_") || user.uid?.startsWith("user_guest_");

  // Load custom events from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(userEventsKey);
        if (saved) {
          setCustomEvents(JSON.parse(saved));
        } else {
          setCustomEvents([]);
        }
      }
    } catch (e) {
      console.warn("Failed to load custom events", e);
      setCustomEvents([]);
    }
  }, [userEventsKey]);

  const saveCustomEvents = (updated: CalendarEvent[]) => {
    setCustomEvents(updated);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(userEventsKey, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("Failed to persist custom events", e);
    }
  };

  // Derive extracted events from user captures + custom events + seeded events
  const allEvents = useMemo(() => {
    const extracted: CalendarEvent[] = [];

    captures.forEach((c, idx) => {
      const dateStr = c.createdAt
        ? new Date(c.createdAt).toISOString().split("T")[0]
        : "2026-09-06";
      const people = c.dimensions?.people || [];
      const location = c.dimensions?.places?.[0] || undefined;
      const text = c.content || "";

      // 1. AI-extracted events
      if (c.dimensions?.events && c.dimensions.events.length > 0) {
        c.dimensions.events.forEach((evt, eIdx) => {
          extracted.push({
            id: `cap-evt-${idx}-${eIdx}`,
            title: evt.title,
            date: evt.date || dateStr,
            category: evt.category || "gathering",
            people: evt.people || people,
            location: evt.location || location,
            sourceNote: text.substring(0, 80)
          });
        });
      }

      // 2. Keyword heuristic scanning if not extracted explicitly
      if (/birthday|bday|anniversary|celebration|farewell|party|reunion/i.test(text)) {
        const titleMatch = text.split(/[.!?\n]/).find((s) => /birthday|bday|anniversary|celebration|farewell|party|reunion/i.test(s));
        if (titleMatch && !extracted.some((e) => e.title === titleMatch.trim())) {
          extracted.push({
            id: `cap-kw-${idx}`,
            title: titleMatch.trim(),
            date: dateStr,
            category: /birthday|bday/i.test(text) ? "birthday" : "celebration",
            people,
            location,
            sourceNote: text.substring(0, 80)
          });
        }
      }
    });

    // Merge custom events, extracted events, and default seeded events (only in demo mode)
    const combined = isDemoMode
      ? [...customEvents, ...extracted, ...DEFAULT_SEEDED_EVENTS]
      : [...customEvents, ...extracted];

    // Deduplicate by title & date
    const uniqueMap = new Map<string, CalendarEvent>();
    combined.forEach((e) => {
      const key = `${e.title.toLowerCase()}_${e.date}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, e);
      }
    });

    // Sort chronologically
    return Array.from(uniqueMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [captures, customEvents, isDemoMode]);

  // Filter events for selected month & category
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      const evtDate = new Date(evt.date);
      const matchesMonth = evtDate.getFullYear() === selectedMonth.year && evtDate.getMonth() === selectedMonth.month;
      const matchesCategory = activeCategory === "all" ? true : evt.category === activeCategory;
      return matchesMonth && matchesCategory;
    });
  }, [allEvents, selectedMonth, activeCategory]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: CalendarEvent = {
      id: `custom-evt-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate,
      category: newCategory,
      people: newPerson.trim() ? [newPerson.trim()] : undefined,
      location: newLocation.trim() || undefined,
      isCustom: true
    };

    saveCustomEvents([created, ...customEvents]);
    setNewTitle("");
    setNewPerson("");
    setNewLocation("");
    setShowAddForm(false);
  };

  const getCategoryBadge = (cat: CalendarEvent["category"]) => {
    switch (cat) {
      case "birthday":
        return { label: "🎂 Birthday", bg: "bg-pink-100 text-pink-700 border-pink-300" };
      case "milestone":
        return { label: "🎉 Milestone", bg: "bg-amber-100 text-amber-800 border-amber-300" };
      case "celebration":
        return { label: "🥳 Celebration", bg: "bg-purple-100 text-purple-700 border-purple-300" };
      case "gathering":
      default:
        return { label: "☕ Attended Event", bg: "bg-teal-100 text-teal-800 border-teal-300" };
    }
  };

  // Month navigation
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  // Days grid calculation for mini calendar view
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(selectedMonth.year, selectedMonth.month, 1).getDay();
    const daysInMonth = new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate();
    const daysArray = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayEvents = allEvents.filter((e) => e.date === dateStr);
      daysArray.push({ day: d, dateStr, events: dayEvents });
    }
    return daysArray;
  }, [selectedMonth, allEvents]);

  return (
    <div className="rounded-3xl border-[1.5px] border-[#1C1917] bg-[#FAF7F0] p-5 sm:p-6 shadow-[3px_4px_0px_#1C1917] space-y-5 font-sans mb-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C1917]/10 pb-4">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1917] flex items-center gap-2">
            <CalendarIcon size={20} className="text-[#DE5239]" />
            <span>Memorable Events &amp; Celebrations</span>
          </h3>
          <p className="text-xs text-[#665F56] font-sans mt-0.5">
            Birthdays, attended gatherings, and key milestones reconciled from your story.
          </p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2 bg-white border border-[#1C1917]/20 p-1.5 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl border border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer transition-colors"
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-serif font-bold text-[#1C1917] px-2 min-w-[7.5rem] text-center">
            {monthNames[selectedMonth.month]} {selectedMonth.year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl border border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer transition-colors"
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mini Visual Calendar Grid */}
      <div className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-3">
        <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1C1917]">
          <span>{monthNames[selectedMonth.month]} {selectedMonth.year} Calendar Grid</span>
          <span className="text-[10px] font-mono text-[#665F56]">
            {filteredEvents.length} Event{filteredEvents.length === 1 ? "" : "s"} Marked
          </span>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-[#665F56] border-b border-[#1C1917]/10 pb-1">
          <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center font-sans text-xs">
          {calendarDays.map((item, i) => {
            if (!item) return <div key={`empty-${i}`} className="h-8 rounded-lg bg-stone-50/50" />;
            const hasEvents = item.events.length > 0;
            const hasBirthday = item.events.some((e) => e.category === "birthday");
            const hasMilestone = item.events.some((e) => e.category === "milestone");

            return (
              <div
                key={item.dateStr}
                className={`h-9 rounded-xl border flex flex-col items-center justify-between p-1 transition-all ${
                  hasEvents
                    ? "bg-[#FAF7F0] border-[#DE5239]/40 font-bold text-[#1C1917] shadow-2xs"
                    : "bg-white border-stone-100 text-stone-600"
                }`}
              >
                <span className="text-[11px] leading-none">{item.day}</span>
                {hasEvents && (
                  <div className="flex items-center gap-0.5">
                    {hasBirthday && <span className="w-1.5 h-1.5 rounded-full bg-pink-500" title="Birthday" />}
                    {hasMilestone && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Milestone" />}
                    {!hasBirthday && !hasMilestone && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" title="Gathering" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F5E5DC] p-1 rounded-2xl border border-[#DE5239]/20">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
              activeCategory === "all" ? "bg-[#DE5239] text-white shadow-2xs" : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            All Events ({allEvents.filter((e) => new Date(e.date).getMonth() === selectedMonth.month).length})
          </button>
          <button
            onClick={() => setActiveCategory("birthday")}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === "birthday" ? "bg-[#DE5239] text-white shadow-2xs" : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Cake size={13} />
            <span>Birthdays</span>
          </button>
          <button
            onClick={() => setActiveCategory("milestone")}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === "milestone" ? "bg-[#DE5239] text-white shadow-2xs" : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Sparkles size={13} />
            <span>Milestones</span>
          </button>
          <button
            onClick={() => setActiveCategory("gathering")}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === "gathering" ? "bg-[#DE5239] text-white shadow-2xs" : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Users size={13} />
            <span>Attended Events</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-1.5 bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-xl text-xs font-sans font-bold shadow-[1px_2px_0px_#1C1917] border border-[#1C1917] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Add Event / Birthday</span>
        </button>
      </div>

      {/* Quick Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddEvent} className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-3 font-sans animate-in fade-in duration-200">
          <h4 className="font-serif text-sm font-bold text-[#1C1917] flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#DE5239]" /> Add New Event or Birthday
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#665F56] block mb-1">Event Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Maya's Birthday Party, Studio Launch"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#1C1917]/20 text-[#1C1917] focus:outline-none focus:border-[#DE5239]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#665F56] block mb-1">Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#1C1917]/20 text-[#1C1917] focus:outline-none focus:border-[#DE5239]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#665F56] block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#1C1917]/20 text-[#1C1917] focus:outline-none focus:border-[#DE5239]"
              >
                <option value="birthday">🎂 Birthday</option>
                <option value="milestone">🎉 Milestone</option>
                <option value="gathering">☕ Attended Event / Gathering</option>
                <option value="celebration">🥳 Celebration</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#665F56] block mb-1">Person Mentioned (Optional)</label>
              <input
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="e.g. Maya, Kabir"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F0] border border-[#1C1917]/20 text-[#1C1917] focus:outline-none focus:border-[#DE5239]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C1917]/10">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#665F56] hover:text-[#1C1917]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#DE5239] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#C6422A] cursor-pointer"
            >
              Save Event
            </button>
          </div>
        </form>
      )}

      {/* Events Agenda Feed */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#1C1917]/15 rounded-2xl space-y-2">
            <CalendarIcon size={24} className="mx-auto text-[#665F56]/60" />
            <p className="font-serif text-sm font-medium text-[#1C1917]">No events recorded for this month</p>
            <p className="text-xs text-[#665F56]">Add an event above or write a journal entry to auto-extract celebrations!</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const badge = getCategoryBadge(evt.category);
            const formattedDate = new Date(evt.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

            return (
              <div
                key={evt.id}
                className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#DE5239]/40 transition-all font-sans"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#DE5239] bg-[#F5E5DC] px-2.5 py-0.5 rounded-md border border-[#DE5239]/20">
                      {formattedDate}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-[#1C1917] leading-snug">
                    {evt.title}
                  </h4>

                  {evt.sourceNote && (
                    <p className="font-serif text-xs text-[#665F56] line-clamp-1 italic">
                      &ldquo;{evt.sourceNote}&rdquo;
                    </p>
                  )}
                </div>

                {/* Metadata Badges: People & Location */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {evt.location && (
                    <span className="text-[11px] font-semibold text-[#D97706] flex items-center gap-1 bg-[#FFFBEB] border border-[#D97706]/30 px-2.5 py-1 rounded-full">
                      <MapPin size={11} />
                      {evt.location}
                    </span>
                  )}

                  {evt.people && evt.people.length > 0 && (
                    <div className="flex items-center gap-1">
                      {evt.people.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => onSelectPerson?.(p)}
                          className="flex items-center gap-1 bg-[#FAF7F0] border border-[#1C1917]/20 px-2 py-0.5 rounded-full text-xs cursor-pointer hover:border-[#DE5239]"
                        >
                          <ArtisticAvatar name={p} size="sm" />
                          <span className="font-serif font-bold text-[11px] text-[#1C1917]">{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
