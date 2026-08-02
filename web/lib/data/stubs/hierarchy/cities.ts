import { listRegions } from "@/lib/data/stubs/hierarchy/regions";

export { listRegions as listCities } from "@/lib/data/stubs/hierarchy/regions";

export function listCitiesLegacy() {
  return listRegions();
}
