/**
 * config.js
 * NON-SECRET defaults only. Never put a real API key in this file -
 * it is served as a plain static asset to every visitor.
 *
 * These two values just pre-select a provider/model in the Settings
 * panel; every visitor still supplies their own personal API key,
 * which is stored solely in their own browser (see js/api.js).
 */
window.STADIUM_CONFIG = {
  defaultProvider: 'gemini', // 'gemini' | 'openai'
  defaultModel: '', // leave blank to use each provider's built-in default
  appName: 'FIFA World Cup 2026 - Stadium Companion (Demo)',
  buildTag: '__BUILD_TAG__', // replaced by CI with the commit SHA, for support/debugging only

  // OPTIONAL, OFF BY DEFAULT. If you add a repo secret named GEMINI_API_KEY,
  // the deploy workflow will substitute it here so every visitor gets AI
  // answers without entering their own key. Only do this with a key that is
  // HTTP-referrer-restricted (in Google Cloud Console) to your github.io
  // domain, and with a strict daily quota - anyone can read this file's
  // deployed contents. See README.md "Optional: shared demo key".
  demoApiKey: '__DEMO_API_KEY__',
};
