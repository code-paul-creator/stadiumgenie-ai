/**
 * crowd.js
 * Crowd management: ranks zones by congestion (pure logic in utils.js),
 * and optionally asks the AI to turn the raw numbers into a short,
 * actionable recommendation for organizers/volunteers.
 */
const StadiumCrowd = (() => {
  async function getAiOpsSummary(rankedZones) {
    const system = [
      'You are an operations-intelligence assistant for FIFA World Cup 2026 stadium staff.',
      'Given zone occupancy data, write a brief (max 90 words) situation summary',
      'and 1-2 concrete recommended actions (e.g. open an overflow gate, redirect signage,',
      'add stewards). Be specific about zone names. No preamble.',
    ].join(' ');
    const user = JSON.stringify(
      rankedZones.map((z) => ({ zone: z.label, occupancy_percent: z.percent, trend: z.trend }))
    );
    return window.StadiumAI.ask(system, user);
  }

  return { getAiOpsSummary };
})();

if (typeof window !== 'undefined') window.StadiumCrowd = StadiumCrowd;
if (typeof module !== 'undefined' && module.exports) module.exports = StadiumCrowd;
