# Registry — switching mock to real API

Edit **`lib/data/registry.ts`** only. No environment flags.

## Steps per domain

1. Implement `ApiXRepository` in `lib/data/api-repositories/index.ts` (or split into `people.api-repository.ts`, etc.).
2. Map fetch responses to existing DTOs from `lib/data/types/` or domain type files.
3. In `registry.ts`, replace the mock singleton:

```typescript
// Before
export const peopleRepo = new MockPeopleRepository();

// After
export const peopleRepo = new ApiPeopleRepository();
```

4. Grep for stray stub imports in `app/` and `components/`.
5. Backend team implements matching route (see `docs/openapi/qoz-platform.openapi.yaml`).

## Example: People domain

| Item | Location |
|------|----------|
| Contract | `IPeopleRepository` in `lib/data/contracts/index.ts` |
| Mock | `lib/data/mock-repositories/people.mock-repository.ts` |
| API skeleton | `ApiPeopleRepository` in `lib/data/api-repositories/index.ts` |
| Stubs | `lib/data/stubs/people/*` |
| Hook | `hooks/use-people-data.ts` |
| Target API | `GET /api/people/students` (planned) |

## Director dashboard (wired)

- `directorDashboardRepo` → `GET /api/director/dashboard` (Next route uses repo)
- `MockDirectorDashboardRepository` receives `hierarchyRepo` + `integrationsRepo` via constructor in registry

## Integrations note

`MockIntegrationsRepository.fetchCamerasOnlinePercent()` already calls live backend when `NEXT_PUBLIC_BACKEND_URL` is set. Other integration meta remains stubbed.

## Checklist after switch

- [ ] Types match OpenAPI schemas
- [ ] Loading/error states in hooks
- [ ] `npm run build` passes
- [ ] No imports from legacy mock paths
