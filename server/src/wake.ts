export const WAKE_NAME = "Friday";
export const LISTEN_MS = 15000;

const WAKE_ALIASES =
  "friday|fridays|freddy|freddie|freddi|frida|frieda|fryda|frydee|fryday|freiday|frighday|fridae|fridayy|priday|fry[\\s-]?day|free[\\s-]?day";

let listeningUntil = 0;

export type WakeGate =
  | { kind: "ignore" }
  | { kind: "wake" }
  | { kind: "command"; text: string };

export function normalizeHeard(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/[.,!?]+/g, " ")
    .replace(new RegExp(`\\b(${WAKE_ALIASES})\\b`, "gi"), "friday")
    .replace(/\b(hey|ok|okay|hi)\s+friday\b/g, "friday")
    .replace(/\b(lite|likes)\b/g, "lights")
    .replace(/\bgood\s+night\b/g, "goodnight")
    .replace(/\bturn of\b/g, "turn off")
    .replace(/\b(disable|disabled)\s+e\s*motion\b/g, "disable motion")
    .replace(/\b(disable|disabled)\s+emotion\b/g, "disable motion")
    .replace(/\bthis able motion\b/g, "disable motion")
    .replace(/\bdis able motion\b/g, "disable motion")
    .replace(/\bthe sable motion\b/g, "disable motion")
    .replace(/\bde[- ]?activate motion\b/g, "disable motion")
    .replace(/\bturn of motion\b/g, "disable motion")
    .replace(/\bstudy more\b/g, "study mode")
    .replace(/\bsteady mode\b/g, "study mode")
    .replace(/\bstudied mode\b/g, "study mode")
    .replace(/(\d{1,3})\s*(?:percent|per\s*cent|percentage)\b/g, "$1%")
    .replace(/(\d{1,3})\s*%/g, "$1%")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasWakeWord(text: string): boolean {
  return /\bfriday\b/.test(normalizeHeard(text));
}

export function stripWakeWord(text: string): string {
  return normalizeHeard(text).replace(/\bfriday\b/g, " ").replace(/\s+/g, " ").trim();
}

export function isListening(): boolean {
  return Date.now() < listeningUntil;
}

export function openListenWindow(): void {
  listeningUntil = Date.now() + LISTEN_MS;
}

export function closeListenWindow(): void {
  listeningUntil = 0;
}

export function consumeWakeUtterance(text: string): WakeGate {
  const said = normalizeHeard(text);
  if (!said) return { kind: "ignore" };
  const woke = /\bfriday\b/.test(said);
  const command = stripWakeWord(said);
  if (woke && command) {
    closeListenWindow();
    return { kind: "command", text: command };
  }
  if (woke) {
    openListenWindow();
    return { kind: "wake" };
  }
  if (isListening()) {
    return { kind: "command", text: said };
  }
  return { kind: "ignore" };
}

export function wantsHouseTools(text: string): boolean {
  return /\b(light|lights|lamp|lamps|bulb|bulbs|temperature|humidity|motion|weather|news|search|look up|lookup|who is|who was|what is|whats|when is|where is|play|music|song|spotify|pause|calendar|schedule|agenda|appointment|study|house status|how many)\b/i.test(
    text,
  );
}
