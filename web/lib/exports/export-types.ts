export type ExportRecipientType = "ministry" | "rono" | "nis";

export type ExportFileFormat = "xlsx" | "pdf" | "zip";

export type ExportFilters = {
  year: string;
  quarter: string;
  territoryId: string;
  parallel: string;
};

export type ExportGenerateBody = ExportFilters & {
  type: ExportRecipientType;
  format: ExportFileFormat;
};

export type ExportTableSection = {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
};

export type ExportBundle = {
  type: ExportRecipientType;
  meta: {
    title: string;
    schoolLabel: string;
    territoryLabel: string;
    yearLabel: string;
    quarterLabel: string;
    generatedAt: string;
    attendancePercent: number;
    engagementIndex: number;
    classCount: number;
    rowCount: number;
  };
  sections: ExportTableSection[];
};

export type ExportKpi = {
  attendancePercent: number;
  engagementIndex: number;
  classCount: number;
  rowCount: number;
};

export type ExportPreviewRow = {
  col1: string;
  col2: string;
  col3: string;
};

export type RecentExportEntry = {
  id: string;
  type: ExportRecipientType;
  typeLabel: string;
  fileName: string;
  createdAt: string;
};
