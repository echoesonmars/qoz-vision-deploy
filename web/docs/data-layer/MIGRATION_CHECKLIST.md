# Migration Checklist

Per-domain criteria before marking a domain **live**.

## Global

- [ ] `Api*Repository` implements contract in `lib/data/api-repositories/`
- [ ] `registry.ts` uses `Api*Repository`
- [ ] OpenAPI path implemented on backend + Next proxy if needed
- [ ] `npm run build` passes
- [ ] No imports from `lib/director/mock`, `lib/people/*-mock`, `lib/checks/*`, `lib/analytics/mock`, `lib/dashboard/*-mock` in `app/` or `components/`

## Director dashboard

- [ ] `GET /api/director/dashboard?period&schoolId` returns `DirectorDashboardData`
- [ ] Hook shows loading/error on fetch failure
- [ ] School override via `schoolId` matches hierarchy resolver

## Director drilldown

- [ ] All `app/dashboard/director/*` pages use `directorDetailRepo`
- [ ] Hybrid sections (security, infrastructure, teacher load) use repo not stubs

## People / Checks

- [ ] Components use hooks or `@/lib/data`
- [ ] Export aggregate uses stub paths under `lib/data/stubs/`

## Analytics

- [ ] `AnalyticsFiltersProvider` uses `analyticsRepo` / hooks only

## Hierarchy

- [ ] `lib/hierarchy/resolvers.ts` delegates to `hierarchyRepo`
- [ ] `SchoolContextProvider` uses `getDefaultSchoolId()`

## Exports

- [ ] Generate route uses `exportsRepo.buildBundle(type, filters)`

## Knowledge map / Forecasts

- [ ] Dashboard components import from `@/lib/data/stubs/...` or hooks

## Settings

- [ ] Audit page uses `settingsRepo.getAuditRows()`

## Documentation

- [ ] OpenAPI spec updated if shapes change
- [ ] DOMAIN_MAP.md row marked live
