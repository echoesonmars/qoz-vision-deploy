export const mockCameraZoneMapping = [
  { cameraLabel: "Вход-01", zoneId: "z-entrance", zoneName: "Входная группа" },
  { cameraLabel: "Коридор-2F", zoneId: "z-corridor-2", zoneName: "Коридор 2 этажа" },
  { cameraLabel: "Столовая", zoneId: "z-canteen", zoneName: "Столовая" },
  { cameraLabel: "Двор-С", zoneId: "z-yard", zoneName: "Школьный двор" },
] as const;

export const mockMapIncidentPins = [
  { id: "sec-1", room: "Вестибюль", floor: 1, risk: "high" as const },
  { id: "sec-2", room: "Двор", floor: 0, risk: "medium" as const },
  { id: "sec-3", room: "204", floor: 2, risk: "low" as const },
];
