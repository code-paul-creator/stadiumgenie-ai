/**
 * navigation.js
 * Wayfinding: works fully offline from static data (gate list, transit
 * options) and layers in an AI-generated, plain-language walking guide
 * when a key is configured.
 */
const StadiumNav = (() => {
  async function getAiRouteGuide(stadium, fromGate, toArea) {
    const system = [
      'You are a stadium wayfinding assistant for the FIFA World Cup 2026.',
      'Give a short, numbered, plain-language walking guide (max 5 steps).',
      'Mention accessible routes if relevant. Do not invent exact distances.',
      'Keep the whole reply under 120 words.',
    ].join(' ');
    const user = `Stadium: ${stadium.name} (${stadium.city}). Gates: ${stadium.gates.join(
      ', '
    )}. I am at Gate ${fromGate} and need to get to: ${toArea}.`;
    return window.StadiumAI.ask(system, user);
  }

  function staticFallbackGuide(stadium, fromGate, toArea) {
    return [
      `From Gate ${fromGate} at ${stadium.name}:`,
      `1. Follow the main concourse toward the section numbers closest to "${toArea}".`,
      `2. Use the nearest staircase or elevator bank — elevators are marked with the accessibility icon.`,
      `3. Stadium stewards in yellow vests can confirm the last stretch.`,
      `(Add an API key in Settings for a personalized, AI-generated route.)`,
    ].join('\n');
  }

  return { getAiRouteGuide, staticFallbackGuide };
})();

if (typeof window !== 'undefined') window.StadiumNav = StadiumNav;
if (typeof module !== 'undefined' && module.exports) module.exports = StadiumNav;
