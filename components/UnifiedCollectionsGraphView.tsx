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
  CheckCircle,
  Brain,
  GitFork,
  FileText,
  Eye,
  EyeOff,
  Play,
  Compass
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
export type LayoutMode = "force" | "mindmap";

export interface GraphNode {
  id: string;
  label: string;
  type: "root" | "category" | "person" | "place" | "topic" | "moment";
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  count: number;
  lastDate?: string;
  connectedNodeIds: string[];
  captures: CaptureSession[];
  parentId?: string;
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

// Topic Normalization Helper to cluster similar micro-tags into meaningful recurring threads
function normalizeTopic(rawTopic: string): string {
  const t = rawTopic.trim().toLowerCase();

  if (t.includes("monsoon") || t.includes("rain")) return "Monsoon & Weather";
  if (t.includes("chai") || t.includes("coffee")) return "Chai & Conversations";
  if (t.includes("friendship") || t.includes("farewell") || t.includes("reunion") || t.includes("goodbye")) return "Friendship & Bonds";
  if (t.includes("london") || t.includes("travel") || t.includes("flight") || t.includes("airport") || t.includes("packing")) return "Travel & Transitions";
  if (t.includes("design") || t.includes("sketch") || t.includes("ui") || t.includes("prototype") || t.includes("craft")) return "Design & Creativity";
  if (t.includes("code") || t.includes("graph") || t.includes("entity") || t.includes("software") || t.includes("refactoring") || t.includes("architecture")) return "Tech & Architecture";
  if (t.includes("memory") || t.includes("philosophy") || t.includes("duration") || t.includes("identity") || t.includes("growth") || t.includes("time")) return "Memory & Reflections";
  if (t.includes("nature") || t.includes("trek") || t.includes("sunset") || t.includes("forest")) return "Nature & Outdoor";

  // Capitalize title case for generic topics
  return rawTopic
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function UnifiedCollectionsGraphView({
  captures = [],
  onSelectCapture,
  onSelectPerson,
  onSearchQuery
}: UnifiedCollectionsGraphViewProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "topics">("graph");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("force");
  const [filterType, setFilterType] = useState<GraphNodeType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [showInlineNotes, setShowInlineNotes] = useState(true);

  // User Custom Topics State
  const [customTopics, setCustomTopics] = useState<Array<{ name: string; description: string; createdAt: string }>>([]);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDesc, setNewTopicDesc] = useState("");
  const [topicToast, setTopicToast] = useState(false);

  // Canvas Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Physics Simulation Ref
  const animFrameRef = useRef<number | null>(null);

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

  // ── 1. EXTRACT ALL ENTITIES & CLUSTER INTO RECURRING THREADS ──
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
      (c.dimensions?.people || []).forEach((p) => {
        if (!p) return;
        const existing = personMap.get(p);
        if (existing) {
          existing.count += 1;
          if (!existing.captures.some((existingCap) => existingCap.id === c.id)) {
            existing.captures.push(c);
          }
        } else {
          personMap.set(p, { count: 1, lastDate: dateStr, captures: [c] });
        }
      });

      // Places
      (c.dimensions?.places || []).forEach((pl) => {
        if (!pl) return;
        const existing = placeMap.get(pl);
        if (existing) {
          existing.count += 1;
          if (!existing.captures.some((existingCap) => existingCap.id === c.id)) {
            existing.captures.push(c);
          }
        } else {
          placeMap.set(pl, { count: 1, lastDate: dateStr, captures: [c] });
        }
      });

      // Topics (Normalized to cluster similar micro-tags)
      (c.dimensions?.topics || []).forEach((t) => {
        if (!t || t.length < 2) return;
        const norm = normalizeTopic(t);
        const existing = topicMap.get(norm);
        if (existing) {
          existing.count += 1;
          if (!existing.captures.some((existingCap) => existingCap.id === c.id)) {
            existing.captures.push(c);
          }
        } else {
          topicMap.set(norm, { count: 1, lastDate: dateStr, captures: [c] });
        }
      });
    });

    const allNodes: GraphNode[] = [];
    const edgeMap = new Map<string, { id: string; sourceId: string; targetId: string; weight: number }>();

    const addEdge = (idA: string, idB: string, weight = 1) => {
      if (idA === idB) return;
      const key = [idA, idB].sort().join("___");
      const existing = edgeMap.get(key);
      if (existing) {
        existing.weight += weight;
      } else {
        const [sourceId, targetId] = [idA, idB].sort();
        edgeMap.set(key, { id: key, sourceId, targetId, weight });
      }
    };

    const centerX = 500;
    const centerY = 350;

    // ROOT NODE (Central Hub for Mind Map Mode)
    allNodes.push({
      id: "root_sanctuary",
      label: "Maya's Life Sanctuary",
      type: "root",
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      size: 110,
      count: captures.length,
      lastDate: "Active Journal",
      connectedNodeIds: ["cat_people", "cat_places", "cat_topics", "cat_moments"],
      captures: captures.slice(0, 10),
      colorTheme: {
        bg: "bg-[#1C1917]",
        border: "border-[#DE5239]",
        text: "text-white",
        badgeBg: "bg-[#DE5239] text-white",
        accentHex: "#DE5239"
      }
    });

    // 4 CATEGORY HUB NODES (For Mind Map Branching)
    const categoryConfigs = [
      { id: "cat_people", label: "People & Bonds", type: "category" as const, color: { bg: "bg-[#DE5239]", border: "border-[#1C1917]", text: "text-white", badgeBg: "bg-white text-[#DE5239]", accentHex: "#DE5239" } },
      { id: "cat_places", label: "Places & Spaces", type: "category" as const, color: { bg: "bg-[#4D7C0F]", border: "border-[#1C1917]", text: "text-white", badgeBg: "bg-white text-[#4D7C0F]", accentHex: "#4D7C0F" } },
      { id: "cat_topics", label: "Topics & Themes", type: "category" as const, color: { bg: "bg-[#D97706]", border: "border-[#1C1917]", text: "text-white", badgeBg: "bg-white text-[#D97706]", accentHex: "#D97706" } },
      { id: "cat_moments", label: "Key Moments", type: "category" as const, color: { bg: "bg-[#4338CA]", border: "border-[#1C1917]", text: "text-white", badgeBg: "bg-white text-[#4338CA]", accentHex: "#4338CA" } }
    ];

    categoryConfigs.forEach((cat) => {
      allNodes.push({
        id: cat.id,
        label: cat.label,
        type: cat.type,
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        size: 90,
        count: 0,
        connectedNodeIds: ["root_sanctuary"],
        parentId: "root_sanctuary",
        captures: [],
        colorTheme: cat.color
      });
      addEdge("root_sanctuary", cat.id, 2);
    });

    // Build Person Nodes
    let pIdx = 0;
    const personArray = Array.from(personMap.entries());
    personArray.forEach(([name, data]) => {
      const angle = (pIdx / Math.max(personArray.length, 1)) * 2 * Math.PI - Math.PI / 2;
      const radius = 220 + (pIdx % 3) * 45;
      const id = `person_${name.toLowerCase().replace(/\s+/g, "_")}`;

      allNodes.push({
        id,
        label: name,
        type: "person",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: Math.min(88, 64 + data.captures.length * 5),
        count: data.captures.length,
        lastDate: data.lastDate,
        connectedNodeIds: ["cat_people"],
        parentId: "cat_people",
        captures: data.captures,
        colorTheme: {
          bg: "bg-[#F5E5DC]",
          border: "border-[#DE5239]",
          text: "text-[#1C1917]",
          badgeBg: "bg-[#DE5239] text-white",
          accentHex: "#DE5239"
        }
      });
      addEdge("cat_people", id, 1);
      pIdx++;
    });

    // Build Place Nodes
    let plIdx = 0;
    const placeArray = Array.from(placeMap.entries());
    placeArray.forEach(([placeName, data]) => {
      const angle = (plIdx / Math.max(placeArray.length, 1)) * 2 * Math.PI + Math.PI / 4;
      const radius = 240 + (plIdx % 3) * 45;
      const id = `place_${placeName.toLowerCase().replace(/\s+/g, "_")}`;

      allNodes.push({
        id,
        label: placeName,
        type: "place",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: Math.min(84, 60 + data.captures.length * 4),
        count: data.captures.length,
        lastDate: data.lastDate,
        connectedNodeIds: ["cat_places"],
        parentId: "cat_places",
        captures: data.captures,
        colorTheme: {
          bg: "bg-[#E2EBD8]",
          border: "border-[#4D7C0F]",
          text: "text-[#1C1917]",
          badgeBg: "bg-[#4D7C0F] text-white",
          accentHex: "#4D7C0F"
        }
      });
      addEdge("cat_places", id, 1);
      plIdx++;
    });

    // Build Topic Nodes (Filtered to topics with >= 2 distinct captures or user custom defined topics)
    let tIdx = 0;
    const topicArray = Array.from(topicMap.entries())
      .filter(([topicName, data]) => data.captures.length >= 2 || customTopics.some((ct) => ct.name.toLowerCase() === topicName.toLowerCase()))
      .sort((a, b) => b[1].captures.length - a[1].captures.length)
      .slice(0, 16);

    topicArray.forEach(([topicName, data]) => {
      const angle = (tIdx / Math.max(topicArray.length, 1)) * 2 * Math.PI + Math.PI / 3;
      const radius = 260 + (tIdx % 2) * 50;
      const id = `topic_${topicName.toLowerCase().replace(/\s+/g, "_")}`;

      allNodes.push({
        id,
        label: topicName,
        type: "topic",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: Math.min(82, 58 + data.captures.length * 4),
        count: data.captures.length,
        lastDate: data.lastDate,
        connectedNodeIds: ["cat_topics"],
        parentId: "cat_topics",
        captures: data.captures,
        colorTheme: {
          bg: "bg-[#FEF3C7]",
          border: "border-[#D97706]",
          text: "text-[#78350F]",
          badgeBg: "bg-[#D97706] text-white",
          accentHex: "#D97706"
        }
      });
      addEdge("cat_topics", id, 1);
      tIdx++;
    });

    // Build Key Moment Nodes
    captures.slice(0, 8).forEach((c, mIdx) => {
      const angle = (mIdx / 8) * 2 * Math.PI + Math.PI / 6;
      const radius = 290 + (mIdx % 2) * 45;
      const id = `moment_${c.id}`;
      const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

      let parentEntityId = "cat_moments";
      if (c.dimensions?.people?.[0]) {
        const pId = `person_${c.dimensions.people[0].toLowerCase().replace(/\s+/g, "_")}`;
        if (allNodes.some((n) => n.id === pId)) parentEntityId = pId;
      }

      allNodes.push({
        id,
        label: c.dimensions?.title || c.content.substring(0, 22),
        type: "moment",
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: 64,
        count: 1,
        lastDate: dateStr,
        connectedNodeIds: [parentEntityId],
        parentId: parentEntityId,
        captures: [c],
        colorTheme: {
          bg: "bg-[#EEF2FF]",
          border: "border-[#4338CA]",
          text: "text-[#1C1917]",
          badgeBg: "bg-[#4338CA] text-white",
          accentHex: "#4338CA"
        }
      });
      addEdge(parentEntityId, id, 1);
    });

    // Infer Graph Co-occurrence Edges between entities across captures
    captures.forEach((c) => {
      const cPeople = (c.dimensions?.people || []).map((p) => `person_${p.toLowerCase().replace(/\s+/g, "_")}`);
      const cPlaces = (c.dimensions?.places || []).map((pl) => `place_${pl.toLowerCase().replace(/\s+/g, "_")}`);
      const cTopics = (c.dimensions?.topics || []).map((t) => `topic_${normalizeTopic(t).toLowerCase().replace(/\s+/g, "_")}`);

      const activeEntityIds = Array.from(new Set([...cPeople, ...cPlaces, ...cTopics])).filter((id) =>
        allNodes.some((n) => n.id === id)
      );

      for (let i = 0; i < activeEntityIds.length; i++) {
        for (let j = i + 1; j < activeEntityIds.length; j++) {
          addEdge(activeEntityIds[i], activeEntityIds[j], 1);
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
        count: d.captures.length,
        sampleNote: d.captures[0]?.content?.substring(0, 65) || ""
      })).sort((a, b) => b.count - a.count)
    };
  }, [captures, customTopics]);

  // Dynamic Positions State
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number; vx: number; vy: number }>>({});
  const draggingNodeIdRef = useRef<string | null>(null);
  const dragNodeOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize node positions
  useEffect(() => {
    const initialPos: Record<string, { x: number; y: number; vx: number; vy: number }> = {};
    baseNodes.forEach((n) => {
      initialPos[n.id] = { x: n.x, y: n.y, vx: 0, vy: 0 };
    });
    setNodePositions(initialPos);
  }, [baseNodes]);

  // ── 2. FORCE-DIRECTED PHYSICS ENGINE ──
  const stepPhysicsSimulation = useCallback(() => {
    setNodePositions((prevPos) => {
      const nextPos: Record<string, { x: number; y: number; vx: number; vy: number }> = { ...prevPos };
      const nodeIds = Object.keys(nextPos);
      if (nodeIds.length === 0) return prevPos;

      const centerX = 500;
      const centerY = 350;
      const repelStrength = 48000;
      const springStrength = 0.035;
      const gravityStrength = 0.012;
      const damping = 0.80;

      // Repulsion between all pairs
      for (let i = 0; i < nodeIds.length; i++) {
        const idA = nodeIds[i];
        if (idA === "root_sanctuary") continue;
        const posA = nextPos[idA];
        const nodeA = baseNodes.find((n) => n.id === idA);
        if (!posA || !nodeA) continue;

        for (let j = i + 1; j < nodeIds.length; j++) {
          const idB = nodeIds[j];
          if (idB === "root_sanctuary") continue;
          const posB = nextPos[idB];
          const nodeB = baseNodes.find((n) => n.id === idB);
          if (!posB || !nodeB) continue;

          let dx = posB.x - posA.x;
          let dy = posB.y - posA.y;
          let distSq = dx * dx + dy * dy + 1;
          let dist = Math.sqrt(distSq);

          // Hard Collision Prevention
          const minDist = (nodeA.size + nodeB.size) / 2 + 50;
          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            if (idA !== draggingNodeIdRef.current) {
              posA.x -= nx * overlap * 0.5;
              posA.y -= ny * overlap * 0.5;
            }
            if (idB !== draggingNodeIdRef.current) {
              posB.x += nx * overlap * 0.5;
              posB.y += ny * overlap * 0.5;
            }
            dist = minDist;
          }

          const force = repelStrength / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (idA !== draggingNodeIdRef.current) {
            posA.vx -= fx;
            posA.vy -= fy;
          }
          if (idB !== draggingNodeIdRef.current) {
            posB.vx += fx;
            posB.vy += fy;
          }
        }
      }

      // Spring Attraction along co-occurrence edges
      edges.forEach((edge) => {
        if (edge.sourceId.startsWith("cat_") || edge.targetId.startsWith("cat_")) return;
        if (edge.sourceId === "root_sanctuary" || edge.targetId === "root_sanctuary") return;

        const posA = nextPos[edge.sourceId];
        const posB = nextPos[edge.targetId];
        if (!posA || !posB) return;

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
        const restLength = 230;
        const delta = dist - restLength;

        const fx = (dx / dist) * delta * springStrength;
        const fy = (dy / dist) * delta * springStrength;

        if (edge.sourceId !== draggingNodeIdRef.current) {
          posA.vx += fx;
          posA.vy += fy;
        }
        if (edge.targetId !== draggingNodeIdRef.current) {
          posB.vx -= fx;
          posB.vy -= fy;
        }
      });

      // Gravity towards center
      nodeIds.forEach((id) => {
        if (id === "root_sanctuary" || id === draggingNodeIdRef.current) return;
        const pos = nextPos[id];
        if (!pos) return;

        pos.vx += (centerX - pos.x) * gravityStrength;
        pos.vy += (centerY - pos.y) * gravityStrength;

        pos.vx *= damping;
        pos.vy *= damping;
        pos.x += pos.vx;
        pos.y += pos.vy;
      });

      return nextPos;
    });
  }, [edges, baseNodes]);

  const triggerPhysicsBurst = useCallback(() => {
    let count = 0;
    const runStep = () => {
      stepPhysicsSimulation();
      count++;
      if (count < 100) {
        animFrameRef.current = requestAnimationFrame(runStep);
      }
    };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(runStep);
  }, [stepPhysicsSimulation]);

  // ── 3. MIND MAP LAYOUT ENGINE ──
  const applyMindMapLayout = useCallback(() => {
    const nextPos: Record<string, { x: number; y: number; vx: number; vy: number }> = {};
    const centerX = 500;
    const centerY = 350;

    // Root Hub
    nextPos["root_sanctuary"] = { x: centerX, y: centerY, vx: 0, vy: 0 };

    // 4 Category Hubs positioned in 4 quadrants
    const catPositions = [
      { id: "cat_people", x: centerX - 250, y: centerY - 170 },
      { id: "cat_places", x: centerX + 250, y: centerY - 170 },
      { id: "cat_topics", x: centerX - 250, y: centerY + 170 },
      { id: "cat_moments", x: centerX + 250, y: centerY + 170 }
    ];

    catPositions.forEach((cat) => {
      nextPos[cat.id] = { x: cat.x, y: cat.y, vx: 0, vy: 0 };
    });

    // Sub-entities branch off their respective category hub
    const entityTypes = [
      { type: "person", hubId: "cat_people", baseAngle: Math.PI * 0.8, span: Math.PI * 0.9, radius: 180 },
      { type: "place", hubId: "cat_places", baseAngle: -Math.PI * 0.3, span: Math.PI * 0.9, radius: 180 },
      { type: "topic", hubId: "cat_topics", baseAngle: Math.PI * 0.5, span: Math.PI * 0.9, radius: 180 },
      { type: "moment", hubId: "cat_moments", baseAngle: 0, span: Math.PI * 0.9, radius: 190 }
    ];

    entityTypes.forEach((group) => {
      const hubPos = nextPos[group.hubId];
      if (!hubPos) return;

      const groupNodes = baseNodes.filter((n) => n.type === group.type);
      const count = groupNodes.length;

      groupNodes.forEach((n, idx) => {
        const step = count > 1 ? group.span / (count - 1) : 0;
        const angle = group.baseAngle + idx * step - group.span / 2;
        const rad = group.radius + (idx % 2) * 35;

        nextPos[n.id] = {
          x: hubPos.x + Math.cos(angle) * rad,
          y: hubPos.y + Math.sin(angle) * rad,
          vx: 0,
          vy: 0
        };
      });
    });

    setNodePositions(nextPos);
  }, [baseNodes]);

  // Switch layout mode trigger
  useEffect(() => {
    if (layoutMode === "mindmap") {
      applyMindMapLayout();
    } else {
      triggerPhysicsBurst();
    }
  }, [layoutMode, applyMindMapLayout, triggerPhysicsBurst]);

  // Merge baseNodes with active positions
  const nodes = useMemo(() => {
    return baseNodes.map((n) => ({
      ...n,
      x: nodePositions[n.id]?.x ?? n.x,
      y: nodePositions[n.id]?.y ?? n.y
    }));
  }, [baseNodes, nodePositions]);

  // Filter nodes based on filterType
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (layoutMode === "mindmap" && (node.type === "root" || node.type === "category")) return true;
      if (layoutMode === "force" && (node.type === "root" || node.type === "category")) return false;
      if (filterType !== "all" && node.type !== filterType) return false;
      if (searchQuery.trim() && !node.label.toLowerCase().includes(searchQuery.toLowerCase().trim())) return false;
      return true;
    });
  }, [nodes, filterType, searchQuery, layoutMode]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Filter visible edges connecting visible nodes
  const visibleEdges = useMemo(() => {
    return edges.filter((e) => {
      if (layoutMode === "force" && (e.sourceId.startsWith("cat_") || e.targetId.startsWith("cat_") || e.sourceId === "root_sanctuary" || e.targetId === "root_sanctuary")) {
        return false;
      }
      return filteredNodeIds.has(e.sourceId) && filteredNodeIds.has(e.targetId);
    });
  }, [edges, filteredNodeIds, layoutMode]);

  // Active Focus Node & Connections
  const activeFocusId = selectedNodeId || hoveredNodeId;
  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);

  // Unique De-duplicated Captures for Selected Node
  const selectedNodeUniqueCaptures = useMemo(() => {
    if (!selectedNode) return [];
    const map = new Map<string, CaptureSession>();
    selectedNode.captures.forEach((c) => map.set(c.id, c));
    return Array.from(map.values());
  }, [selectedNode]);

  const connectedToActive = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const node = nodes.find((n) => n.id === activeFocusId);
    return new Set<string>([activeFocusId, ...(node?.connectedNodeIds || [])]);
  }, [activeFocusId, nodes]);

  // ── MOUSE & DRAG HANDLERS ──
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof SVGElement || (e.target as HTMLElement).id === "canvas-bg") {
      setIsPanningCanvas(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    draggingNodeIdRef.current = nodeId;
    const pos = nodePositions[nodeId] || { x: 500, y: 350, vx: 0, vy: 0 };
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
        [nodeId]: { ...(prev[nodeId] || { vx: 0, vy: 0 }), x: newX, y: newY, vx: 0, vy: 0 }
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

  // Zoom Controls
  const zoomIn = () => setZoom((z) => Math.min(2.5, z + 0.2));
  const zoomOut = () => setZoom((z) => Math.max(0.3, z - 0.2));
  const resetCanvas = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
    setSearchQuery("");
    if (layoutMode === "mindmap") {
      applyMindMapLayout();
    } else {
      triggerPhysicsBurst();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((z) => Math.min(2.5, Math.max(0.3, z * zoomFactor)));
  };

  return (
    <div className="w-full font-sans space-y-5 pb-32">
      {/* ── HEADER & MAIN TAB SWITCHER ── */}
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
            <Share2 size={14} /> Interactive Graph &amp; Mind Map
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
          {/* ── TOOLBAR: LAYOUT SELECTOR + FILTERS + INLINE NOTES TOGGLE ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F0] p-2.5 rounded-2xl border border-[#1C1917]/15 shadow-xs">
            {/* Layout Mode Segment Selector */}
            <div className="flex bg-white border border-[#1C1917]/20 p-0.5 rounded-xl shadow-2xs">
              <button
                onClick={() => setLayoutMode("force")}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  layoutMode === "force"
                    ? "bg-[#1C1917] text-white shadow-xs"
                    : "text-[#665F56] hover:text-[#1C1917]"
                }`}
              >
                <GitFork size={13} className="text-[#DE5239]" /> Physics Constellation
              </button>
              <button
                onClick={() => setLayoutMode("mindmap")}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  layoutMode === "mindmap"
                    ? "bg-[#1C1917] text-white shadow-xs"
                    : "text-[#665F56] hover:text-[#1C1917]"
                }`}
              >
                <Brain size={13} className="text-[#D97706]" /> Radial Mind Map
              </button>
            </div>

            {/* Entity Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase font-bold text-[#665F56] mr-1 flex items-center gap-1">
                <Filter size={12} /> Filter:
              </span>
              {[
                { type: "all", label: `All (${nodes.filter((n) => n.type !== "root" && n.type !== "category").length})`, icon: Layers },
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
                        ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917]"
                        : "bg-white text-[#1C1917] border border-[#1C1917]/20 hover:bg-[#F5E5DC]"
                    }`}
                  >
                    <Icon size={12} />
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Inline Notes Toggle & Canvas Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInlineNotes(!showInlineNotes)}
                title="Toggle Inline Note Cards on Canvas"
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 border border-[#1C1917]/20 cursor-pointer transition-all ${
                  showInlineNotes
                    ? "bg-[#FEF3C7] text-[#78350F] border-[#D97706]"
                    : "bg-white text-[#665F56] hover:bg-stone-50"
                }`}
              >
                {showInlineNotes ? <Eye size={13} className="text-[#D97706]" /> : <EyeOff size={13} />}
                <span>Inline Cards: {showInlineNotes ? "ON" : "OFF"}</span>
              </button>

              {/* Entity Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#665F56]" />
                <input
                  type="text"
                  placeholder="Find entity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs font-sans bg-white border border-[#1C1917]/20 rounded-xl focus:outline-none focus:border-[#DE5239] w-32 sm:w-40"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Physics Burst & Zoom Controls */}
              <div className="flex items-center bg-white border border-[#1C1917]/20 rounded-xl p-0.5 shadow-xs">
                {layoutMode === "force" && (
                  <button
                    onClick={triggerPhysicsBurst}
                    title="Auto-Arrange Graph Physics"
                    className="p-1.5 text-[#DE5239] hover:bg-[#F5E5DC] rounded-lg cursor-pointer"
                  >
                    <Play size={14} />
                  </button>
                )}
                <button onClick={zoomOut} title="Zoom Out" className="p-1.5 text-[#1C1917] hover:bg-[#F5E5DC] rounded-lg cursor-pointer">
                  <ZoomOut size={14} />
                </button>
                <span className="text-[10px] font-mono font-bold px-1 text-[#665F56]">{Math.round(zoom * 100)}%</span>
                <button onClick={zoomIn} title="Zoom In" className="p-1.5 text-[#1C1917] hover:bg-[#F5E5DC] rounded-lg cursor-pointer">
                  <ZoomIn size={14} />
                </button>
                <button onClick={resetCanvas} title="Reset View" className="p-1.5 text-[#DE5239] hover:bg-[#F5E5DC] rounded-lg cursor-pointer border-l border-stone-200">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ── HIGHLY VISIBLE & PERFECTLY ALIGNED CANVAS ── */}
          <div
            ref={containerRef}
            id="canvas-bg"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className={`relative w-full h-[38rem] sm:h-[42rem] bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-3xl overflow-hidden shadow-[4px_6px_0px_#1C1917] select-none ${
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
              {/* SVG LINK EDGES - EXACT 1:1 ALIGNMENT WITH HTML NODES */}
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                {visibleEdges.map((edge) => {
                  const source = nodes.find((n) => n.id === edge.sourceId);
                  const target = nodes.find((n) => n.id === edge.targetId);
                  if (!source || !target) return null;

                  const isConnectedToActive =
                    activeFocusId && (edge.sourceId === activeFocusId || edge.targetId === activeFocusId);
                  const isHoveredEdge = hoveredEdgeId === edge.id;
                  const isHighlighted = isConnectedToActive || isHoveredEdge;

                  const isMindmapTree = source.type === "root" || target.type === "root" || source.type === "category" || target.type === "category";

                  const strokeColor = isHighlighted
                    ? "#DE5239"
                    : isMindmapTree
                    ? "#D97706"
                    : "#665F56";

                  const strokeWidth = isHighlighted
                    ? 3.8
                    : isMindmapTree
                    ? 2.5
                    : Math.max(1.5, Math.min(3.2, 1.0 + edge.weight * 0.5));

                  const strokeOpacity = activeFocusId
                    ? isHighlighted ? 1.0 : 0.12
                    : isHoveredEdge ? 1.0 : 0.65;

                  // Curved Bezier calculation
                  const midX = (source.x + target.x) / 2;
                  const midY = (source.y + target.y) / 2;
                  const dx = target.x - source.x;
                  const dy = target.y - source.y;
                  const norm = Math.sqrt(dx * dx + dy * dy) || 1;
                  const curvature = isMindmapTree ? 0 : 20;
                  const ctrlX = midX - (dy / norm) * curvature;
                  const ctrlY = midY + (dx / norm) * curvature;

                  const pathD = `M ${source.x} ${source.y} Q ${ctrlX} ${ctrlY} ${target.x} ${target.y}`;

                  return (
                    <g key={edge.id} className="transition-all duration-150">
                      {/* Invisible thick hover target area */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={16}
                        className="cursor-pointer pointer-events-auto"
                        onMouseEnter={() => setHoveredEdgeId(edge.id)}
                        onMouseLeave={() => setHoveredEdgeId(null)}
                      />

                      {/* Visible Curved Bezier Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeOpacity={strokeOpacity}
                        strokeDasharray={isHighlighted || isMindmapTree ? "none" : "5 4"}
                        style={{ transition: "stroke 0.2s, stroke-width 0.2s, stroke-opacity 0.2s" }}
                      />

                      {/* Edge Connection Weight Badge */}
                      {isHighlighted && !isMindmapTree && (
                        <g transform={`translate(${ctrlX}, ${ctrlY})`}>
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

              {/* INTERACTIVE GRAPH & MIND MAP BUBBLE NODES */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isInFocusGroup = activeFocusId ? connectedToActive.has(node.id) : true;

                const opacityClass = isInFocusGroup ? "opacity-100" : "opacity-25 blur-[0.3px]";
                const isPerson = node.type === "person";
                const isPlace = node.type === "place";
                const isTopic = node.type === "topic";
                const isRoot = node.type === "root";
                const isCategory = node.type === "category";

                return (
                  <div key={node.id}>
                    {/* BUBBLE NODE */}
                    <div
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
                      className={`absolute rounded-full border-[2.5px] border-[#1C1917] flex flex-col items-center justify-center p-2 text-center cursor-grab active:cursor-grabbing transition-all duration-200 ${node.colorTheme.bg} ${opacityClass} ${
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
                      {isRoot ? (
                        <div className="w-8 h-8 rounded-full bg-[#DE5239] text-white flex items-center justify-center mb-0.5 text-xs font-bold shadow-xs animate-pulse">
                          <Compass size={16} />
                        </div>
                      ) : isCategory ? (
                        <div className="w-7 h-7 rounded-full bg-white text-[#1C1917] flex items-center justify-center mb-0.5 text-xs font-bold shadow-xs">
                          {node.id === "cat_people" ? <Users size={14} className="text-[#DE5239]" /> : node.id === "cat_places" ? <MapPin size={14} className="text-[#4D7C0F]" /> : node.id === "cat_topics" ? <Sparkles size={14} className="text-[#D97706]" /> : <BookOpen size={14} className="text-[#4338CA]" />}
                        </div>
                      ) : isPerson ? (
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
                        <div className="w-5 h-5 rounded-full bg-[#4338CA] text-white flex items-center justify-center mb-0.5 text-[9px] font-bold shadow-xs">
                          <BookOpen size={10} />
                        </div>
                      )}

                      {/* Node Label */}
                      <span className={`font-serif text-[11px] font-bold leading-tight line-clamp-1 ${node.colorTheme.text}`}>
                        {node.label}
                      </span>

                      {/* Count Badge */}
                      {!isRoot && !isCategory && (
                        <span className={`mt-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-black/10 ${node.colorTheme.badgeBg}`}>
                          {node.count} {node.count === 1 ? "entry" : "entries"}
                        </span>
                      )}
                    </div>

                    {/* ── INLINE FLOATING NOTE CARDS ATTACHED TO CANVAS NODES ── */}
                    {showInlineNotes && (isSelected || isHovered) && node.captures.length > 0 && !isRoot && !isCategory && (
                      <div
                        className="absolute z-40 w-64 bg-white border-[1.5px] border-[#1C1917] rounded-2xl p-3 shadow-[4px_6px_0px_#1C1917] pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150"
                        style={{
                          left: `${node.x + node.size / 2 + 15}px`,
                          top: `${node.y - 40}px`
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Pointer Arrow */}
                        <div className="absolute -left-2 top-6 w-3 h-3 bg-white border-l-[1.5px] border-b-[1.5px] border-[#1C1917] rotate-45" />

                        <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-1.5 mb-1.5">
                          <span className="text-[10px] font-mono uppercase font-bold text-[#DE5239] flex items-center gap-1">
                            <FileText size={11} /> Attached Memory Note
                          </span>
                          <span className="text-[9px] font-mono text-[#665F56]">
                            {node.captures[0]?.createdAt ? new Date(node.captures[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                          </span>
                        </div>

                        <h4 className="font-serif text-xs font-bold text-[#1C1917] line-clamp-1 mb-1">
                          {node.captures[0]?.dimensions?.title || node.captures[0]?.content.substring(0, 30)}
                        </h4>
                        <p className="text-[11px] font-sans text-[#665F56] italic line-clamp-2 leading-snug">
                          &ldquo;{node.captures[0]?.content}&rdquo;
                        </p>

                        <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[9px] font-mono text-[#665F56]">
                            {node.captures.length > 1 ? `Shared across ${node.captures.length} distinct memories` : "Exclusive to 1 memory"}
                          </span>
                          <button
                            onClick={() => onSelectCapture?.(node.captures[0])}
                            className="text-[10px] font-sans font-bold text-[#DE5239] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            Read Full <ArrowUpRight size={10} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Canvas Guide & Controls Legend */}
            <div className="absolute bottom-3 left-3 pointer-events-none bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-[#1C1917]/20 text-[10px] font-mono text-[#1C1917] flex items-center gap-2 shadow-xs">
              <Move size={13} className="text-[#DE5239]" />
              <span>
                <strong>{layoutMode === "mindmap" ? "Radial Mind Map View" : "Physics Constellation View"}</strong> · Drag nodes to arrange · Scroll to zoom
              </span>
            </div>
          </div>

          {/* ── NODE INSPECTOR OVERLAY DRAWER ── */}
          {selectedNode && selectedNode.type !== "root" && selectedNode.type !== "category" && (
            <div className="p-5 bg-white border-[1.5px] border-[#1C1917] rounded-3xl shadow-[4px_6px_0px_#1C1917] space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between border-b border-[#1C1917]/15 pb-3">
                <div className="flex items-center gap-3">
                  {selectedNode.type === "person" ? (
                    <ArtisticAvatar name={selectedNode.label} size="md" className="w-10 h-10 rounded-full border border-[#1C1917] shadow-xs" />
                  ) : (
                    <div className={`w-10 h-10 rounded-2xl border border-[#1C1917] flex items-center justify-center text-white ${
                      selectedNode.type === "place" ? "bg-[#4D7C0F]" : selectedNode.type === "topic" ? "bg-[#D97706]" : "bg-[#4338CA]"
                    }`}>
                      {selectedNode.type === "place" ? <MapPin size={20} /> : selectedNode.type === "topic" ? <Sparkles size={20} /> : <BookOpen size={20} />}
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#DE5239] tracking-wider block">
                      {selectedNode.type} Entity · {selectedNodeUniqueCaptures.length} Unique Connected {selectedNodeUniqueCaptures.length === 1 ? "Memory" : "Memories"}
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
                      if (!connNode || connNode.type === "root" || connNode.type === "category") return null;
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

              {/* Unique Connected Captures List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-sans font-bold text-[#665F56] block">
                  Journal Entries &amp; Memories mentioning &ldquo;{selectedNode.label}&rdquo; ({selectedNodeUniqueCaptures.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {selectedNodeUniqueCaptures.map((c) => (
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
                            className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 p-1 transition-opacity cursor-pointer"
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

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[#D97706] font-bold block">
                          ✓ Active AI Categorization Rule
                        </span>
                        <button
                          onClick={() => {
                            setSearchQuery(t.name);
                            setActiveTab("graph");
                          }}
                          className="text-[10px] font-sans font-bold text-[#1C1917] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          Focus in Graph <ArrowUpRight size={10} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Extracted Topics Section */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-[#665F56] tracking-wider block">
              🤖 AI Extracted Recurring Thought Threads ({topicList.length})
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
                      {item.count} {item.count === 1 ? "memory" : "memories"}
                    </span>
                  </div>
                  <p className="text-xs font-sans text-[#665F56] italic line-clamp-2">
                    &ldquo;{item.sampleNote}&rdquo;
                  </p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setSearchQuery(item.topic);
                        setActiveTab("graph");
                      }}
                      className="text-[10px] font-sans font-bold text-[#DE5239] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Focus in Graph <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
