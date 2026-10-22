// Geographic coordinates for City of Elmina demo nodes and paths
// Centered around Elmina Central Park & Lakeside Mall, Shah Alam, Malaysia (3.18° N, 101.51° E)

export const ELMINA_CENTER = {
  lat: 3.1872,
  lng: 101.5168
};

// Real-world Geo coordinates for the schematic nodes
export const NODE_COORDINATES = {
  'L-01': { lat: 3.1835, lng: 101.5120, name: 'Community Residence Gate', area: 'Origin Point' },
  'L-02': { lat: 3.1870, lng: 101.5135, name: 'North Avenue Junction', area: 'Route A — Main Avenue' },
  'L-03': { lat: 3.1895, lng: 101.5165, name: 'Main Avenue Walkway', area: 'Route A — Main Avenue' },
  'L-04': { lat: 3.1905, lng: 101.5205, name: 'Central Boulevard Junction', area: 'Route A — Main Avenue' },
  'L-05': { lat: 3.1820, lng: 101.5145, name: 'Garden Shortcut East Gate', area: 'Route B — Garden Shortcut' },
  'L-06': { lat: 3.1830, lng: 101.5180, name: 'Garden Shortcut Path', area: 'Route B — Garden Shortcut' },
  'L-07': { lat: 3.1855, lng: 101.5215, name: 'Garden Junction', area: 'Route B — Garden Shortcut' },
  'L-08': { lat: 3.1885, lng: 101.5238, name: 'Central Transit Stop', area: 'Destination Point' },
};

// Route GPS polyline paths
export const ROUTE_GPS_PATHS = {
  A: [
    NODE_COORDINATES['L-01'],
    NODE_COORDINATES['L-02'],
    NODE_COORDINATES['L-03'],
    NODE_COORDINATES['L-04'],
    NODE_COORDINATES['L-08']
  ],
  B: [
    NODE_COORDINATES['L-01'],
    NODE_COORDINATES['L-05'],
    NODE_COORDINATES['L-06'],
    NODE_COORDINATES['L-07'],
    NODE_COORDINATES['L-08']
  ],
  C: [
    NODE_COORDINATES['L-01'],
    NODE_COORDINATES['L-05'],
    NODE_COORDINATES['L-07'],
    NODE_COORDINATES['L-08']
  ]
};

// Hazard GPS locations
export const HAZARD_COORDINATES = {
  'HZ-101': { lat: 3.1905, lng: 101.5205, title: 'Broken street lamp cover' },
  'HZ-102': { lat: 3.1830, lng: 101.5180, title: 'Overgrown vegetation blocking sightline' },
  'HZ-103': { lat: 3.1825, lng: 101.5165, title: 'Severely cracked pedestrian pathway' },
};
