/**
 * sustainability.js
 * Deterministic CO2e estimate (utils.js) + optional AI-generated,
 * context-specific sustainability tips for the chosen stadium/city.
 */
const StadiumSustain = (() => {
  async function getAiTips(stadium, mode, co2SavedGrams) {
    const system = [
      'You are a sustainability assistant for FIFA World Cup 2026 fans.',
      'Give 2 short, specific, encouraging tips (max 70 words total) related to the',
      "fan's chosen transport mode and city. No preamble, no disclaimers.",
    ].join(' ');
    const user = `Stadium: ${stadium.name}, ${stadium.city}. Chosen mode: ${mode}. Estimated CO2e saved vs driving alone: ${co2SavedGrams}g.`;
    return window.StadiumAI.ask(system, user);
  }

  return { getAiTips };
})();

if (typeof window !== 'undefined') window.StadiumSustain = StadiumSustain;
if (typeof module !== 'undefined' && module.exports) module.exports = StadiumSustain;
