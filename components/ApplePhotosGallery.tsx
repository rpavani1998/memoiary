"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Play,
  Pause,
  Plus,
  MapPin,
  Heart,
  ChevronRight,
  FolderPlus,
  Compass,
  Users,
  Image as ImageIcon,
  X,
  Volume2,
  VolumeX,
  Calendar,
  Layers
} from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";
import { CaptureSession } from "@/lib/memory-engine/types";

interface CollectionAlbum {
  id: string;
  title: string;
  category: "trip" | "person" | "custom" | "smart";
  coverUrl: string;
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

  // Custom albums state
  const [customAlbums, setCustomAlbums] = useState<CollectionAlbum[]>([
    {
      id: "alb_1",
      title: "Rooftop Conversations & Team Lunches",
      category: "smart",
      coverUrl: "/collages/daily_collage_sketch_sep2.jpg",
      itemCount: 6,
      dateRange: "Aug 29 – Sep 2, 2026",
      location: "Olive Bistro, Hyderabad",
      people: ["Kabir", "Ananya"],
      description: "Team catchups, strategic reflections, and rooftop lunches."
    },
    {
      id: "alb_2",
      title: "Sunset Walks by Lakewood Bridge",
      category: "trip",
      coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      itemCount: 4,
      dateRange: "September 2026",
      location: "Lakewood Bridge Lake",
      people: ["Maya"],
      description: "Quiet evening walks, sunset talks, and mindful reflections."
    },
    {
      id: "alb_3",
      title: "Product Milestones & Hackathons",
      category: "smart",
      coverUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      itemCount: 8,
      dateRange: "Late August 2026",
      location: "Engineering HQ",
      people: ["Kabir", "Rohan"],
      description: "Late night code sessions, architecture diagrams, and release moments."
    }
  ]);

  // Extract unique people from captures with counts
  const peopleList = React.useMemo(() => {
    const defaultPeople = [
      { name: "Maya", count: 14, role: "Close Friend & Walking Companion", avatarSeed: "Maya" },
      { name: "Kabir", count: 8, role: "Co-founder & Tech Lead", avatarSeed: "Kabir" },
      { name: "Ananya", count: 5, role: "Design Partner", avatarSeed: "Ananya" },
      { name: "Priya", count: 4, role: "Mentor & Advisor", avatarSeed: "Priya" },
      { name: "Rohan", count: 3, role: "Engineering Teammate", avatarSeed: "Rohan" }
    ];

    // Merge with people detected in actual captures
    const map = new Map<string, number>();
    captures.forEach((c) => {
      c.dimensions?.people?.forEach((p) => {
        map.set(p, (map.get(p) || 0) + 1);
      });
    });

    defaultPeople.forEach((p) => {
      if (map.has(p.name)) {
        p.count += map.get(p.name)!;
      }
    });

    return defaultPeople;
  }, [captures]);

  // Extract featured locations/trips
  const tripsList = [
    {
      id: "trip_1",
      title: "Hyderabad Culinary & Tech Meetups",
      location: "Jubilee Hills & Financial District",
      dates: "Aug 28 – Sep 3, 2026",
      momentsCount: 12,
      coverUrl: "/collages/daily_collage_sketch_sep2.jpg",
      people: ["Kabir", "Ananya", "Maya"]
    },
    {
      id: "trip_2",
      title: "Coorg Pine Forest Retreat",
      location: "Madikeri, Karnataka",
      dates: "July 2026",
      momentsCount: 9,
      coverUrl: "https://images.unsplash.com/photo-1511497584788-876761c13910?w=800&auto=format&fit=crop&q=80",
      people: ["Maya"]
    },
    {
      id: "trip_3",
      title: "Sunset Lake Promenade Walks",
      location: "Durgam Cheruvu Lake",
      dates: "Weekly Evenings",
      momentsCount: 15,
      coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      people: ["Maya", "Ananya"]
    }
  ];

  // Featured memory slides for interactive slideshow reel
  const reelSlides = [
    {
      title: "Wednesday Sunset Walk across Lakewood Bridge",
      date: "Wednesday, September 2, 2026",
      location: "Lakewood Bridge, Hyderabad",
      quote: "Talking with Maya as the orange sun reflected off the water. She reminded me how far we've come.",
      imageUrl: "/collages/daily_collage_sketch_sep2.jpg",
      people: ["Maya"]
    },
    {
      title: "Rooftop Lunch at Olive Bistro",
      date: "Wednesday, September 2, 2026",
      location: "Olive Bistro, Jubilee Hills",
      quote: "Kabir and Ananya celebrating our system launch over iced tea and pasta under the sun canopy.",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
      people: ["Kabir", "Ananya"]
    },
    {
      title: "Morning Coffee & Code Architecture",
      date: "Tuesday, September 1, 2026",
      location: "Third Wave Coffee",
      quote: "Sketching out the new memory graph engine on warm parchment stock. Everything fell into place.",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
      people: ["Kabir"]
    }
  ];

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;
    const newAlb: CollectionAlbum = {
      id: `alb_${Date.now()}`,
      title: newAlbumTitle.trim(),
      category: newAlbumCategory,
      coverUrl: "/collages/daily_collage_sketch_sep2.jpg",
      itemCount: 1,
      dateRange: "Just now",
      description: "User created personal collection."
    };
    setCustomAlbums([newAlb, ...customAlbums]);
    setNewAlbumTitle("");
    setShowCreateModal(false);
  };

  return (
    <div className="w-full font-sans space-y-6">
      {/* ── Top Header & Tab Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1C1917]/15 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DE5239] flex items-center gap-1.5 font-sans">
            <Sparkles size={14} /> Apple Photos Style Collections
          </span>
          <h2 className="font-serif text-2xl font-medium text-[#1C1917] mt-0.5">Memories &amp; Moments</h2>
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
            <Compass size={14} /> Memories
          </button>
          <button
            onClick={() => setActiveTab("people")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "people"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Users size={14} /> People &amp; Faces
          </button>
          <button
            onClick={() => setActiveTab("trips")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "trips"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <MapPin size={14} /> Trips &amp; Places
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

      {/* ── TAB 1: FEATURED MEMORIES REEL ── */}
      {activeTab === "memories" && (
        <div className="space-y-6">
          {/* iOS Style Full-Bleed Featured Hero Reel Card */}
          <div className="relative rounded-3xl overflow-hidden border-[1.5px] border-[#1C1917] shadow-[4px_6px_0px_#1C1917] group min-h-[22rem] flex flex-col justify-end bg-stone-900">
            <img
              src="/collages/daily_collage_sketch_sep2.jpg"
              alt="Featured Memory Reel"
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/40 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#DE5239] text-white px-2.5 py-1 rounded-full border border-black/30 shadow-xs flex items-center gap-1">
                  <Sparkles size={12} /> Featured Memory Reel
                </span>
                <span className="text-xs font-medium text-stone-300">September 2, 2026</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white max-w-xl leading-tight">
                Wednesday Walks &amp; Rooftop Celebrations
              </h3>

              <p className="text-stone-300 text-sm font-sans max-w-lg line-clamp-2">
                &ldquo;A day of milestones, deep talks with Maya, and celebrating team launch with Kabir and Ananya.&rdquo;
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-300 font-medium">Featuring:</span>
                  <div className="flex items-center gap-1">
                    {["Maya", "Kabir", "Ananya"].map((person, i) => (
                      <div key={i} className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs text-white font-medium border border-white/30">
                        <ArtisticAvatar name={person} size="sm" />
                        <span>{person}</span>
                      </div>
                    ))}
                  </div>
                </div>

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

          {/* Grid of Secondary Memory Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              {
                title: "On This Day 1 Month Ago",
                date: "August 2026",
                summary: "First sketch of the Memoiary narrative engine.",
                imgUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
                badge: "Flashback"
              },
              {
                title: "Quiet Morning Reflections",
                date: "August 30, 2026",
                summary: "Coffee at Third Wave with notebook and pen.",
                imgUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
                badge: "Thought"
              },
              {
                title: "Evening Sunset Promenade",
                date: "August 29, 2026",
                summary: "Walking along Durgam Cheruvu lake after sunset.",
                imgUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
                badge: "Moment"
              }
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[2px_3px_0px_#1C1917] hover:-translate-y-1 transition-all cursor-pointer group"
                onClick={() => {
                  setReelIndex(i % reelSlides.length);
                  setIsPlayingReel(true);
                }}
              >
                <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                  <img src={card.imgUrl} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-[#1C1917]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                    {card.badge}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#665F56]">{card.date}</span>
                  <h4 className="font-serif text-lg font-medium text-[#1C1917]">{card.title}</h4>
                  <p className="text-xs text-[#665F56] font-sans line-clamp-2">{card.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: PEOPLE & FACES CIRCLE GRID ── */}
      {activeTab === "people" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#665F56] font-sans">
              People detected across your memories. Click any person to explore memories featuring them.
            </p>
          </div>

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
                  <p className="text-[11px] text-[#665F56] font-sans leading-tight mt-0.5 line-clamp-2">{person.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: TRIPS & FEATURED PLACES GRID ── */}
      {activeTab === "trips" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tripsList.map((trip) => (
              <div
                key={trip.id}
                className="bg-white border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[3px_4px_0px_#1C1917] hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="h-48 w-full relative overflow-hidden bg-stone-900">
                  <img src={trip.coverUrl} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#DE5239] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-black/30 flex items-center gap-1">
                    <MapPin size={10} /> Trip &amp; Location
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono text-stone-300 block">{trip.dates}</span>
                    <h4 className="font-serif text-lg font-medium text-white leading-snug">{trip.title}</h4>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between text-xs font-sans text-[#665F56]">
                  <span className="flex items-center gap-1 text-[#1C1917] font-semibold">
                    <MapPin size={12} className="text-[#DE5239]" /> {trip.location}
                  </span>
                  <span className="font-mono text-[11px] font-bold bg-[#F5F1E8] px-2 py-0.5 rounded-md border border-[#1C1917]/20">
                    {trip.momentsCount} moments
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: CUSTOM ALBUMS & COLLECTIONS ── */}
      {activeTab === "albums" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#665F56] font-sans">
              Organize your entries into custom collections and smart albums.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#DE5239] text-white rounded-xl text-xs font-bold border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917] hover:bg-[#c9452d] cursor-pointer"
            >
              <FolderPlus size={14} /> Create Album
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {customAlbums.map((album) => (
              <div
                key={album.id}
                className="bg-white border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[3px_4px_0px_#1C1917] hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                  <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  {album.description && <p className="text-xs text-[#665F56] font-sans line-clamp-2">{album.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INTERACTIVE SLIDESHOW REEL MODAL (iOS Photos Memory Reel) ── */}
      {isPlayingReel && (
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
