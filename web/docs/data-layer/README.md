# Data Layer

Centralized mock and API data access for `qoz-vision-prod-web`. Demo UI stays unchanged; all fake numbers live under `lib/data/stubs/`.

## Architecture

```
app/ + components/
        ↓ hooks (client) or direct repo (server)
lib/data/registry.ts  ← single switch point
        ↓
mock-repositories/  →  stubs/
api-repositories/   →  app/api/* (future)
```

## Folder map

| Path | Role |
|------|------|
| `lib/data/contracts/` | `I*Repository` interfaces per domain |
| `lib/data/types/` | Shared DTO re-exports |
| `lib/data/stubs/` | All demo/prod-empty fake data |
| `lib/data/mock-repositories/` | Mock implementations |
| `lib/data/api-repositories/` | API skeletons (`throw new Error('Not implemented')`) |
| `lib/data/registry.ts` | Active repository instances |
| `lib/data/index.ts` | Public exports |
| `hooks/use-*-data.ts` | Client hooks wrapping repos |

## Rules

1. **No `.env` switching** — swap mock → API by editing `registry.ts` only.
2. **No direct imports** from legacy paths (`lib/director/mock`, `lib/people/*-mock`, etc.). Use `@/lib/data`, hooks, or `@/lib/data/stubs/*` for types.
3. **Live domains unchanged** — auth, incidents, lessons, live/cameras routes stay real; documented in OpenAPI Section A.
4. **UI → hooks → repo → stub/api** — server pages may call repos directly.

## Quick start

```typescript
import { directorDashboardRepo, peopleRepo } from "@/lib/data";

const dashboard = await directorDashboardRepo.getDashboard("week", schoolId);
const rows = peopleRepo.students.studentsRosterRows;
```

See also: [REGISTRY.md](./REGISTRY.md), [DOMAIN_MAP.md](./DOMAIN_MAP.md), [STUB_VARIANTS.md](./STUB_VARIANTS.md), [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md).
