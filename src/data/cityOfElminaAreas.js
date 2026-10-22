// City of Elmina — Authoritative Area Data Accessor
// Single source of truth loaded from cityOfElminaAreas.json

import elminaData from './cityOfElminaAreas.json';

export const CITY_OF_ELMINA_DATA = elminaData;

export const ELMINA_CATEGORIES = elminaData.categories;

// Flattened list of approved locations with associated category metadata
export const ELMINA_LOCATIONS = elminaData.categories.flatMap((cat) =>
  cat.locations.map((locName) => ({
    id: locName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label: locName,
    sublabel: cat.name,
    categoryId: cat.id,
    categoryName: cat.name
  }))
);

/**
 * Filter locations by text query across name and category
 */
export function searchElminaLocations(query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return ELMINA_LOCATIONS;
  return ELMINA_LOCATIONS.filter(
    (loc) =>
      loc.label.toLowerCase().includes(q) ||
      loc.sublabel.toLowerCase().includes(q)
  );
}

/**
 * Get locations belonging to a specific category id
 */
export function getLocationsByCategory(categoryId) {
  const cat = elminaData.categories.find((c) => c.id === categoryId);
  return cat ? cat.locations : [];
}
