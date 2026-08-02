export type StreamOverlayBoxNormalized = {
  left: number;
  top: number;
  width: number;
  height: number;
  label?: string;
};

export type StreamOverlayMessage = {
  type: "overlay";
  boxes: StreamOverlayBoxNormalized[];
  caption?: string;
};

export function parseStreamMessage(raw: string): StreamOverlayMessage | null {
  try {
    const v = JSON.parse(raw) as StreamOverlayMessage;
    if (v && v.type === "overlay" && Array.isArray(v.boxes)) return v;
  } catch {
    return null;
  }
  return null;
}
