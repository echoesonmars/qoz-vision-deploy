# Hierarchy overview — logical commits (only drill-down feature files)
# Run from repo root:  cd d:\edtech\qoz-vision-demo
# Then:  .\commit-hierarchy-overview.ps1
#
# Other modified files (lessons, cameras, auth…) are NOT included.

Set-Location $PSScriptRoot

# 1. Data layer: types, almaty mock, regions, resolvers, paths
git add `
  lib/hierarchy/types.ts `
  lib/hierarchy/aggregate-metrics.ts `
  lib/hierarchy/attendance-status.ts `
  lib/hierarchy/school-labels.ts `
  lib/hierarchy/data/almaty.ts `
  lib/hierarchy/data/regions.ts `
  lib/hierarchy/data/cities.ts `
  lib/hierarchy/resolvers.ts `
  lib/hierarchy/paths.ts

git commit -m "feat(hierarchy): add KZ regions, cities and school mock data layer"

# 2. Auth entry and overview routes in middleware
git add `
  middleware.ts `
  lib/director/paths.ts `
  components/login-form.tsx

git commit -m "feat(hierarchy): redirect login to overview and protect overview routes"

# 3. Overview UI components
git add `
  components/overview/overview-page-shell.tsx `
  components/overview/overview-level-header.tsx `
  components/overview/overview-kpi-grid.tsx `
  components/overview/overview-entity-table.tsx `
  components/overview/overview-region-grid.tsx `
  components/overview/overview-city-grid.tsx `
  components/overview/overview-district-schools.tsx

git commit -m "feat(overview): add reusable KPI, region/city grid and entity table components"

# 4. Overview pages (country -> region -> city -> district)
git add `
  app/overview/layout.tsx `
  app/overview/page.tsx `
  "app/overview/[regionId]/page.tsx" `
  "app/overview/[regionId]/[cityId]/page.tsx" `
  "app/overview/[regionId]/[cityId]/[districtId]/page.tsx"

git commit -m "feat(overview): add drill-down pages for regions, cities and districts"

# 5. School context and director dashboard API
git add `
  lib/hierarchy/school-context.tsx `
  lib/director/director-data.ts `
  app/api/director/dashboard/route.ts `
  hooks/use-director-dashboard.ts `
  components/director/director-providers.tsx

git commit -m "feat(hierarchy): wire school context and schoolId into director dashboard API"

# 6. Director UI integration (breadcrumbs, back link, settings)
git add `
  components/director/director-dashboard-scaffold.tsx `
  components/director/shared/director-school-breadcrumbs.tsx `
  components/director/shared/director-page-home-link.tsx `
  components/director/settings/school-settings-client.tsx `
  components/director/shared/director-page-shell.tsx

git commit -m "feat(director): show hierarchy breadcrumbs and dynamic school labels on dashboard"

# 7. Legacy UO overview links
git add `
  app/dashboard/director/uo-overview/page.tsx `
  components/director/extras/director-extras-section.tsx

git commit -m "refactor(director): point UO overview links to new hierarchy routes"

Write-Host "Done. 7 commits created for hierarchy overview feature."
