import type { WebSocket } from "ws";
import { buildMockOverlay, recordLiveFrame } from "./fleet-registry.js";

export function attachLiveSession(
  clientSocket: WebSocket,
  deviceId: string,
): () => void {
  const mockTimer = setInterval(() => {
    if (clientSocket.readyState !== 1) return;
    recordLiveFrame(deviceId);
    clientSocket.send(JSON.stringify(buildMockOverlay()));
  }, 400);

  return () => {
    clearInterval(mockTimer);
  };
}
