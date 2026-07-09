/**
 * utils.js
 * Pure, dependency-free helper functions.
 * Kept isolated from the DOM so the same file can be unit-tested under Node
 * (see /tests) and loaded directly in the browser via a <script> tag.
 */

/**
 * Compute the occupancy percentage of a zone.
 * @param {number} current - current headcount
 * @param {number} capacity - max safe capacity
 * @returns {number} percentage rounded to 1 decimal, clamped 0-100+
 */
function occupancyPercent(current, capacity) {
  if (!Number.isFinite(current) || !Number.isFinite(capacity) || capacity <= 0) {
    throw new Error('occupancyPercent: current and capacity must be finite, capacity > 0');
  }
  return Math.round((current / capacity) * 1000) / 10;
}

/**
 * Classify a zone's congestion level for UI coloring and AI prompting.
 * @param {number} percent - occupancy percentage
 * @returns {'low'|'moderate'|'high'|'critical'}
 */
function congestionLevel(percent) {
  if (percent < 50) return 'low';
  if (percent < 80) return 'moderate';
  if (percent < 95) return 'high';
  return 'critical';
}

/**
 * Rank zones from most to least congested, enriching each with derived fields.
 * @param {Array<{id:string,label:string,capacity:number,current:number,trend:string}>} zones
 */
function rankZonesByCongestion(zones) {
  if (!Array.isArray(zones)) throw new Error('rankZonesByCongestion: zones must be an array');
  return zones
    .map((z) => {
      const percent = occupancyPercent(z.current, z.capacity);
      return { ...z, percent, level: congestionLevel(percent) };
    })
    .sort((a, b) => b.percent - a.percent);
}

/**
 * Suggest the least congested alternative zone of the same "type" family
 * (very small heuristic used to power the navigation module before/without
 * an AI call, and as a deterministic fallback if the AI request fails).
 */
function suggestAlternateZone(zones, currentZoneId) {
  const ranked = rankZonesByCongestion(zones);
  const current = ranked.find((z) => z.id === currentZoneId);
  if (!current) return null;
  const family = currentZoneId.split('-')[0];
  const alternatives = ranked.filter(
    (z) => z.id !== currentZoneId && z.id.split('-')[0] === family
  );
  if (alternatives.length === 0) return null;
  return alternatives.reduce((best, z) => (z.percent < best.percent ? z : best));
}

/**
 * Estimate grams of CO2e saved by choosing a lower-carbon transport mode
 * over driving alone, for a given distance in km. Figures are illustrative
 * averages (grams CO2e per passenger-km) used for directional guidance only.
 */
const EMISSION_FACTORS_G_PER_KM = {
  car_alone: 192,
  rideshare_pooled: 96,
  bus: 68,
  rail: 41,
  bike: 0,
  walk: 0,
};

function estimateCo2SavedGrams(distanceKm, chosenMode) {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new Error('estimateCo2SavedGrams: distanceKm must be a non-negative number');
  }
  if (!(chosenMode in EMISSION_FACTORS_G_PER_KM)) {
    throw new Error(`estimateCo2SavedGrams: unknown mode "${chosenMode}"`);
  }
  const baseline = EMISSION_FACTORS_G_PER_KM.car_alone * distanceKm;
  const chosen = EMISSION_FACTORS_G_PER_KM[chosenMode] * distanceKm;
  return Math.max(0, Math.round(baseline - chosen));
}

/**
 * Very small sanitizer for text shown back to users in chat bubbles.
 * Strips tags to reduce stored/DOM-based XSS risk when rendering
 * AI or user-provided text as HTML. Prefer textContent where possible;
 * this exists for the few spots that need inline formatting.
 */
function sanitizeForDisplay(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Truncate + trim a user-provided string before sending to an LLM API,
 * as a defense-in-depth measure against oversized/abusive payloads.
 */
function clampInput(str, maxLen = 1000) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

// Export for Node (tests) and attach to window for browser use.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    occupancyPercent,
    congestionLevel,
    rankZonesByCongestion,
    suggestAlternateZone,
    estimateCo2SavedGrams,
    sanitizeForDisplay,
    clampInput,
    EMISSION_FACTORS_G_PER_KM,
  };
}
if (typeof window !== 'undefined') {
  window.StadiumUtils = {
    occupancyPercent,
    congestionLevel,
    rankZonesByCongestion,
    suggestAlternateZone,
    estimateCo2SavedGrams,
    sanitizeForDisplay,
    clampInput,
    EMISSION_FACTORS_G_PER_KM,
  };
}
