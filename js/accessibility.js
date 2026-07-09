/**
 * accessibility.js
 * Accessibility support: static facts (always available, no AI needed)
 * plus an optional AI Q&A for specific situations ("I use a wheelchair
 * and need the quietest route to Section 112").
 */
const StadiumAccess = (() => {
  const STATIC_FEATURES = [
    { icon: '♿', label: 'Wheelchair-accessible seating in every section' },
    { icon: '🅿️', label: 'Accessible parking near designated gates' },
    { icon: '🦮', label: 'Service animal relief areas at each gate' },
    { icon: '🔊', label: 'Assisted listening devices available at guest services' },
    { icon: '🧏', label: 'Sign language interpretation on request (48h notice)' },
    { icon: '🚻', label: 'Family and accessible restrooms on every concourse level' },
    { icon: '🧠', label: 'Sensory-friendly quiet room for neurodivergent guests' },
  ];

  async function getAiAccessGuide(question) {
    const system = [
      'You are an accessibility concierge for FIFA World Cup 2026 stadiums.',
      'Answer the specific accessibility question clearly and kindly in under 100 words.',
      'If unsure of an exact stadium policy, say so and suggest contacting Guest Services',
      'rather than guessing.',
    ].join(' ');
    return window.StadiumAI.ask(system, window.StadiumUtils.clampInput(question, 500));
  }

  return { STATIC_FEATURES, getAiAccessGuide };
})();

if (typeof window !== 'undefined') window.StadiumAccess = StadiumAccess;
if (typeof module !== 'undefined' && module.exports) module.exports = StadiumAccess;
