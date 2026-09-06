"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Circle, Plus, Sparkles, Star, Tag, Trash2, HeartHandshake, BookOpen } from "lucide-react";
import { useJournal } from "@/lib/context/JournalContext";

export interface WishlistItem {
  id: string;
  text: string;
  category: "wishlist" | "intention";
  subCategory?: "promise" | "culinary" | "travel" | "action" | "creative";
  sourceDate?: string;
  personMentioned?: string;
  sourceEntryTitle?: string;
  sourceSnippet?: string;
  sourceCapture?: any;
  completed: boolean;
}

function parseAndClassifySentences(
  text: string,
  dateStr: string,
  idx: number,
  person?: string,
  entryTitle?: string,
  sourceCapture?: any
): WishlistItem[] {
  const results: WishlistItem[] = [];
  const sentences = text.split(/[.!?\n]/).map((s) => s.trim()).filter((s) => s.length > 8);

  sentences.forEach((sentence, sIdx) => {
    // Exclude past tense completed statements (e.g. "I cooked pasta", "We visited KBR park", "I ate sourdough")
    const isPastCompletedEvent = /^(i|we|they|she|he)?\s*(ate|cooked|visited|went|traveled|bought|baked|dined|met|had|enjoyed|drank|tasted|ordered|flew|walked|recorded|finished|completed)\b/i.test(sentence) && !/want to|hope to|would love|wish|plan to|promise|need to|must/i.test(sentence);
    if (isPastCompletedEvent) {
      return; // Does NOT belong in Wishlist or Action Intentions
    }

    // 1. Check for Action Intentions & Promises FIRST (Explicit commitments or obligations)
    const isPromise = /\b(promise|promised|pledged|agreed to|swore|word to)\b/i.test(sentence);
    const isObligation = /\b(need to|should|must|have to|supposed to|will call|need to call|should call|have to call|must call|remind me to|schedule a|will send|need to send|make sure to|remember to|plan to|follow up|check in|catch up with)\b/i.test(sentence);

    if (isPromise || isObligation) {
      results.push({
        id: `cap-i-${idx}-${sIdx}`,
        text: sentence,
        category: "intention",
        subCategory: isPromise ? "promise" : "action",
        sourceDate: dateStr,
        personMentioned: person,
        sourceEntryTitle: entryTitle,
        sourceSnippet: sentence,
        sourceCapture,
        completed: false,
      });
      return; // Deduplicate: do not add to wishlist if it's an explicit action intention/promise
    }

    // 2. Check for Wishlist & Dreams (Culinary, Travel, Aspirational)
    // MUST contain explicit future desire or aspirational intent
    const hasAspirationalDesire = /want to|would love to|wish|dream|hope to|someday|bucket list|aim to|dying to|can't wait to|cant wait to|must try|recipe to try|food spot|planning to visit/i.test(sentence);
    const isCulinary = /recipe|dish|cook|bake|taste|food|bistro|dessert|chai|coffee|pasta|pizza|ramen|sourdough|tiramisu|haleem|biryani|pastry|cake|curry|tasting/i.test(sentence);
    const isTravel = /visit|travel|fly|trip|vacation|hike|explore|trail|city|beach/i.test(sentence);

    if (hasAspirationalDesire || ((isCulinary || isTravel) && /try|visit|explore|learn|taste|cook|bake|make/i.test(sentence) && !/yesterday|last week|past|ago/i.test(sentence))) {
      let subCategory: "culinary" | "travel" | "creative" = "creative";
      if (isCulinary) subCategory = "culinary";
      else if (isTravel) subCategory = "travel";

      results.push({
        id: `cap-w-${idx}-${sIdx}`,
        text: sentence,
        category: "wishlist",
        subCategory,
        sourceDate: dateStr,
        personMentioned: person,
        sourceEntryTitle: entryTitle,
        sourceSnippet: sentence,
        sourceCapture,
        completed: false,
      });
    }
  });

  return results;
}

export function WishlistIntentionsBoard({
  captures = [],
  onSelectCapture,
}: {
  captures?: any[];
  onSelectCapture?: (capture: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<"wishlist" | "intention">("wishlist");
  const [customItems, setCustomItems] = useState<WishlistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  let user: any = null;
  try {
    const journalContext = useJournal();
    user = journalContext?.user;
  } catch {}

  const isDemoMode = !user || user.uid?.startsWith("guest_user_") || user.uid?.startsWith("user_guest_");

  // Derive wishlist & subtle action intentions dynamically from user's journal captures
  const extractedItems = useMemo<WishlistItem[]>(() => {
    const items: WishlistItem[] = [];

    // Seed default starter intentions ONLY if guest demo mode and user has no captures
    if (!captures || captures.length === 0) {
      if (!isDemoMode) return [];
      return [
        {
          id: "def-1",
          text: "Try baking handmade sourdough bread on a quiet Sunday",
          category: "wishlist",
          subCategory: "culinary",
          sourceDate: "Journal Idea",
          completed: false,
        },
        {
          id: "def-2",
          text: "Explore a sunset trail hike at North Ridge",
          category: "wishlist",
          subCategory: "travel",
          sourceDate: "Journal Idea",
          completed: false,
        },
        {
          id: "def-3",
          text: "Catch up with Kabir over tea regarding future plans",
          category: "intention",
          subCategory: "action",
          personMentioned: "Kabir",
          sourceDate: "Extracted Thought",
          completed: false,
        },
        {
          id: "def-4",
          text: "Review recent journal entries to reflect on personal growth",
          category: "intention",
          subCategory: "action",
          sourceDate: "System Thought",
          completed: false,
        },
      ];
    }

    captures.forEach((c, idx) => {
      const text = c.rawText || c.content || "";
      const dateStr = c.createdAt
        ? new Date(c.createdAt?.seconds ? c.createdAt.seconds * 1000 : c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "Recent";
      const person = c.extractedDimensions?.people?.[0] || c.dimensions?.people?.[0] || undefined;
      const entryTitle = c.dimensions?.summary || c.title || (text ? text.substring(0, 35) + "..." : "Journal Entry");

      const aiWishes = c.dimensions?.wishes || c.extractedDimensions?.wishes;
      const aiIntentions = c.dimensions?.intentions || c.extractedDimensions?.intentions;

      if ((aiWishes && aiWishes.length > 0) || (aiIntentions && aiIntentions.length > 0)) {
        (aiWishes || []).forEach((w: any, wIdx: number) => {
          items.push({
            id: `ai-w-${idx}-${wIdx}`,
            text: w.text,
            category: "wishlist",
            subCategory: w.subCategory || "creative",
            sourceDate: dateStr,
            personMentioned: person,
            sourceEntryTitle: entryTitle,
            sourceSnippet: text,
            sourceCapture: c,
            completed: false,
          });
        });
        (aiIntentions || []).forEach((i: any, iIdx: number) => {
          items.push({
            id: `ai-i-${idx}-${iIdx}`,
            text: i.text,
            category: "intention",
            subCategory: i.subCategory || "action",
            sourceDate: dateStr,
            personMentioned: i.personMentioned || person,
            sourceEntryTitle: entryTitle,
            sourceSnippet: text,
            sourceCapture: c,
            completed: false,
          });
        });
      } else {
        const classified = parseAndClassifySentences(text, dateStr, idx, person, entryTitle, c);
        items.push(...classified);
      }
    });

    // Fallback if no specific sentences matched
    if (items.length === 0) {
      items.push({
        id: "def-fallback-1",
        text: "Visit a quiet library cafe to read & write",
        category: "wishlist",
        subCategory: "travel",
        sourceDate: "Suggested Wish",
        completed: false,
      });
      items.push({
        id: "def-fallback-2",
        text: "Send a thoughtful note to a close friend",
        category: "intention",
        subCategory: "action",
        sourceDate: "Subtle Action",
        completed: false,
      });
    }

    return items;
  }, [captures, isDemoMode]);

  // Combine extracted & user-added custom items
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [expandedSnippetIds, setExpandedSnippetIds] = useState<Record<string, boolean>>({});

  const allItems = useMemo(() => {
    return [...extractedItems, ...customItems];
  }, [extractedItems, customItems]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => item.category === activeTab);
  }, [allItems, activeTab]);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: WishlistItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      category: activeTab,
      sourceDate: "Added today",
      completed: false,
    };
    setCustomItems((prev) => [newItem, ...prev]);
    setNewItemText("");
    setShowAddForm(false);
  };

  return (
    <div data-tour="wishlist-board" className="rounded-3xl border-[1.5px] border-[#1C1917] bg-[#FAF7F0] p-5 sm:p-6 shadow-[3px_4px_0px_#1C1917] space-y-4 font-sans mb-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-3">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#1C1917] flex items-center gap-2">
            <Star size={18} className="text-[#DE5239] fill-[#DE5239]" />
            <span>Wishlist &amp; Action Intentions</span>
          </h3>
          <p className="text-xs text-[#665F56] font-sans mt-0.5">
            Unspoken desires, culinary wishes, and commitments extracted from your entries.
          </p>
        </div>

        {/* Tab Switcher: Wishlist vs Subtle Action Intentions */}
        <div className="flex items-center gap-1.5 bg-[#F5E5DC] p-1 rounded-2xl border border-[#DE5239]/20">
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
              activeTab === "wishlist"
                ? "bg-[#DE5239] text-white shadow-2xs"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Sparkles size={13} />
            <span>Wishlist &amp; Dreams</span>
          </button>
          <button
            onClick={() => setActiveTab("intention")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer ${
              activeTab === "intention"
                ? "bg-[#DE5239] text-white shadow-2xs"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <HeartHandshake size={13} />
            <span>Action Intentions</span>
          </button>
        </div>
      </div>

      {/* Item List */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => {
          const isDone = !!completedIds[item.id];
          const isCulinary = item.subCategory === "culinary" || /dish|recipe|cook|bake|taste|eat|food|bistro|dessert|chai|coffee|pasta|pizza|ramen|sourdough|tiramisu|haleem|biryani|pastry|cake|curry|tasting/i.test(item.text);
          const isTravel = item.subCategory === "travel" || /visit|travel|fly|trip|vacation|hike|explore|trail|city|beach/i.test(item.text);
          const isPromise = item.subCategory === "promise" || /promise|promised|pledged|agreed to/i.test(item.text);

          return (
            <div
              key={item.id}
              onClick={() => toggleComplete(item.id)}
              className={`group flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                isDone
                  ? "bg-stone-100/70 border-stone-200 opacity-60"
                  : "bg-white border-[#1C1917]/15 hover:border-[#DE5239]/40 hover:bg-[#FAF7F0] shadow-2xs"
              }`}
            >
              {/* Checkbox Icon */}
              <button
                type="button"
                className="mt-0.5 text-[#DE5239] hover:scale-110 transition-transform shrink-0"
              >
                {isDone ? (
                  <CheckCircle2 size={18} className="fill-[#DE5239] text-white" />
                ) : (
                  <Circle size={18} className="text-[#665F56] group-hover:text-[#DE5239]" />
                )}
              </button>

              {/* Text & Metadata */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-serif text-sm text-[#1C1917] leading-snug ${
                    isDone ? "line-through text-stone-500" : ""
                  }`}
                >
                  {item.text}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-sans text-[#665F56]">
                  {item.sourceDate && (
                    <span className="flex items-center gap-1 font-mono text-[10px] bg-[#F5E5DC] text-[#DE5239] px-2 py-0.5 rounded-md font-semibold border border-[#DE5239]/20">
                      <Tag size={10} />
                      {item.sourceDate}
                    </span>
                  )}
                  {item.category === "intention" && (
                    <span className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${
                      isPromise 
                        ? "text-[#7C3AED] bg-[#F3E8FF] border border-[#7C3AED]/30" 
                        : "text-[#D97706] bg-[#FFFBEB] border border-[#D97706]/30"
                    }`}>
                      {isPromise ? "🤝 Promise / Commitment" : "⚡ Action Intention"}
                    </span>
                  )}
                  {item.personMentioned && (
                    <span className="font-semibold text-[#D97706] bg-[#FFFBEB] border border-[#D97706]/30 px-2 py-0.5 rounded-md text-[10px]">
                      👤 {item.personMentioned}
                    </span>
                  )}
                  {item.category === "wishlist" && isCulinary && (
                    <span className="font-semibold text-[#059669] bg-[#E2EBD8] border border-[#059669]/30 px-2 py-0.5 rounded-md text-[10px]">
                      🍲 Culinary Wish
                    </span>
                  )}
                  {item.category === "wishlist" && isTravel && !isCulinary && (
                    <span className="font-semibold text-[#0284C7] bg-[#E0F2FE] border border-[#0284C7]/30 px-2 py-0.5 rounded-md text-[10px]">
                      ✈️ Travel &amp; Adventure
                    </span>
                  )}
                  {item.sourceCapture && onSelectCapture ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCapture(item.sourceCapture);
                      }}
                      className="flex items-center gap-1 font-mono text-[10px] bg-[#DE5239] hover:bg-[#C6422A] text-white px-2.5 py-0.5 rounded-md font-bold shadow-2xs transition-colors cursor-pointer ml-auto"
                      title="Directly open original journal entry"
                    >
                      <BookOpen size={10} />
                      <span>Open Journal Entry</span>
                    </button>
                  ) : item.sourceSnippet ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedSnippetIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                      }}
                      className="flex items-center gap-1 font-mono text-[10px] bg-[#FAF7F0] hover:bg-[#F5E5DC] text-[#1C1917] px-2 py-0.5 rounded-md font-bold border border-[#1C1917]/20 transition-colors cursor-pointer ml-auto"
                    >
                      <BookOpen size={10} className="text-[#DE5239]" />
                      <span>{expandedSnippetIds[item.id] ? "Hide Source" : "Journal Source"}</span>
                    </button>
                  ) : null}
                </div>

                {/* Collapsible Journal Excerpt View */}
                {expandedSnippetIds[item.id] && item.sourceSnippet && (
                  <div
                    onClick={(e) => {
                      if (item.sourceCapture && onSelectCapture) {
                        e.stopPropagation();
                        onSelectCapture(item.sourceCapture);
                      }
                    }}
                    className={`mt-2.5 p-3 bg-[#FAF7F0] border border-[#1C1917]/20 rounded-xl text-xs font-serif text-[#1C1917] space-y-1 animate-in fade-in duration-200 ${
                      item.sourceCapture && onSelectCapture ? "hover:border-[#DE5239] hover:bg-[#F5E5DC]/50 cursor-pointer" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#DE5239] uppercase">
                      <span>📖 Captured Journal Excerpt</span>
                      {item.sourceEntryTitle && <span className="text-[#665F56] truncate max-w-[12rem]">{item.sourceEntryTitle}</span>}
                    </div>
                    <p className="italic leading-relaxed text-[#1C1917]">
                      &ldquo;{item.sourceSnippet}&rdquo;
                    </p>
                    {item.sourceCapture && onSelectCapture && (
                      <span className="text-[10px] font-mono font-bold text-[#DE5239] block pt-1">
                        → Click to view full entry
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Item Input */}
      {showAddForm ? (
        <form onSubmit={handleAddItem} className="pt-2 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder={
              activeTab === "wishlist"
                ? "Add a wish (e.g., Visit Japan in autumn)..."
                : "Add a subtle action intention..."
            }
            className="flex-1 px-3.5 py-2 text-xs font-sans rounded-xl bg-white border border-[#1C1917]/20 text-[#1C1917] placeholder:text-stone-400 focus:outline-none focus:border-[#DE5239]"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#DE5239] text-white rounded-xl text-xs font-sans font-bold hover:bg-[#C6422A] cursor-pointer shadow-xs"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-3 py-2 text-xs font-sans font-semibold text-[#665F56] hover:text-[#1C1917] cursor-pointer"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-2.5 border border-dashed border-[#1C1917]/20 hover:border-[#DE5239]/40 rounded-2xl text-xs font-sans font-semibold text-[#665F56] hover:text-[#DE5239] flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white/50"
        >
          <Plus size={14} />
          <span>Add new {activeTab === "wishlist" ? "Wishlist item" : "Action intention"}</span>
        </button>
      )}
    </div>
  );
}
