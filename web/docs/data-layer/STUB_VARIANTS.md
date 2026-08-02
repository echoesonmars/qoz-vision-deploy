# Stub Variants

## Demo-rich (default)

All mock repositories read from `lib/data/stubs/` with realistic demo numbers. This is the current `registry.ts` default.

## Production-empty variant

For deployments that need correct shapes but zero/empty values:

1. Add parallel builders under `lib/data/stubs/empty/` mirroring domain stub exports (same TypeScript types, empty arrays / zero counts).
2. Point the relevant `Mock*Repository` imports at `stubs/empty/` instead of `stubs/<domain>/`.
3. Do **not** use environment variables — change imports in the mock repository file or swap a dedicated `MockEmptyPeopleRepository` in `registry.ts`.

Example (conceptual):

```typescript
// lib/data/mock-repositories/people.mock-repository.ts
import * as students from "@/lib/data/stubs/empty/people/students";
```

## Toggle location

| Goal | Edit |
|------|------|
| One domain empty | That domain's mock repository imports |
| Entire app empty | All mock repositories → `stubs/empty/` |
| Real API | `registry.ts` → `Api*Repository` |

## Director school default

`hierarchyRepo.getDefaultSchoolId()` replaces hard-coded `mockSchool.id` in client school context.
