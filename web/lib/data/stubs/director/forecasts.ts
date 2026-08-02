export const entForecastMock = {
  classLabel: "11 класс",
  passPercent: 72,
  riskGroup: 18,
  studentCount: 64,
  distribution: [
    { band: "90–100", count: 4 },
    { band: "80–89", count: 12 },
    { band: "70–79", count: 22 },
    { band: "60–69", count: 18 },
    { band: "<60", count: 8 },
  ],
};

export const modoForecastMock = {
  parallels: [
    {
      label: "4 класс",
      forecastPercent: 78,
      riskCount: 6,
      studentCount: 214,
      topGaps: ["ОРК", "Математика"],
    },
    {
      label: "9 класс",
      forecastPercent: 71,
      riskCount: 34,
      studentCount: 236,
      topGaps: ["Алгебра", "Физика", "Химия"],
    },
  ],
};
