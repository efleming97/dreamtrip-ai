
// Simple Haversine for distance-based flight time estimate
function haversine(lat1, lon1, lat2, lon2){
  const R = 6371; // km
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function estimateFlightHours(distKm){
  const avgCruise = 820; // km/h
  const buffer = 0.6; // taxi + wind + approach
  return ((distKm / avgCruise) + buffer);
}

function fmtHours(h){
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours)*60);
  return `${hours}h ${minutes.toString().padStart(2,'0')}m`;
}

async function loadCities(){
  const res = await fetch('data/cities.json');
  return await res.json();
}

function randomScoreFromPrefs(city, prefs){
  // Lightweight mock scoring: bonuses for tags + continent + climate
  let score = 50 + Math.random()*20;
  if (prefs.continent && city.continent === prefs.continent) score += 10;
  if (prefs.vibe){
    const has = (city.tags||[]).some(t => t.toLowerCase().includes(prefs.vibe.toLowerCase()));
    if (has) score += 8;
  }
  if (prefs.climate && city.climate === prefs.climate) score += 6;
  return Math.min(99, Math.round(score));
}

function pickHeroImage(city){
  const queries = [
    `${city.city} ${city.country} beach`,
    `${city.city} skyline`,
    `${city.city} island`,
    `${city.city} travel`
  ];
  const q = encodeURIComponent(queries[Math.floor(Math.random()*queries.length)]);
  // Unsplash source with dynamic query for high-quality pics
  return `https://source.unsplash.com/1600x900/?${q}`;
}

// Shared render for airline mini-logos
function airlineLogoStrip(){
  const carriers = ['https://logo.clearbit.com/qantas.com','https://logo.clearbit.com/airnewzealand.co.nz','https://logo.clearbit.com/virginaustralia.com','https://logo.clearbit.com/emirates.com','https://logo.clearbit.com/singaporeair.com'];
  return carriers.slice(0, 4).map(src => `<img src="${src}" alt="airline">`).join('');
}

// Persist answers across pages
const state = {
  prefs: JSON.parse(sessionStorage.getItem('prefs')||'{}'),
  origin: JSON.parse(sessionStorage.getItem('origin')||'null'),
};

function savePrefs(p){ sessionStorage.setItem('prefs', JSON.stringify(p)); }
function saveOrigin(o){ sessionStorage.setItem('origin', JSON.stringify(o)); }

// Geocode-lite for airports (demo list)
const demoAirports = [
  {code:'AKL', name:'Auckland', lat:-37.0082, lon:174.7850},
  {code:'SYD', name:'Sydney', lat:-33.9399, lon:151.1753},
  {code:'LAX', name:'Los Angeles', lat:33.9416, lon:-118.4085},
  {code:'JFK', name:'New York JFK', lat:40.6413, lon:-73.7781},
  {code:'LHR', name:'London Heathrow', lat:51.47, lon:-0.4543},
  {code:'SIN', name:'Singapore Changi', lat:1.3644, lon:103.9915}
];
