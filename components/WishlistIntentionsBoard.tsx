"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, Circle, Plus, Sparkles, Star, Tag, Trash2, HeartHandshake } from "lucide-react";

export interface WishlistItem {
  id: string;
  text: string;
  category: "wishlist" | "intention";
  sourceDate?: string;
  personMentioned?: string;
  completed: boolean;
}

export function WishlistIntentionsBoard({
  captures = [],
}: {
  captures?: any[];
}) {
  const [activeTab, setActiveTab] = useState<"wishlist" | "intention">("wishlist");
  const [customItems, setCustomItems] = useState<WishlistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Derive wishlist & subtle action intentions dynamically from user's journal captures
  const extractedItems = useMemo<WishlistItem[]>(() => {
    const items: WishlistItem[] = [];

    // Seed default starter intentions if new user
    if (!captures || captures.length === 0) {
      return [
        {
          id: "def-1",
          text: "Try baking handmade sourdough bread on a quiet Sunday",
          category: "wishlist",
          sourceDate: "Journal Idea",
          completed: false,
        },
        {
          id: "def-2",
          text: "Explore a sunset trail hike at North Ridge",
          category: "wishlist",
          sourceDate: "Journal Idea",
          completed: false,
        },
        {
          id: "def-3",
          text: "Catch up with Kabir over tea regarding future plans",
          category: "intention",
          personMentioned: "Kabir",
          sourceDate: "Extracted Thought",
          completed: false,
        },
        {
          id: "def-4",
          text: "Review recent journal entries to reflect on personal growth",
          category: "intention",
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

      // Scan text for wishlist keywords (want to, wish to, love to, dream of, hope to, visit, buy, learn)
      if (/want to|wish|love to|dream|hope to|someday|visit|learn|try/i.test(text)) {
        const sentence = text.split(/[.!?]/).find((s: string) => /want to|wish|love to|dream|hope to|someday|visit|learn|try/i.test(s));
        if (sentence && sentence.trim().length > 10) {
          items.push({
            id: `cap-w-${idx}`,
            text: sentence.trim(),
            category: "wishlist",
            sourceDate: dateStr,
            completed: false,
          });
        }
      }

      // Scan text for subtle action intentions (promised, should, need to, promised, call, check in)
      if (/promise|should|need to|supposed to|call|follow up|check in/i.test(text)) {
        const sentence = text.split(/[.!?]/).find((s: string) => /promise|should|need to|supposed to|call|follow up|check in/i.test(s));
        if (sentence && sentence.trim().length > 10) {
          const person = c.extractedDimensions?.people?.[0] || undefined;
          items.push({
            id: `cap-i-${idx}`,
            text: sentence.trim(),
            category: "intention",
            personMentioned: person,
            sourceDate: dateStr,
            completed: false,
          });
        }
      }
    });

    // Fallback if no specific sentences matched
    if (items.length === 0) {
      items.push({
        id: "def-fallback-1",
        text: "Visit a quiet library cafe to read & write",
        category: "wishlist",
        sourceDate: "Suggested Wish",
        completed: false,
      });
      items.push({
        id: "def-fallback-2",
        text: "Send a thoughtful note to a close friend",
        category: "intention",
        sourceDate: "Subtle Action",
        completed: false,
      });
    }

    return items;
  }, [captures]);

  // Combine extracted & user-added custom items
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

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
    <div className="rounded-3xl border-[1.5px] border-[#1C1917] bg-[#FAF7F0] p-5 sm:p-6 shadow-[3px_4px_0px_#1C1917] space-y-4 font-sans mb-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#DE5239]">
            <Star size={15} className="fill-[#DE5239]" />
            <span>Wishlist &amp; Subtle Life Intentions</span>
          </div>
          <p className="text-xs text-[#665F56] font-sans mt-0.5">
            Unspoken desires, bucket list thoughts, and gentle commitments extracted from your entries.
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
                <div className="flex items-center gap-2 mt-1 text-[11px] font-sans text-[#665F56]">
                  {item.sourceDate && (
                    <span className="flex items-center gap-1 font-mono text-[10px] bg-[#F5E5DC] text-[#DE5239] px-2 py-0.5 rounded-md font-semibold border border-[#DE5239]/20">
                      <Tag size={10} />
                      {item.sourceDate}
                    </span>
                  )}
                  {item.personMentioned && (
                    <span className="font-semibold text-[#D97706] bg-[#FFFBEB] border border-[#D97706]/30 px-2 py-0.5 rounded-md">
                      👤 {item.personMentioned}
                    </span>
                  )}
                </div>
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
