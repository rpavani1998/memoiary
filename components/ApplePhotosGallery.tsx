"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Play,
  MapPin,
  FolderPlus,
  Compass,
  Users,
  Image as ImageIcon,
  X,
  Volume2,
  VolumeX,
  Layers,
  Plus
} from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";
import { CaptureSession } from "@/lib/memory-engine/types";

interface CollectionAlbum {
  id: string;
  title: string;
  category: "trip" | "person" | "custom" | "smart";
  coverUrl?: string;
  itemCount: number;
  dateRange: string;
  location?: string;
  people?: string[];
  description?: string;
}

interface ApplePhotosGalleryProps {
  captures: CaptureSession[];
  onSelectCapture?: (capture: CaptureSession) => void;
  onSelectPerson?: (personName: string) => void;
}

export function ApplePhotosGallery({
  captures = [],
  onSelectCapture,
  onSelectPerson
}: ApplePhotosGalleryProps) {
  const [activeTab, setActiveTab] = useState<"memories" | "people" | "trips" | "albums">("memories");
  const [isPlayingReel, setIsPlayingReel] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumCategory, setNewAlbumCategory] = useState<"custom" | "trip">("custom");
  const [customAlbums, setCustomAlbums] = useState<CollectionAlbum[]>([]);

  // 1. Dynamically extract unique people ONLY from user's actual captures
  const peopleList = React.useMemo(() => {
    const map = new Map<string, { name: string; count: number; lastSeen: string }>();
    captures.forEach((c) => {
      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recently";
      c.dimensions?.people?.forEach((p) => {
        const existing = map.get(p);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(p, { name: p, count: 1, lastSeen: dateStr });
        }
      });
    });
    return Array.from(map.values());
  }, [captures]);

  // 2. Dynamically extract unique trips & places ONLY from user's actual captures
  const tripsList = React.useMemo(() => {
    const map = new Map<string, { location: string; count: number; coverUrl?: string; lastDate: string }>();
    captures.forEach((c) => {
      const places = c.dimensions?.places || [];
      const cover = c.mediaUrl;
      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      places.forEach((pl) => {
        const existing = map.get(pl);
        if (existing) {
          existing.count += 1;
          if (!existing.coverUrl && cover) existing.coverUrl = cover;
        } else {
          map.set(pl, { location: pl, count: 1, coverUrl: cover, lastDate: dateStr });
        }
      });
    });
    return Array.from(map.values());
  }, [captures]);

  // 3. Dynamically extract memory reels ONLY from actual captures
  const reelSlides = React.useMemo(() => {
    return captures.map((c) => {
      const date = c.createdAt ? new Date(c.createdAt) : new Date();
      const dateStr = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      return {
        id: c.id,
        rawCapture: c,
        title: c.dimensions?.summary || c.content?.substring(0, 45) || "Captured Memory",
        date: dateStr,
        location: c.dimensions?.places?.[0] || "Personal Memory",
        quote: c.content || "Memory captured in Memoiary",
        imageUrl: c.mediaUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        people: c.dimensions?.people || []
      };
    });
  }, [captures]);

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;
    const newAlb: CollectionAlbum = {
      id: `alb_${Date.now()}`,
      title: newAlbumTitle.trim(),
      category: newAlbumCategory,
      coverUrl: captures.find((c) => c.mediaUrl)?.mediaUrl,
      itemCount: 0,
      dateRange: "Just now",
      description: "User created custom album."
    };
    setCustomAlbums([newAlb, ...customAlbums]);
    setNewAlbumTitle("");
    setShowCreateModal(false);
  };

  return (
    <div className="w-full font-sans space-y-6">
      {/* ── Header Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1C1917]/15 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DE5239] flex items-center gap-1.5 font-sans">
            <Sparkles size={14} /> Memories &amp; Visual Collections
          </span>
          <h2 className="font-serif text-2xl font-medium text-[#1C1917] mt-0.5">Collections</h2>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex bg-[#F5F1E8] border border-[#1C1917]/20 p-1 rounded-2xl gap-1 text-xs font-sans font-bold flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab("memories")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "memories"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Compass size={14} /> Memories ({reelSlides.length})
          </button>
          <button
            onClick={() => setActiveTab("people")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "people"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Users size={14} /> People &amp; Faces ({peopleList.length})
          </button>
          <button
            onClick={() => setActiveTab("trips")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "trips"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <MapPin size={14} /> Places ({tripsList.length})
          </button>
          <button
            onClick={() => setActiveTab("albums")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "albums"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Layers size={14} /> Albums ({customAlbums.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: MEMORIES REEL ── */}
      {activeTab === "memories" && (
        <div className="space-y-6">
          {reelSlides.length === 0 ? (
            <div className="p-10 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-3 font-sans">
              <Compass size={32} className="text-[#DE5239] mx-auto" />
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">No Memories Captured Yet</h3>
              <p className="text-xs text-[#665F56] max-w-sm mx-auto">
                As you capture moments, thoughts, photos, or voice notes, Memoiary will automatically assemble memory reels here!
              </p>
            </div>
          ) : (
            <>
              {/* Featured Memory Reel Hero */}
              <div className="relative rounded-3xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[4px_6px_0px_#1C1917] group min-h-[22rem] flex flex-col justify-end bg-stone-900">
                <img
                  src={reelSlides[0].imageUrl}
                  alt={reelSlides[0].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/40 to-transparent" />

                <div className="relative z-10 p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#DE5239] text-white px-2.5 py-1 rounded-full border border-black/30 shadow-xs flex items-center gap-1">
                      <Sparkles size={12} /> Featured Memory
                    </span>
                    <span className="text-xs font-medium text-stone-300">{reelSlides[0].date}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white max-w-xl leading-tight">
                    {reelSlides[0].title}
                  </h3>

                  <p className="text-stone-300 text-sm font-sans max-w-lg line-clamp-2">
                    &ldquo;{reelSlides[0].quote}&rdquo;
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                    {reelSlides[0].people.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-300 font-medium">Featuring:</span>
                        <div className="flex items-center gap-1">
                          {reelSlides[0].people.map((person, i) => (
                            <div key={i} className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs text-white font-medium border border-white/30">
                              <ArtisticAvatar name={person} size="sm" />
                              <span>{person}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setReelIndex(0);
                        setIsPlayingReel(true);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1C1917] font-bold text-xs rounded-2xl border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] hover:bg-[#F5E5DC] transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Play size={16} className="fill-[#1C1917]" /> Play Memory Reel
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of All Captures as Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {reelSlides.map((card, i) => (
                  <div
                    key={card.id || i}
                    className="bg-white border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[2px_3px_0px_#1C1917] hover:-translate-y-1 transition-all cursor-pointer group"
                    onClick={() => {
                      if (onSelectCapture && card.rawCapture) {
                        onSelectCapture(card.rawCapture);
                      } else {
                        setReelIndex(i);
                        setIsPlayingReel(true);
                      }
                    }}
                  >
                    <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                      <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-[#1C1917]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                        {card.location}
                      </span>
                    </div>
                    <div className="p-4 space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#665F56]">{card.date}</span>
                      <h4 className="font-serif text-lg font-medium text-[#1C1917] line-clamp-1">{card.title}</h4>
                      <p className="text-xs text-[#665F56] font-sans line-clamp-2">{card.quote}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── TAB 2: PEOPLE & FACES ── */}
      {activeTab === "people" && (
        <div className="space-y-5">
          {peopleList.length === 0 ? (
            <div className="p-10 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-3 font-sans">
              <Users size={32} className="text-[#DE5239] mx-auto" />
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">No People Tagged Yet</h3>
              <p className="text-xs text-[#665F56] max-w-sm mx-auto">
                Mention friends or family in your journal entries (e.g. &ldquo;Went for a walk with Maya&rdquo;) to automatically see them here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {peopleList.map((person, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPerson?.(person.name)}
                  className="bg-white border-[1.5px] border-[#1C1917] p-5 rounded-3xl shadow-[2px_3px_0px_#1C1917] text-center space-y-3 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col items-center justify-center"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-[#1C1917] p-1 bg-[#F5F1E8] group-hover:scale-105 transition-transform">
                      <ArtisticAvatar name={person.name} size="lg" className="w-full h-full rounded-full" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-[#DE5239] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#1C1917] shadow-xs">
                      {person.count}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-[#1C1917] text-base">{person.name}</h4>
                    <p className="text-[11px] text-[#665F56] font-sans leading-tight mt-0.5 font-mono">{person.count} moments</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: TRIPS & PLACES ── */}
      {activeTab === "trips" && (
        <div className="space-y-5">
          {tripsList.length === 0 ? (
            <div className="p-10 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-3 font-sans">
              <MapPin size={32} className="text-[#DE5239] mx-auto" />
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">No Locations Logged Yet</h3>
              <p className="text-xs text-[#665F56] max-w-sm mx-auto">
                Mention places or attach locations when capturing memories to group your entries into trip albums!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {tripsList.map((trip, idx) => (
                <div
                  key={idx}
                  className="bg-white border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[3px_4px_0px_#1C1917] hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-stone-900">
                    <img src={trip.coverUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"} alt={trip.location} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-[#DE5239] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-black/30 flex items-center gap-1 font-mono">
                      <MapPin size={10} /> Location
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-serif text-lg font-medium text-white leading-snug">{trip.location}</h4>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between text-xs font-sans text-[#665F56]">
                    <span className="font-medium">{trip.lastDate || "Recent"}</span>
                    <span className="font-mono text-[11px] font-bold bg-[#F5F1E8] px-2 py-0.5 rounded-md border border-[#1C1917]/20">
                      {trip.count} moments
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: CUSTOM ALBUMS ── */}
      {activeTab === "albums" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#665F56] font-sans">
              Organize your entries into custom personal collections.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#DE5239] text-white rounded-xl text-xs font-bold border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] hover:bg-[#c9452d] cursor-pointer"
            >
              <FolderPlus size={14} /> Create Album
            </button>
          </div>

          {customAlbums.length === 0 ? (
            <div className="p-10 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-3xl text-center space-y-3 font-sans">
              <Layers size={32} className="text-[#DE5239] mx-auto" />
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">No Custom Albums Created</h3>
              <p className="text-xs text-[#665F56] max-w-sm mx-auto">
                Click <strong>&ldquo;Create Album&rdquo;</strong> above to start organizing your personal memories into custom collections!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {customAlbums.map((album) => (
                <div
                  key={album.id}
                  className="bg-white border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[3px_4px_0px_#1C1917] hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                    <img src={album.coverUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-[#1C1917] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono">
                      {album.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#665F56]">{album.dateRange}</span>
                      <span className="text-xs font-bold text-[#DE5239] font-mono">{album.itemCount} entries</span>
                    </div>
                    <h4 className="font-serif text-lg font-medium text-[#1C1917]">{album.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── INTERACTIVE SLIDESHOW REEL MODAL ── */}
      {isPlayingReel && reelSlides.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#1C1917] border-2 border-stone-700 rounded-3xl overflow-hidden shadow-2xl font-sans text-white">
            {/* Close Button */}
            <button
              onClick={() => setIsPlayingReel(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/60 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Mute/Unmute Ambient Audio */}
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="absolute top-4 left-4 z-20 p-2 bg-black/60 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            >
              {isAudioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{isAudioMuted ? "Muted" : "Ambient Music"}</span>
            </button>

            {/* Slideshow Image */}
            <div className="h-[26rem] w-full relative overflow-hidden bg-stone-900">
              <img
                src={reelSlides[reelIndex].imageUrl}
                alt={reelSlides[reelIndex].title}
                className="w-full h-full object-cover animate-pulse duration-[3000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-black/30" />

              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <span className="text-[11px] font-mono text-[#D97706] font-bold uppercase tracking-wider bg-black/50 px-2.5 py-0.5 rounded-full border border-[#D97706]/40">
                  {reelSlides[reelIndex].date}
                </span>
                <h3 className="font-serif text-2xl font-medium text-white">{reelSlides[reelIndex].title}</h3>
                <p className="text-sm font-serif italic text-stone-300 leading-relaxed">&ldquo;{reelSlides[reelIndex].quote}&rdquo;</p>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="p-4 bg-[#1C1917] border-t border-stone-800 flex items-center justify-between">
              <div className="flex gap-1.5">
                {reelSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReelIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === reelIndex ? "w-8 bg-[#DE5239]" : "w-3 bg-stone-700 hover:bg-stone-500"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReelIndex((prev) => (prev > 0 ? prev - 1 : reelSlides.length - 1))}
                  className="px-3 py-1.5 bg-stone-800 text-xs text-white rounded-xl border border-stone-700 hover:bg-stone-700 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setReelIndex((prev) => (prev + 1) % reelSlides.length)}
                  className="px-4 py-1.5 bg-[#DE5239] text-xs font-bold text-white rounded-xl border border-[#1C1917] hover:bg-[#c9452d] cursor-pointer"
                >
                  Next Moment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE ALBUM MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FBF9F4] border-[1.5px] border-[#1C1917] rounded-3xl p-6 shadow-[4px_6px_0px_#1C1917] font-sans space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium text-[#1C1917]">Create Custom Album</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-stone-500 hover:text-black cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">Album Title</label>
                <input
                  type="text"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="e.g. Summer Walks &amp; Coffee Talks"
                  required
                  className="w-full px-4 py-2.5 border-[1.5px] border-[#1C1917] bg-white rounded-xl text-sm font-serif focus:outline-none shadow-[2px_3px_0px_#1C1917]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">Album Category</label>
                <select
                  value={newAlbumCategory}
                  onChange={(e) => setNewAlbumCategory(e.target.value as any)}
                  className="w-full px-4 py-2 border-[1.5px] border-[#1C1917] bg-white rounded-xl text-xs font-sans font-semibold focus:outline-none"
                >
                  <option value="custom">Personal Custom Album</option>
                  <option value="trip">Trip &amp; Travel Getaway</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-stone-200 border border-[#1C1917]/20 rounded-xl text-xs font-bold text-[#665F56]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DE5239] text-white rounded-xl text-xs font-bold border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] hover:bg-[#c9452d]"
                >
                  Save Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
