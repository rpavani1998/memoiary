export interface PersonVisualIdentity {
  name: string;
  avatarBg: string;
  avatarBorder: string;
  baseDescriptor: string;
  evolvedTraits: string[];
  version: number;
  lastUpdated: string;
  role?: string;
}

export const PERSON_VISUAL_REGISTRY: Record<string, PersonVisualIdentity> = {
  maya: {
    name: "Maya",
    avatarBg: "#F5E5DC",
    avatarBorder: "#DE5239",
    baseDescriptor: "Young woman with long dark wavy hair, expressive dark brown eyes, golden brown scarf",
    evolvedTraits: ["Wears golden brown scarf", "Warm thoughtful smile", "Often carries a physical journal"],
    version: 1,
    lastUpdated: "2026-09-02T19:30:00Z",
    role: "Close Friend (London Bound)"
  },
  kabir: {
    name: "Kabir",
    avatarBg: "#E0F2FE",
    avatarBorder: "#0284C7",
    baseDescriptor: "Young man with short curly dark hair, warm friendly smile, rust-orange knit sweater",
    evolvedTraits: ["Rust-orange sweater", "Wears black wireframe glasses"],
    version: 1,
    lastUpdated: "2026-09-02T13:30:00Z",
    role: "Engineering Lead"
  },
  ananya: {
    name: "Ananya",
    avatarBg: "#FDF2D0",
    avatarBorder: "#D97706",
    baseDescriptor: "Young woman with dark hair tied in a bandana, mustard yellow cardigan, joyful laughter",
    evolvedTraits: ["Yellow bandana", "Mustard cardigan"],
    version: 1,
    lastUpdated: "2026-09-02T13:30:00Z",
    role: "Design Lead"
  },
  priya: {
    name: "Priya",
    avatarBg: "#EAE5F5",
    avatarBorder: "#6D28D9",
    baseDescriptor: "Young woman with long straight dark hair, warm radiant smile, coral top",
    evolvedTraits: ["Coral top", "Cheerful demeanor"],
    version: 1,
    lastUpdated: "2026-09-01T15:30:00Z",
    role: "College Friend (Mumbai)"
  },
  rohan: {
    name: "Rohan",
    avatarBg: "#E2EBD8",
    avatarBorder: "#4D7C0F",
    baseDescriptor: "Young man with messy brown hair, acoustic guitar, dark green jacket",
    evolvedTraits: ["Dark green jacket", "Plays acoustic guitar"],
    version: 1,
    lastUpdated: "2026-08-29T22:00:00Z",
    role: "Childhood Friend"
  },
  sarah: {
    name: "Sarah",
    avatarBg: "#F5E5DC",
    avatarBorder: "#DE5239",
    baseDescriptor: "Young woman with round glasses, soft beige sweater, contemplative smile",
    evolvedTraits: ["Round glasses", "Beige sweater"],
    version: 1,
    lastUpdated: "2026-08-31T09:00:00Z",
    role: "Co-founder / Friend"
  }
};

/**
 * Resolves the current persistent visual identity for a person.
 * Combines base facial features with evolved traits accumulated over time.
 */
export function getPersonVisualIdentity(name: string): PersonVisualIdentity {
  const normalizedKey = name.trim().toLowerCase();
  
  if (PERSON_VISUAL_REGISTRY[normalizedKey]) {
    return PERSON_VISUAL_REGISTRY[normalizedKey];
  }

  // Deterministic fallback generator for new people captured by user
  const charCodeSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorOptions = [
    { bg: "#F5E5DC", border: "#DE5239" },
    { bg: "#E2EBD8", border: "#4D7C0F" },
    { bg: "#EAE5F5", border: "#6D28D9" },
    { bg: "#FDF2D0", border: "#D97706" },
    { bg: "#E0F2FE", border: "#0284C7" }
  ];
  const chosenColor = colorOptions[charCodeSum % colorOptions.length];

  return {
    name,
    avatarBg: chosenColor.bg,
    avatarBorder: chosenColor.border,
    baseDescriptor: `Person named ${name} with warm friendly facial features`,
    evolvedTraits: ["Natural hand-drawn style"],
    version: 1,
    lastUpdated: new Date().toISOString()
  };
}
