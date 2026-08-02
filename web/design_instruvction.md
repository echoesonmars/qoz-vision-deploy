# AI Agent Instructions: Vision-Based AI Grading Interface Development

**Role & Objective:**
You are an expert Frontend Developer and UI/UX Designer. Your task is to build a modern, high-aesthetic web interface for an AI-powered vision system tailored for scanning, OCR, and automated grading of handwritten STEM documents.

## 1. Technical Stack & UI Library
*   **Framework:** React (Next.js preferred) + Tailwind CSS.
*   **UI Components:** STRICTLY use **shadcn/ui**. Do not build custom complex interactive components if a shadcn/ui equivalent exists (e.g., use shadcn `Card`, `Button`, `Dialog`, `Progress`, `Tabs`, `ScrollArea`).
*   **Architecture:** Strictly Component-Based Layout. Break down every view into granular, reusable components. No monolithic files.
 USE REACT ICONS, DO NOT USE LUICIDE!

## 2. Design System & Theming
*   **Primary Color:** `#22c55e` (Tailwind `green-500`). Use this for primary buttons, active states, progress indicators, bounding box accents, and success borders.
*   **Typography:** STRICTLY use **Google Sans**. Apply it globally to the root layout.
*   **Spacing, Margins, & Paddings:** 
    *   Maintain strict consistency using standard Tailwind scale (e.g., `p-4`, `p-6`, `m-4`, `gap-4`).
    *   Do not use arbitrary values (e.g., avoid `p-[17px]`).
    *   Use `flex` or `grid` with `gap` for layout spacing instead of applying margins to individual children.
    *   All cards and containers must have consistent inner padding (e.g., `p-6`) and smooth border radii (`rounded-xl` or `rounded-2xl`).

## 3. Core Components to Implement
Develop the following modular components:

1.  **ScannerUploadZone:**
    *   A drag-and-drop area using a `shadcn/ui` Card with a dashed border.
    *   Hover/Active drag state must be highlighted with `#22c55e`.
    *   Include file upload progress UI.

2.  **VisionAnalysisCanvas (Spatial-Semantic View):**
    *   A container rendering the scanned handwritten document.
    *   Interactive overlay system: bounding boxes highlighting recognized text, mathematical formulas, and logical structures.
    *   Highlight positive/correct recognition segments using `#22c55e` with low opacity (`bg-green-500/20`).

3.  **GradingFeedbackSidebar:**
    *   A side panel utilizing shadcn `ScrollArea`.
    *   Display structured grading results, total score (using shadcn `Badge`), and step-by-step logic breakdown.
    *   Use shadcn `Tabs` to switch between views: "Raw OCR", "Logic Check", and "Final Evaluation".

## 4. Execution Rules
*   Provide clean, production-ready React code.
*   Include all necessary shadcn/ui and Lucide icon import statements.
*   Strictly adhere to the design system—no unnecessary visual clutter, prioritize a clean aesthetic where `#22c55e` guides the user's attention.
*   Output only code and essential setup instructions without conversational filler.