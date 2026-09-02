"use client";

import React, { useState } from "react";
import { useJournal } from "@/lib/context/JournalContext";
import { HandDrawnIllustration } from "@/components/HandDrawnIllustration";
import { LoadingIllustration } from "@/components/LoadingIllustration";
import { ClarificationCard } from "@/components/ClarificationCard";
import { VoiceRecorderModal } from "@/components/VoiceRecorderModal";
import { TextCaptureModal } from "@/components/TextCaptureModal";
import { MemoryDetailModal, MemoryDetailData } from "@/components/MemoryDetailModal";
import { TimelineView, TimelineEntryItem } from "@/components/TimelineView";
import { PeopleView, PersonItem } from "@/components/PeopleView";
import { PlacesView, PlaceItem } from "@/components/PlacesView";
import { MemorySearch } from "@/components/MemorySearch";
import { ReflectionView } from "@/components/ReflectionView";
import { BottomNavigation, NavTab } from "@/components/BottomNavigation";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BrandStoryBanner } from "@/components/BrandStoryBanner";
import { WeavingStoryAnimation } from "@/components/WeavingStoryAnimation";
import { 
  Search as SearchIcon, 
  User as UserIcon, 
  Camera, 
  Video, 
  Paperclip, 
  Edit3, 
  ArrowRight,
  LogOut,
  Sparkles
} from "lucide-react";

export default function Page() {
  const { user, signIn, logOut, clarifications, respondToClarification } = useJournal();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [memoriesSubTab, setMemoriesSubTab] = useState<"people" | "places">("people");

  // Modal States
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isTextOpen, setIsTextOpen] = useState(false);
  const [textCaptureInitialType, setTextCaptureInitialType] = useState<"text" | "photo" | "video" | "attach">("text");
  const [activeMemoryDetail, setActiveMemoryDetail] = useState<MemoryDetailData | null>(null);
  const [isProcessingCapture, setIsProcessingCapture] = useState(false);

  // Dynamic greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning.";
    if (hour < 18) return "Good afternoon.";
    return "Good evening.";
  };

  // Pre-populated seed memories matching the spec (CU at Blue Tokai, Rahul, Hyderabad, etc.)
  const [seedMemories, setSeedMemories] = useState<MemoryDetailData[]>([
    {
      id: "mem_1",
      date: "September 1, 2026",
      title: "Met CU at Blue Tokai",
      content: "Met CU at Blue Tokai. We talked about the startup ideas and prototyping next steps. I was excited at first, but got irritated when she dismissed the idea.",
      people: ["CU"],
      place: "Blue Tokai",
      topic: "Startup",
      hasAudio: true,
    },
    {
      id: "mem_2",
      date: "September 1, 2026",
      title: "Worked on the prototype",
      content: "Worked on the prototype for the memory companion app. Refined the mobile-first editorial design system and SVG illustration component.",
      place: "Hyderabad",
      topic: "Prototype",
    },
    {
      id: "mem_3",
      date: "September 1, 2026",
      title: "Morning reflection",
      content: "Morning coffee and reflection on monthly goals. Felt focused and clear about the week's priorities.",
      topic: "Reflection",
    },
    {
      id: "mem_4",
      date: "August 28, 2026",
      title: "Coffee with Rahul",
      content: "Dinner with Rahul at Olive Bistro. Discussed team expansion plans and product vision for Q4.",
      people: ["Rahul"],
      place: "Olive Bistro",
      topic: "Expansion",
    },
    {
      id: "mem_5",
      date: "August 24, 2026",
      title: "Strategy session with Priya",
      content: "Brainstormed with Priya on international market strategy and localizing product offerings.",
      people: ["Priya"],
      place: "Mannheim",
      topic: "Strategy",
    },
  ]);

  // Active clarification card state (only populated when real entity ambiguity is detected)
  const [activeClarification, setActiveClarification] = useState<any>(
    clarifications.length > 0 ? clarifications[0] : null
  );

  // Convert seedMemories state dynamically into Timeline format
  const timelineEntries: TimelineEntryItem[] = seedMemories.map((mem, index) => {
    let timeStr = "6:42 PM";
    if (mem.date === "Just now") {
      timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (index === 0) timeStr = "6:42 PM";
    else if (index === 1) timeStr = "2:15 PM";
    else if (index === 2) timeStr = "9:20 AM";
    else timeStr = "5:00 PM";

    let dateGroupStr = "TODAY";
    if (mem.date.toLowerCase().includes("september 1")) {
      dateGroupStr = "SEPTEMBER 1";
    } else if (mem.date.toLowerCase().includes("august 28")) {
      dateGroupStr = "AUGUST 28";
    } else if (mem.date.toLowerCase().includes("august 24")) {
      dateGroupStr = "AUGUST 24";
    } else if (mem.date === "Just now") {
      dateGroupStr = "TODAY";
    } else {
      dateGroupStr = mem.date.toUpperCase();
    }

    let illustrationType: any = undefined;
    if (mem.place?.toLowerCase().includes("tokai") || mem.content.toLowerCase().includes("coffee")) {
      illustrationType = "cafe";
    } else if (mem.topic?.toLowerCase().includes("prototype") || mem.content.toLowerCase().includes("prototype")) {
      illustrationType = "notebook";
    } else if (mem.topic?.toLowerCase().includes("reflection") || mem.content.toLowerCase().includes("reflection")) {
      illustrationType = "book";
    } else if (mem.people && mem.people.length > 0) {
      illustrationType = "person_abstract";
    }

    return {
      id: mem.id,
      time: timeStr,
      dateGroup: dateGroupStr,
      title: mem.title,
      content: mem.content,
      illustration: illustrationType,
      place: mem.place,
      people: mem.people,
      topic: mem.topic,
      photoUrl: mem.photoUrl,
      hasAudio: mem.hasAudio,
    };
  });

  // People dataset matching section 13
  const [peopleData, setPeopleData] = useState<PersonItem[]>([
    {
      id: "p1",
      name: "CU",
      roleOrCompany: "Google",
      memoriesCount: 4,
      memories: [
        {
          id: "cu_1",
          date: "September 1",
          title: "Met at Blue Tokai",
          content: "Met CU at Blue Tokai. We talked about the startup ideas and prototyping next steps.",
          people: ["CU"],
          place: "Blue Tokai",
        },
        {
          id: "cu_2",
          date: "September 14",
          title: "CU messaged you",
          content: "CU sent over feedback on the design prototype. She suggested keeping the color palette warm.",
          people: ["CU"],
        },
        {
          id: "cu_3",
          date: "October 2",
          title: "Worked together",
          content: "Co-working session on user story maps and product architecture.",
          people: ["CU"],
        },
      ],
    },
    {
      id: "p2",
      name: "Rahul",
      roleOrCompany: "Co-founder",
      memoriesCount: 18,
      memories: [
        {
          id: "rahul_1",
          date: "August 28",
          title: "Dinner at Olive Bistro",
          content: "Discussed Q4 expansion roadmap and hiring priorities over dinner.",
          people: ["Rahul"],
          place: "Olive Bistro",
        },
      ],
    },
    {
      id: "p3",
      name: "Priya",
      roleOrCompany: "Product Lead",
      memoriesCount: 31,
      memories: [
        {
          id: "priya_1",
          date: "August 24",
          title: "Strategy in Mannheim",
          content: "Brainstormed localization and international expansion strategy.",
          people: ["Priya"],
          place: "Mannheim",
        },
      ],
    },
  ]);

  // Places dataset matching section 14
  const [placesData, setPlacesData] = useState<PlaceItem[]>([
    {
      id: "pl1",
      name: "Blue Tokai",
      locationDetails: "7 memories",
      memoriesCount: 7,
      memories: [
        {
          id: "bt_1",
          date: "Sep 1",
          title: "Met CU",
          content: "Met CU at Blue Tokai. We talked about the startup ideas.",
          place: "Blue Tokai",
        },
        {
          id: "bt_2",
          date: "Sep 12",
          title: "Coffee with Rahul",
          content: "Morning espresso session reviewing product analytics.",
          place: "Blue Tokai",
        },
        {
          id: "bt_3",
          date: "Oct 4",
          title: "Worked on prototype",
          content: "Spent 3 hours coding the custom illustration component.",
          place: "Blue Tokai",
        },
      ],
    },
    {
      id: "pl2",
      name: "Hyderabad",
      locationDetails: "12 memories",
      memoriesCount: 12,
      memories: [
        {
          id: "hyd_1",
          date: "Sep 1",
          title: "Worked on the prototype",
          content: "Refined the mobile-first Next.js web application architecture.",
          place: "Hyderabad",
        },
      ],
    },
    {
      id: "pl3",
      name: "Mannheim",
      locationDetails: "5 memories",
      memoriesCount: 5,
      memories: [
        {
          id: "man_1",
          date: "Aug 24",
          title: "Strategy session with Priya",
          content: "International market research and team workshops.",
          place: "Mannheim",
        },
      ],
    },
  ]);

  // Handle saving new voice or text memory
  const handleSaveMemory = async (content: string) => {
    if (!content || !content.trim()) return;

    setIsProcessingCapture(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const titleText = content.trim().split(".")[0] || "New Memory";
    const formattedTitle = titleText.length > 35 ? titleText.slice(0, 35) + "..." : titleText;

    const lower = content.toLowerCase();
    const detectedPeople: string[] = [];
    if (lower.includes("cu")) detectedPeople.push("CU");
    if (lower.includes("rahul")) detectedPeople.push("Rahul");
    if (lower.includes("priya")) detectedPeople.push("Priya");

    let detectedPlace: string | undefined = undefined;
    if (lower.includes("blue tokai")) detectedPlace = "Blue Tokai";
    else if (lower.includes("hyderabad")) detectedPlace = "Hyderabad";
    else if (lower.includes("mannheim")) detectedPlace = "Mannheim";

    const newMem: MemoryDetailData = {
      id: `mem_${Date.now()}`,
      date: "Just now",
      title: formattedTitle,
      content: content.trim(),
      people: detectedPeople.length > 0 ? detectedPeople : undefined,
      place: detectedPlace,
      topic: "Voice Journal",
      hasAudio: true,
    };

    setSeedMemories((prev) => [newMem, ...prev]);
    setIsProcessingCapture(false);

    // If person detected, also update person view
    if (detectedPeople.includes("CU")) {
      setPeopleData((prev) =>
        prev.map((p) =>
          p.name === "CU"
            ? {
                ...p,
                memoriesCount: p.memoriesCount + 1,
                memories: [
                  {
                    id: newMem.id,
                    date: "Just now",
                    title: newMem.title,
                    content: newMem.content,
                    people: ["CU"],
                    place: newMem.place,
                  },
                  ...p.memories,
                ],
              }
            : p
        )
      );
    }
  };

  const handleOpenSecondaryCapture = (type: "photo" | "video" | "attach" | "text") => {
    setTextCaptureInitialType(type);
    setIsTextOpen(true);
  };

  return (
    <div className="min-w-screen min-h-screen bg-[#FAF7F2] text-[#2B2824] flex">
      {/* Desktop Sidebar Navigation */}
      <DesktopSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCapture={() => setIsVoiceOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col max-w-4xl mx-auto px-4 sm:px-8 py-6">
        {/* Top Header */}
        <header className="flex items-center justify-between py-4 border-b border-[#E8E2D9] mb-8">
          <div className="flex items-center gap-3 md:hidden">
            <img src="/logo-mark.png" alt="Memoiary Icon" className="h-8 w-auto object-contain" />
            <span className="font-serif-editorial text-lg font-medium text-stone-900">
              Memoiary
            </span>
          </div>

          <div className="hidden md:block">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-sans-clean font-medium">
              Your Memories, Beautifully Connected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("search")}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-white/80 transition-colors cursor-pointer"
              title="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL || undefined}
                  alt={user.displayName || "User"}
                  className="w-8 h-8 rounded-full border border-[#E8E2D9]"
                />
                <button
                  onClick={logOut}
                  className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-[#E8E2D9] rounded-full text-xs font-medium text-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Processing Loading Overlay */}
        {isProcessingCapture && (
          <div className="py-12">
            <LoadingIllustration operation="saving" label="Remembering your voice..." />
          </div>
        )}

        {!isProcessingCapture && (
          <>
            {/* HOME TAB VIEW */}
            {activeTab === "home" && (
              <div className="space-y-10 pb-24">
                {/* Brand Story Animation (Dots -> Lines -> Meaningful Shape) */}
                <WeavingStoryAnimation />

                {/* Hero Section */}
                <div className="text-center space-y-6 pt-2">
                  <div className="space-y-2">
                    <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium text-stone-900 tracking-tight">
                      {getGreeting()}
                    </h2>
                    <p className="font-serif-editorial text-xl italic text-stone-600">
                      What&apos;s on your mind today?
                    </p>
                  </div>

                  {/* Central Dominant TAP TO TALK Button */}
                  <div className="py-4 flex flex-col items-center justify-center space-y-3">
                    <button
                      onClick={() => setIsVoiceOpen(true)}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#E09885] hover:bg-[#D48875] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer group"
                    >
                      <span className="text-4xl font-bold select-none group-hover:scale-110 transition-transform">
                        ◉
                      </span>
                    </button>
                    <span className="text-xs uppercase tracking-widest text-[#E09885] font-semibold font-sans-clean">
                      TAP TO TALK
                    </span>
                  </div>

                  {/* Secondary Quick Capture Options */}
                  <div className="space-y-3">
                    <p className="text-xs text-stone-400 font-serif-editorial italic">
                      or type something...
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-1">
                      <button
                        onClick={() => handleOpenSecondaryCapture("photo")}
                        className="p-3 bg-white hover:bg-[#FAF0EB] border border-[#E8E2D9] rounded-full text-stone-700 hover:text-[#E09885] transition-colors cursor-pointer shadow-2xs"
                        title="Photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenSecondaryCapture("video")}
                        className="p-3 bg-white hover:bg-[#FAF0EB] border border-[#E8E2D9] rounded-full text-stone-700 hover:text-[#E09885] transition-colors cursor-pointer shadow-2xs"
                        title="Video"
                      >
                        <Video className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenSecondaryCapture("attach")}
                        className="p-3 bg-white hover:bg-[#FAF0EB] border border-[#E8E2D9] rounded-full text-stone-700 hover:text-[#E09885] transition-colors cursor-pointer shadow-2xs"
                        title="Attach"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenSecondaryCapture("text")}
                        className="p-3 bg-white hover:bg-[#FAF0EB] border border-[#E8E2D9] rounded-full text-stone-700 hover:text-[#E09885] transition-colors cursor-pointer shadow-2xs"
                        title="Type"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lightweight Clarification UI if present (Section 17 & 18) */}
                {activeClarification && (
                  <ClarificationCard
                    clarification={activeClarification}
                    onConfirm={async () => setActiveClarification(null)}
                    onReject={async () => setActiveClarification(null)}
                    onCorrect={async () => setActiveClarification(null)}
                    onDismiss={async () => setActiveClarification(null)}
                  />
                )}

                <hr className="border-[#E8E2D9]" />

                {/* Today Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-editorial text-xl font-medium text-stone-900">
                      Today
                    </h3>
                    <button
                      onClick={() => setActiveTab("timeline")}
                      className="text-xs text-[#E09885] hover:underline font-sans-clean font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>View timeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {timelineEntries.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          setActiveMemoryDetail({
                            id: item.id,
                            date: `${item.dateGroup}, ${item.time}`,
                            title: item.title,
                            content: item.content,
                            people: item.people,
                            place: item.place,
                            hasAudio: item.hasAudio,
                          })
                        }
                        className="bg-white border border-[#E8E2D9] rounded-2xl p-5 hover:border-[#E09885]/50 transition-all cursor-pointer shadow-2xs space-y-1.5"
                      >
                        <span className="text-xs font-sans-clean text-stone-400 font-medium">
                          {item.time}
                        </span>
                        <p className="font-serif-editorial text-stone-800 text-base leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === "timeline" && <TimelineView entries={timelineEntries} />}

            {/* MEMORIES TAB SWITCHER */}
            {activeTab === "memories" && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 p-1 bg-white border border-[#E8E2D9] rounded-full max-w-xs mx-auto mb-6">
                  <button
                    onClick={() => setMemoriesSubTab("people")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                      memoriesSubTab === "people"
                        ? "bg-[#E09885] text-white shadow-2xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    People
                  </button>
                  <button
                    onClick={() => setMemoriesSubTab("places")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                      memoriesSubTab === "places"
                        ? "bg-[#E09885] text-white shadow-2xs"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    Places
                  </button>
                </div>

                {memoriesSubTab === "people" ? (
                  <PeopleView people={peopleData} />
                ) : (
                  <PlacesView places={placesData} />
                )}
              </div>
            )}

            {/* PEOPLE TAB DIRECT */}
            {activeTab === "people" && <PeopleView people={peopleData} />}

            {/* PLACES TAB DIRECT */}
            {activeTab === "places" && <PlacesView places={placesData} />}

            {/* SEARCH TAB */}
            {activeTab === "search" && <MemorySearch memories={seedMemories} />}

            {/* REFLECTION TAB */}
            {activeTab === "reflect" && <ReflectionView />}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCapture={() => setIsVoiceOpen(true)}
      />

      {/* Voice Recorder Overlay Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSaveVoice={handleSaveMemory}
      />

      {/* Secondary Text / Media Capture Modal */}
      <TextCaptureModal
        isOpen={isTextOpen}
        onClose={() => setIsTextOpen(false)}
        onSave={handleSaveMemory}
        initialType={textCaptureInitialType}
      />

      {/* Memory Detail Modal */}
      <MemoryDetailModal
        memory={activeMemoryDetail}
        onClose={() => setActiveMemoryDetail(null)}
      />
    </div>
  );
}
