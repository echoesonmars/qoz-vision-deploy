# Domain Map

| Domain | Contract | Stub source | Hook / access | Page / consumer | OpenAPI (target) |
|--------|----------|-------------|---------------|-----------------|------------------|
| Director dashboard | `IDirectorDashboardRepository` | `stubs/director/*` via assembler | `useDirectorDashboard` | `/dashboard`, `/api/director/dashboard` | `GET /api/director/dashboard` |
| Director drilldown | `IDirectorDetailRepository` | `stubs/director/*` | `directorDetailRepo` / server | `app/dashboard/director/*` | `GET /api/director/students/{id}`, … |
| People | `IPeopleRepository` | `stubs/people/*` | `usePeopleStudents`, … | `/people/*` | `GET /api/people/students`, … |
| Checks | `IChecksRepository` | `stubs/checks/*` | `useChecksBank`, … | `/checks/*` | `GET /api/checks/status`, … |
| Analytics | `IAnalyticsRepository` | `stubs/analytics/*` | `useAnalyticsDataset` | `AnalyticsFiltersProvider` | `GET /api/analytics/dataset` |
| Hierarchy | `IHierarchyRepository` | `stubs/hierarchy/*` | `hierarchyRepo` / resolvers | `/overview/*`, school context | `GET /api/hierarchy/regions`, … |
| Exports | `IExportsRepository` | `stubs/exports/*` + aggregate | `exportsRepo` | `/dashboard/analytics/exports` | `GET /api/exports/options`, `POST /api/exports/generate` |
| Knowledge map | `IKnowledgeMapRepository` | `stubs/dashboard/knowledge-map-mock` | `useKnowledgeMapData` | `/dashboard/knowledge-map` | `GET /api/knowledge-map/graph` |
| Forecasts | `IForecastsRepository` | `stubs/dashboard/forecasts-mock`, `stubs/director/forecasts` | `useDashboardForecasts` | `/dashboard/forecasts`, director forecast pages | `GET /api/forecasts/strategic` |
| Integrations | `IIntegrationsRepository` | `stubs/director/integrations`, `stubs/integrations/*` | `integrationsRepo` | director dashboard, facade | (partial live cameras infra) |
| Cameras analytics | `ICamerasAnalyticsRepository` | `stubs/cameras/engagement-history-mock` | `useEngagementHistoryWeek` | historical chart | `GET /api/cameras/analytics/engagement` |
| Summary | `ISummaryRepository` | `stubs/dashboard/summary-mock` | `summaryRepo` | legacy summary, exports aggregate | — |
| Settings audit | `ISettingsRepository` | `stubs/settings/audit` | `settingsRepo` | `/dashboard/settings/audit` | `GET /api/settings/audit` |

## Live domains (document only — not stubbed)

| Area | Next routes | Backend |
|------|-------------|---------|
| Auth | `/api/auth/login`, `register`, `logout` | Session/cookies |
| Incidents | `/api/incidents/*` | `POST /api/incidents/analyze` |
| Lessons | `/api/lessons/*` | `POST /api/lessons/analyze` |
| Live / cameras | `/api/live/*` | Fleet, sessions, feed |
| Agent | `/api/agent/chat` | Backend proxy |

## Legacy shims

Old paths (`lib/director/mock/*`, `lib/people/*-mock`, etc.) re-export from `lib/data/stubs/` for backward compatibility. New code must not import them.
