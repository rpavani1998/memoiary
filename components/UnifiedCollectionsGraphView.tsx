"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Users,
  MapPin,
  BookOpen,
  Search,
  Share2,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Layers,
  ArrowUpRight,
  Move,
  Plus,
  Tag,
  CheckCircle
} from "lucide-react";
import { CaptureSession } from "@/lib/memory-engine/types";
import { ArtisticAvatar } from "./ArtisticAvatar";

interface UnifiedCollectionsGraphViewProps {
  captures: CaptureSession[];
  onSelectCapture?: (capture: CaptureSession) => void;
  onSelectPerson?: (personName: string) => void;
  onSearchQuery?: (query: string) => void;
}

export type GraphNodeType = "all" | "person" | "place" | "topic" | "moment";

export interface GraphNode {
  id: string;
  label: string;
  type: "person" | "place" | "topic" | "moment";
  x: number;
  y: number;
  size: number;
  count: number;
  lastDate?: string;
  connectedNodeIds: string[];
  captures: CaptureSession[];
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    accentHex: string;
  };
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  weight: number;
}

export function UnifiedCollectionsGraphView({
  captures = [],
  onSelectCapture,
  onSelectPerson,
  onSearchQuery
}: UnifiedCollectionsGraphViewProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "topics">("graph");
  const [filterType, setFilterType] = useState<GraphNodeType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  // User Custom Topics State (persisted to localStorage)
  const [customTopics, setCustomTopics] = useState<Array<{ name: string; description: string; createdAt: string }>>([]);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");
  const [topicToast, setTopicToast] = useState(false);

  // Load user custom topics from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("memoiary_user_custom_topics");
      if (saved) {
        setCustomTopics(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load custom topics", e);
    }
  }, []);

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const topicObj = {
      name: newTopicName.trim(),
      description: newTopicDesc.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [topicObj, ...customTopics.filter((t) => t.name.toLowerCase() !== topicObj.name.toLowerCase())];
    setCustomTopics(updated);
    try {
      localStorage.setItem("memoiary_user_custom_topics", JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save custom topic", e);
    }

    setNewTopicName("");
    setNewTopicDesc("");
    setIsAddTopicModalOpen(false);
    setTopicToast(true);
    setTimeout(() => setTopicToast(false), 3000);
  };

  const handleRemoveCustomTopic = (topicName: string) => {
    const updated = customTopics.filter((t) => t.name.toLowerCase() !== topicName.toLowerCase());
    setCustomTopics(updated);
    try {
      localStorage.setItem("memoiary_user_custom_topics", JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save custom topic removal", e);
    }
  };

  // Dynamic Node Positions State (allows individual node dragging!)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const draggingNodeIdRef = useRef<string | null>(null);
  const dragNodeOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. EXTRACT ALL ENTITIES & BUILD GRAPH NETWORK
  const { baseNodes, edges, topicList } = useMemo(() => {
    const personMap = new Map<string, { count: number; lastDate: string; captures: CaptureSession[] }>();
    const placeMap = new Map<string, { count: number; lastDate: string; captures: CaptureSession[] }>();
    const topicMap = new Map<string, { count: number; lastDate: string; captures: CaptureSession[] }>();

    // Ensure custom user topics are populated in topicMap
    customTopics.forEach((ct) => {
      topicMap.set(ct.name, { count: 0, lastDate: "User Defined", captures: [] });
    });

    captures.forEach((c) => {
      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

      // People
      const people = c.dimensions?.people || [];
      people.forEach((p) => {
        if (!p) return;
        const existing = personMap.get(p);
        if (existing) {
          existing.count += 1;
          existing.captures.push(c);
        } else {
          personMap.set(p, { count: 1, lastDate: dateStr, captures: [c] });
        }
      });

      // Places
      const places = c.dimensions?.places || [];
      places.forEach((pl) => {
        if (!pl) return;
        const existing = placeMap.get(pl);
        if (existing) {
          existing.count += 1;
          existing.captures.push(c);
        } else {
          placeMap.set(pl, { count: 1, lastDate: dateStr, captures: [c] });
        }
      });

      // Topics
      const topics = c.dimensions?.topics || [];
      topics.forEach((t) => {
        if (!t || t.length < 2) return;
        const existing = topicMap.get(t);
        if (existing) {
          existing.count += 1;
          existing.captures.push(c);
        } else {
          topicMap.set(t, { count: 1, lastDate: dateStr, captures: [c] });
        }
      });
    });

    const allNodes: GraphNode[] = [];
    const edgeMap = new Map<string, { id: string; sourceId: string; targetId: string; weight: number }>();

    const addEdge = (idA: string, idB: string) => {
      if (idA === idB) return;
      const key = [idA, idB].sort().join("___");
      const existing = edgeMap.get(key);
      if (existing) {
        existing.weight += 1;
      } else {
        const [sourceId, targetId] = [idA, idB].sort();
        edgeMap.set(key, { id: key, sourceId, targetId, weight: 1 });
      }
    };

    // Center canvas origin
    const centerX = 500;
    const centerY = 340;

    // Build Person Nodes (Inner Ring)
    let pIdx = 0;
    const personArray = Array.from(personMap.entries());
    personArray.forEach(([name, data]) => {
      const angle = (pIdx / Math.max(personArray.length, 1)) * 2 * Math.PI - Math.PI / 2;
      const radius = 140 + (pIdx % 2) * 35;
      const id = `person_${name.toLowerCase().replace(/\s+/g, "_")}`;

      allNodes.push({
        id,
        label: name,
        type: "person",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: Math.min(90, 68 + data.count * 4),
        count: data.count,
        lastDate: data.lastDate,
        connectedNodeIds: [],
        captures: data.captures,
        colorTheme: {
          bg: "bg-[#F5E5DC]",
          border: "border-[#DE5239]",
          text: "text-[#1C1917]",
          badgeBg: "bg-[#DE5239] text-white",
          accentHex: "#DE5239"
        }
      });
      pIdx++;
    });

    // Build Place Nodes (Middle Ring)
    let plIdx = 0;
    const placeArray = Array.from(placeMap.entries());
    placeArray.forEach(([placeName, data]) => {
      const angle = (plIdx / Math.max(placeArray.length, 1)) * 2 * Math.PI + Math.PI / 4;
      const radius = 270 + (plIdx % 3) * 30;
      const id = `place_${placeName.toLowerCase().replace(/\s+/g, "_")}`;

      allNodes.push({
        id,
        label: placeName,
        type: "place",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * (radius * 0.8),
        size: Math.min(85, 62 + data.count * 3),
        count: data.count,
        lastDate: data.lastDate,
        connectedNodeIds: [],
        captures: data.captures,
        colorTheme: {
          bg: "bg-[#E2EBD8]",
          border: "border-[#4D7C0F]",
          text: "text-[#1C1917]",
          badgeBg: "bg-[#4D7C0F] text-white",
          accentHex: "#4D7C0F"
        }
      });
      plIdx++;
    });

    // Build Topic Nodes (Outer Ring)
    let tIdx = 0;
    const topicArray = Array.from(topicMap.entries()).sort((a, b) => b[1].count - a[1].count).slice(0, 16);
    topicArray.forEach(([topicName, data]) => {
      const angle = (tIdx / Math.max(topicArray.length, 1)) * 2 * Math.PI + Math.PI / 3;
      const radius = 380 + (tIdx % 2) * 45;
      const id = `topic_${topicName.toLowerCase().replace(/\s+/g, "_")}`;

      allNodes.push({
        id,
        label: topicName,
        type: "topic",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * (radius * 0.75),
        size: Math.min(80, 58 + data.count * 3),
        count: data.count,
        lastDate: data.lastDate,
        connectedNodeIds: [],
        captures: data.captures,
        colorTheme: {
          bg: "bg-[#FEF3C7]",
          border: "border-[#D97706]",
          text: "text-[#78350F]",
          badgeBg: "bg-[#D97706] text-white",
          accentHex: "#D97706"
        }
      });
      tIdx++;
    });

    // Build Key Moment Nodes (Select Captures)
    captures.slice(0, 10).forEach((c, mIdx) => {
      const angle = (mIdx / 10) * 2 * Math.PI + Math.PI / 6;
      const radius = 480 + (mIdx % 2) * 40;
      const id = `moment_${c.id}`;
      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

      allNodes.push({
        id,
        label: c.dimensions?.title || c.content.substring(0, 25),
        type: "moment",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * (radius * 0.7),
        size: 64,
        count: 1,
        lastDate: dateStr,
        connectedNodeIds: [],
        captures: [c],
        colorTheme: {
          bg: "bg-white",
          border: "border-[#1C1917]",
          text: "text-[#1C1917]",
          badgeBg: "bg-[#1C1917] text-white",
          accentHex: "#1C1917"
        }
      });
    });

    // Infer Graph Edges based on co-occurrence in Captures
    captures.forEach((c) => {
      const cPeople = (c.dimensions?.people || []).map((p) => `person_${p.toLowerCase().replace(/\s+/g, "_")}`);
      const cPlaces = (c.dimensions?.places || []).map((pl) => `place_${pl.toLowerCase().replace(/\s+/g, "_")}`);
      const cTopics = (c.dimensions?.topics || []).map((t) => `topic_${t.toLowerCase().replace(/\s+/g, "_")}`);
      const cMomentId = `moment_${c.id}`;

      const activeEntityIds = [...cPeople, ...cPlaces, ...cTopics, cMomentId].filter((id) =>
        allNodes.some((n) => n.id === id)
      );

      for (let i = 0; i < activeEntityIds.length; i++) {
        for (let j = i + 1; j < activeEntityIds.length; j++) {
          addEdge(activeEntityIds[i], activeEntityIds[j]);
        }
      }
    });

    const edgesList = Array.from(edgeMap.values());

    // Connect node IDs bidirectional
    edgesList.forEach((edge) => {
      const nodeA = allNodes.find((n) => n.id === edge.sourceId);
      const nodeB = allNodes.find((n) => n.id === edge.targetId);
      if (nodeA && !nodeA.connectedNodeIds.includes(edge.targetId)) {
        nodeA.connectedNodeIds.push(edge.targetId);
      }
      if (nodeB && !nodeB.connectedNodeIds.includes(edge.sourceId)) {
        nodeB.connectedNodeIds.push(edge.sourceId);
      }
    });

    return {
      baseNodes: allNodes,
      edges: edgesList,
      topicList: Array.from(topicMap.entries()).map(([topic, d]) => ({
        topic,
        count: d.count,
        sampleNote: d.captures[0]?.content?.substring(0, 60) || ""
      })).sort((a, b) => b.count - a.count)
    };
  }, [captures]);

  // Sync initial node positions
  useEffect(() => {
    const initialPos: Record<string, { x: number; y: number }> = {};
    baseNodes.forEach((n) => {
      initialPos[n.id] = { x: n.x, y: n.y };
    });
    setNodePositions(initialPos);
  }, [baseNodes]);

  // Merge computed baseNodes with active dragged positions
  const nodes = useMemo(() => {
    return baseNodes.map((n) => ({
      ...n,
      x: nodePositions[n.id]?.x ?? n.x,
      y: nodePositions[n.id]?.y ?? n.y
    }));
  }, [baseNodes, nodePositions]);

  // Filter nodes based on filterType & searchQuery
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesType = filterType === "all" || node.type === filterType;
      const matchesQuery = !searchQuery.trim() || node.label.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesType && matchesQuery;
    });
  }, [nodes, filterType, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Filter visible edges connecting visible nodes
  const visibleEdges = useMemo(() => {
    return edges.filter((e) => filteredNodeIds.has(e.sourceId) && filteredNodeIds.has(e.targetId));
  }, [edges, filteredNodeIds]);

  // Active Focused & Highlighted Nodes
  const activeFocusId = selectedNodeId || hoveredNodeId;
  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  const connectedToActive = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const node = nodes.find((n) => n.id === activeFocusId);
    return new Set<string>([activeFocusId, ...(node?.connectedNodeIds || [])]);
  }, [activeFocusId, nodes]);

  // ── MOUSE & TOUCH DRAG / PAN HANDLERS ──
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // If clicking canvas background, start canvas pan
    if (e.target instanceof SVGElement || (e.target as HTMLElement).id === "canvas-bg") {
      setIsPanningCanvas(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    draggingNodeIdRef.current = nodeId;
    const pos = nodePositions[nodeId] || { x: 500, y: 340 };
    // Account for pan & zoom scale
    const mouseX = (e.clientX - pan.x) / zoom;
    const mouseY = (e.clientY - pan.y) / zoom;
    dragNodeOffsetRef.current = { x: mouseX - pos.x, y: mouseY - pos.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeIdRef.current) {
      const nodeId = draggingNodeIdRef.current;
      const mouseX = (e.clientX - pan.x) / zoom;
      const mouseY = (e.clientY - pan.y) / zoom;
      const newX = mouseX - dragNodeOffsetRef.current.x;
      const newY = mouseY - dragNodeOffsetRef.current.y;

      setNodePositions((prev) => ({
        ...prev,
        [nodeId]: { x: newX, y: newY }
      }));
      return;
    }

    if (isPanningCanvas) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    draggingNodeIdRef.current = null;
    setIsPanningCanvas(false);
  };

  // Zoom Helpers
  const zoomIn = () => setZoom((z) => Math.min(2.5, z + 0.2));
  const zoomOut = () => setZoom((z) => Math.max(0.3, z - 0.2));
  const resetCanvas = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
    setSearchQuery("");
    // Reset node positions back to initial layout
    const initialPos: Record<string, { x: number; y: number }> = {};
    baseNodes.forEach((n) => {
      initialPos[n.id] = { x: n.x, y: n.y };
    });
    setNodePositions(initialPos);
  };

  // Wheel Zoom Listener
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((z) => Math.min(2.5, Math.max(0.3, z * zoomFactor)));
  };

  return (
    <div className="w-full font-sans space-y-5 pb-32">
      {/* ── HEADER & TAB SWITCHER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1C1917]/15 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DE5239] flex items-center gap-1.5 font-sans">
            <Sparkles size={14} /> Autobiographical Knowledge Constellations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] mt-0.5">Life Mind Map &amp; Interactive Graph</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F5F1E8] border border-[#1C1917]/20 p-1 rounded-2xl gap-1 text-xs font-sans font-bold">
          <button
            onClick={() => setActiveTab("graph")}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "graph"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Share2 size={14} /> Interactive Graph Canvas
          </button>
          <button
            onClick={() => setActiveTab("topics")}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "topics"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <Sparkles size={14} /> All Topics ({topicList.length})
          </button>
        </div>
      </div>

      {activeTab === "graph" && (
        <div className="space-y-4">
          {/* ── TOOLBAR: ENTITY TYPE FILTERS + SEARCH & CANVAS CONTROLS ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F0] p-2.5 rounded-2xl border border-[#1C1917]/15 shadow-xs">
            {/* Entity Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase font-bold text-[#665F56] mr-1 flex items-center gap-1">
                <Filter size={12} /> Filter:
              </span>
              {[
                { type: "all", label: `All (${nodes.length})`, icon: Layers },
                { type: "person", label: "People", icon: Users },
                { type: "place", label: "Places", icon: MapPin },
                { type: "topic", label: "Topics", icon: Sparkles },
                { type: "moment", label: "Moments", icon: BookOpen }
              ].map((f) => {
                const Icon = f.icon;
                const isActive = filterType === f.type;
                return (
                  <button
                    key={f.type}
                    onClick={() => setFilterType(f.type as GraphNodeType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#1C1917] text-white shadow-[1px_2px_0px_#DE5239]"
                        : "bg-white text-[#1C1917] border border-[#1C1917]/20 hover:bg-[#F5E5DC]"
                    }`}
                  >
                    <Icon size={12} />
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Canvas Controls */}
            <div className="flex items-center gap-2">
              {/* Entity Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#665F56]" />
                <input
                  type="text"
                  placeholder="Find entity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs font-sans bg-white border border-[#1C1917]/20 rounded-xl focus:outline-none focus:border-[#DE5239] w-36 sm:w-44"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Canvas Zoom Buttons */}
              <div className="flex items-center bg-white border border-[#1C1917]/20 rounded-xl p-0.5 shadow-xs">
                <button onClick={zoomOut} title="Zoom Out" className="p-1.5 text-[#1C1917] hover:bg-[#F5E5DC] rounded-lg cursor-pointer">
                  <ZoomOut size={14} />
                </button>
                <span className="text-[10px] font-mono font-bold px-1.5 text-[#665F56]">{Math.round(zoom * 100)}%</span>
                <button onClick={zoomIn} title="Zoom In" className="p-1.5 text-[#1C1917] hover:bg-[#F5E5DC] rounded-lg cursor-pointer">
                  <ZoomIn size={14} />
                </button>
                <button onClick={resetCanvas} title="Reset View & Node Positions" className="p-1.5 text-[#DE5239] hover:bg-[#F5E5DC] rounded-lg cursor-pointer border-l border-stone-200">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ── HIGHLY VISIBLE & INTERACTIVE GRAPH CANVAS ── */}
          <div
            ref={containerRef}
            id="canvas-bg"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`relative w-full h-[34rem] sm:h-[38rem] bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[4px_6px_0px_#1C1917] select-none ${
              isPanningCanvas ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {/* Grid Dot Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1C1917_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

            {/* Transformable Canvas Container */}
            <div
              className="absolute inset-0 origin-center transition-transform duration-75"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
              }}
            >
              {/* SVG HIGH-VISIBILITY INTERACTIVE LINK EDGES */}
              <svg className="absolute inset-0 w-[2000px] h-[1600px] overflow-visible" style={{ left: -500, top: -400 }}>
                {visibleEdges.map((edge) => {
                  const source = nodes.find((n) => n.id === edge.sourceId);
                  const target = nodes.find((n) => n.id === edge.targetId);
                  if (!source || !target) return null;

                  const isConnectedToActive =
                    activeFocusId && (edge.sourceId === activeFocusId || edge.targetId === activeFocusId);
                  const isHoveredEdge = hoveredEdgeId === edge.id;
                  const isHighlighted = isConnectedToActive || isHoveredEdge;

                  // High-visibility stroke styling
                  const strokeColor = isHighlighted ? "#DE5239" : "#44403C";
                  const strokeWidth = isHighlighted
                    ? 3.5
                    : Math.max(1.8, Math.min(3.5, 1.2 + edge.weight * 0.6));
                  const strokeOpacity = activeFocusId
                    ? isHighlighted ? 1.0 : 0.12
                    : isHoveredEdge ? 1.0 : 0.75; // 75% crisp default visibility!

                  // Calculate edge midpoint for badge label
                  const midX = (source.x + target.x) / 2;
                  const midY = (source.y + target.y) / 2;

                  return (
                    <g key={edge.id} className="transition-all duration-150">
                      {/* Invisible thick hover target area for easy edge interaction */}
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="transparent"
                        strokeWidth={16}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredEdgeId(edge.id)}
                        onMouseLeave={() => setHoveredEdgeId(null)}
                      />

                      {/* Visible Crisp SVG Line */}
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeOpacity={strokeOpacity}
                        strokeDasharray={isHighlighted ? "none" : "6 4"}
                        style={{ transition: "stroke 0.2s, stroke-width 0.2s, stroke-opacity 0.2s" }}
                      />

                      {/* Edge Connection Weight Badge */}
                      {isHighlighted && (
                        <g transform={`translate(${midX}, ${midY})`}>
                          <rect
                            x={-18}
                            y={-10}
                            width={36}
                            height={20}
                            rx={10}
                            fill="#1C1917"
                            stroke="#DE5239"
                            strokeWidth={1.5}
                          />
                          <text
                            x={0}
                            y={3}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {edge.weight}x
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* DRAGGABLE & INTERACTIVE BUBBLE NODES */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isInFocusGroup = activeFocusId ? connectedToActive.has(node.id) : true;

                const opacityClass = isInFocusGroup ? "opacity-100" : "opacity-25 blur-[0.3px]";
                const isPerson = node.type === "person";
                const isPlace = node.type === "place";
                const isTopic = node.type === "topic";

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(node.id);
                      if (onSelectPerson && isPerson) {
                        onSelectPerson(node.label);
                      }
                    }}
                    className={`absolute rounded-full border-[2px] border-[#1C1917] flex flex-col items-center justify-center p-2 text-center cursor-grab active:cursor-grabbing transition-all duration-200 ${node.colorTheme.bg} ${opacityClass} ${
                      isSelected
                        ? "ring-4 ring-[#DE5239]/60 z-30 scale-115 shadow-[4px_6px_0px_#1C1917]"
                        : isHovered
                        ? "z-20 scale-110 shadow-[3px_5px_0px_#1C1917]"
                        : "z-10 shadow-[2px_3px_0px_#1C1917]"
                    }`}
                    style={{
                      left: `${node.x - node.size / 2}px`,
                      top: `${node.y - node.size / 2}px`,
                      width: `${node.size}px`,
                      height: `${node.size}px`
                    }}
                  >
                    {/* Node Header Icon / Avatar */}
                    {isPerson ? (
                      <ArtisticAvatar name={node.label} size="sm" className="w-7 h-7 rounded-full border border-[#1C1917] mb-0.5 shadow-xs" />
                    ) : isPlace ? (
                      <div className="w-5 h-5 rounded-full bg-[#4D7C0F] text-white flex items-center justify-center mb-0.5 text-[9px] font-bold shadow-xs">
                        <MapPin size={10} />
                      </div>
                    ) : isTopic ? (
                      <div className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center mb-0.5 text-[9px] font-bold shadow-xs">
                        <Sparkles size={10} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center mb-0.5 text-[9px] font-bold shadow-xs">
                        <BookOpen size={10} />
                      </div>
                    )}

                    {/* Node Label */}
                    <span className={`font-serif text-[11px] font-bold leading-tight line-clamp-1 ${node.colorTheme.text}`}>
                      {node.label}
                    </span>

                    {/* Count Badge */}
                    <span className={`mt-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-black/10 ${node.colorTheme.badgeBg}`}>
                      {node.count} {node.count === 1 ? "entry" : "entries"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Canvas Guide & Controls */}
            <div className="absolute bottom-3 left-3 pointer-events-none bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#1C1917]/20 text-[10px] font-mono text-[#1C1917] flex items-center gap-2 shadow-xs">
              <Move size={13} className="text-[#DE5239]" />
              <span><strong>Drag any node</strong> to rearrange · Scroll wheel to zoom · Click bubble for memory details</span>
            </div>
          </div>

          {/* ── NODE INSPECTOR OVERLAY DRAWER ── */}
          {selectedNode && (
            <div className="p-5 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[4px_6px_0px_#1C1917] space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between border-b border-[#1C1917]/15 pb-3">
                <div className="flex items-center gap-3">
                  {selectedNode.type === "person" ? (
                    <ArtisticAvatar name={selectedNode.label} size="md" className="w-10 h-10 rounded-full border border-[#1C1917] shadow-xs" />
                  ) : (
                    <div className={`w-10 h-10 rounded-2xl border border-[#1C1917] flex items-center justify-center text-white ${
                      selectedNode.type === "place" ? "bg-[#4D7C0F]" : selectedNode.type === "topic" ? "bg-[#D97706]" : "bg-[#1C1917]"
                    }`}>
                      {selectedNode.type === "place" ? <MapPin size={20} /> : selectedNode.type === "topic" ? <Sparkles size={20} /> : <BookOpen size={20} />}
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#DE5239] tracking-wider block">
                      {selectedNode.type} Entity · {selectedNode.count} Connected Captures
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#1C1917]">{selectedNode.label}</h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Connected Entity Badges */}
              {selectedNode.connectedNodeIds.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-sans font-bold text-[#665F56] block">Directly Connected Entities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.connectedNodeIds.map((cId) => {
                      const connNode = nodes.find((n) => n.id === cId);
                      if (!connNode) return null;
                      return (
                        <button
                          key={cId}
                          onClick={() => setSelectedNodeId(connNode.id)}
                          className={`text-xs font-sans font-medium px-2.5 py-1 rounded-xl border border-[#1C1917]/20 transition-all cursor-pointer flex items-center gap-1 ${connNode.colorTheme.bg} hover:border-[#1C1917]`}
                        >
                          <span>{connNode.label}</span>
                          <ArrowUpRight size={10} className="text-[#DE5239]" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Connected Captures List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-sans font-bold text-[#665F56] block">
                  Journal Entries &amp; Memories mentioning &ldquo;{selectedNode.label}&rdquo;:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {selectedNode.captures.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onSelectCapture?.(c)}
                      className="p-3 bg-[#FAF7F0] border border-[#1C1917]/20 rounded-2xl hover:border-[#DE5239] cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#DE5239]">
                        <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                        <span className="uppercase">{c.source}</span>
                      </div>
                      <h4 className="font-serif text-xs font-bold text-[#1C1917] line-clamp-1">
                        {c.dimensions?.title || c.content.substring(0, 30)}
                      </h4>
                      <p className="text-[11px] font-sans text-[#665F56] line-clamp-2 italic">
                        &ldquo;{c.content}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: TOPICS LIST VIEW ── */}
      {activeTab === "topics" && (
        <div className="space-y-6">
          {/* Header & Add Custom Topic Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-[1.5px] border-[#1C1917] shadow-[2px_3px_0px_#1C1917]">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917] flex items-center gap-2">
                <Tag size={18} className="text-[#DE5239]" /> Categorization Topics &amp; Themes
              </h3>
              <p className="text-xs text-[#665F56] font-sans mt-0.5">
                Define custom topics so Gemini AI automatically categorizes your future journal entries into your preferred themes!
              </p>
            </div>

            <button
              onClick={() => setIsAddTopicModalOpen(!isAddTopicModalOpen)}
              className="px-4 py-2 bg-[#DE5239] hover:bg-[#c9452d] text-white font-sans font-bold text-xs rounded-xl shadow-[1px_2px_0px_#1C1917] flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Plus size={15} />
              <span>{isAddTopicModalOpen ? "Close Form" : "Add Custom Topic"}</span>
            </button>
          </div>

          {/* Topic Added Toast */}
          {topicToast && (
            <div className="p-3 bg-[#E2EBD8] border border-[#4D7C0F] text-[#4D7C0F] rounded-2xl text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle size={16} />
              <span>Custom topic saved! Gemini AI will now prioritize categorizing relevant journal entries into this topic.</span>
            </div>
          )}

          {/* Add Custom Topic Form Drawer */}
          {isAddTopicModalOpen && (
            <form
              onSubmit={handleAddCustomTopic}
              className="p-5 bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-3xl shadow-[3px_5px_0px_#1C1917] space-y-4 animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-2">
                <h4 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#D97706]" /> Create Target Topic for AI Categorization
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C1917] block">Topic Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deep Learning, Monsoon Hikes, Health Routine..."
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#1C1917]/30 rounded-xl focus:outline-none focus:border-[#DE5239]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C1917] block">AI Guidance &amp; Keywords (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Software architecture, neural networks, reading notes..."
                    value={newTopicDesc}
                    onChange={(e) => setNewTopicDesc(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#1C1917]/30 rounded-xl focus:outline-none focus:border-[#DE5239]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="px-4 py-2 bg-white text-[#1C1917] border border-[#1C1917]/20 rounded-xl text-xs font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1917] text-white rounded-xl text-xs font-bold shadow-[1px_2px_0px_#DE5239] hover:bg-stone-800"
                >
                  Save &amp; Guide AI Categorization
                </button>
              </div>
            </form>
          )}

          {/* User Custom Defined Topics Section */}
          {customTopics.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase font-bold text-[#DE5239] tracking-wider block">
                ⭐ User Defined Topics ({customTopics.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {customTopics.map((t, idx) => {
                  const matchingCount = topicList.find((item) => item.topic.toLowerCase() === t.name.toLowerCase())?.count || 0;
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-[#FEF3C7] border-[1.5px] border-[#D97706] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-base text-[#78350F] flex items-center gap-1.5">
                          <Tag size={14} className="text-[#D97706]" /> {t.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#D97706] text-white">
                            {matchingCount} {matchingCount === 1 ? "entry" : "entries"}
                          </span>
                          <button
                            onClick={() => handleRemoveCustomTopic(t.name)}
                            title="Remove Topic"
                            className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 p-1 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      {t.description && (
                        <p className="text-xs font-sans text-[#78350F]/80 italic line-clamp-2">
                          &ldquo;{t.description}&rdquo;
                        </p>
                      )}

                      <span className="text-[9px] font-mono text-[#D97706] font-bold block pt-1">
                        ✓ Active AI Categorization Rule
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Extracted Topics Section */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-[#665F56] tracking-wider block">
              🤖 AI Extracted Topics ({topicList.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {topicList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-2 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#1C1917]">{item.topic}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F5E5DC] text-[#DE5239] border border-[#DE5239]/20">
                      {item.count} {item.count === 1 ? "entry" : "entries"}
                    </span>
                  </div>
                  <p className="text-xs font-sans text-[#665F56] italic line-clamp-2">
                    &ldquo;{item.sampleNote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
