# OpenAPI — Qoz Platform

Spec file: [`qoz-platform.openapi.yaml`](./qoz-platform.openapi.yaml)

## View locally

**Swagger Editor (online):** paste the YAML at [editor.swagger.io](https://editor.swagger.io)

**Redocly CLI:**

```bash
npx @redocly/cli preview-docs docs/openapi/qoz-platform.openapi.yaml
```

## Structure

| Section | Content |
|---------|---------|
| Auth, Incidents, Lessons, Live, Agent | Live Next.js + backend routes (Section A) |
| Director, People, Checks, Analytics, … | Target contracts for mock domains (Section B) |

## Repository mapping

Each planned path maps to:

1. **Contract** — `lib/data/contracts/index.ts` (`I*Repository`)
2. **Mock** — `lib/data/mock-repositories/*.mock-repository.ts`
3. **API skeleton** — `lib/data/api-repositories/index.ts`
4. **Switch point** — `lib/data/registry.ts`

Example: `GET /api/director/dashboard` ↔ `IDirectorDashboardRepository.getDashboard()` ↔ `MockDirectorDashboardRepository` (active) / `ApiDirectorDashboardRepository` (future).

## Backend reference

Live backend shapes: `qoz-demo-backend/docs/API.md` (incidents analyze, lessons analyze, health).

## Updating the spec

When adding a domain or changing a DTO:

1. Update TypeScript contract + stubs
2. Add/adjust path in `qoz-platform.openapi.yaml`
3. Update `docs/data-layer/DOMAIN_MAP.md`
