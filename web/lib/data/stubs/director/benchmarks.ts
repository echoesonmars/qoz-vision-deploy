import type { BenchmarksBlock, DirectorPeriod } from "@/lib/director/types";

export function buildBenchmarksBlock(period: DirectorPeriod): BenchmarksBlock {
  void period;
  return {
    schoolRank: 2,
    totalSchools: 8,
    districtAvgAttendance: 84,
    attendancePercentile: 72,
    schools: [
      { id: "s147", name: "ОШ №147", attendance: 86, sorSoch: 3.68, entPass: 72, incidents: 4 },
      { id: "s152", name: "ОШ №152", attendance: 88, sorSoch: 3.74, entPass: 75, incidents: 2 },
      { id: "s131", name: "ОШ №131", attendance: 82, sorSoch: 3.55, entPass: 68, incidents: 6 },
      { id: "s118", name: "ОШ №118", attendance: 85, sorSoch: 3.61, entPass: 70, incidents: 3 },
      { id: "s205", name: "ОШ №205", attendance: 80, sorSoch: 3.48, entPass: 65, incidents: 5 },
    ],
  };
}

export const benchmarkExtendedRows = [
  { school: "ОШ №147", attendance: 86, sorSoch: 3.68, entPass: 72, incidents: 4, infrastructure: 71, districtRank: 2, cityRank: 5 },
  { school: "ОШ №152", attendance: 88, sorSoch: 3.74, entPass: 75, incidents: 2, infrastructure: 78, districtRank: 1, cityRank: 3 },
  { school: "ОШ №131", attendance: 82, sorSoch: 3.55, entPass: 68, incidents: 6, infrastructure: 65, districtRank: 5, cityRank: 9 },
  { school: "ОШ №118", attendance: 85, sorSoch: 3.61, entPass: 70, incidents: 3, infrastructure: 69, districtRank: 3, cityRank: 6 },
  { school: "ОШ №205", attendance: 80, sorSoch: 3.48, entPass: 65, incidents: 5, infrastructure: 58, districtRank: 6, cityRank: 11 },
];
