/**
 * api.js
 * Thin, provider-agnostic wrapper around browser-callable GenAI APIs.
 *
 * SECURITY MODEL (read this before wiring up a real key):
 * - This app runs as static files on GitHub Pages. There is no server,
 *   so there is nowhere to hide a secret from the network tab.
 * - The key a person enters in Settings is stored ONLY in their own
 *   browser (localStorage), sent ONLY to the AI provider's official API
 *   endpoint over HTTPS, and NEVER sent to any server we control.
 * - Because of that, each visitor should use THEIR OWN key (with a low
 *   spend cap set on the provider's dashboard) rather than a shared key
 *   baked into the deployed site. See README.md "Add your API key".
 * - window.STADIUM_CONFIG (config.js) is an OPTIONAL, non-secret file
 *   used only to set a default provider/model. It is safe to commit
 *   because it never contains a real key.
 */

const StadiumAI = (() => {
  const STORAGE_KEY = 'stadium_ai_key_v1';
  const STORAGE_PROVIDER = 'stadium_ai_provider_v1';
  const REQUEST_TIMEOUT_MS = 20000;

  const PROVIDERS = {
    gemini: {
      label: 'Google Gemini',
      endpoint: (model) =>
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      defaultModel: 'gemini-2.0-flash',
      buildRequest(apiKey, model, systemPrompt, userPrompt) {
        return {
          url: `${this.endpoint(model)}?key=${encodeURIComponent(apiKey)}`,
          init: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
            }),
          },
        };
      },
      parseResponse(json) {
        return json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
      },
    },
    openai: {
      label: 'OpenAI-compatible',
      endpoint: () => 'https://api.openai.com/v1/chat/completions',
      defaultModel: 'gpt-4o-mini',
      buildRequest(apiKey, model, systemPrompt, userPrompt) {
        return {
          url: this.endpoint(),
          init: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: 0.4,
              max_tokens: 512,
            }),
          },
        };
      },
      parseResponse(json) {
        return json?.choices?.[0]?.message?.content || '';
      },
    },
  };

  function getStoredKey() {
    try {
      const personalKey = localStorage.getItem(STORAGE_KEY);
      if (personalKey) return personalKey;
    } catch {
      /* localStorage unavailable - fall through to optional demo key */
    }
    // Optional fallback: a build-time "demo" key injected from a GitHub
    // Actions secret (see .github/workflows/deploy.yml). This is OFF by
    // default (empty string) and, if you turn it on, only makes sense
    // when the key is domain/referrer-restricted at the provider - see
    // README.md "Add your API key" > "Optional: shared demo key".
    return window.STADIUM_CONFIG?.demoApiKey || '';
  }

  function setStoredKey(key) {
    try {
      if (key) localStorage.setItem(STORAGE_KEY, key);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* localStorage unavailable (private mode) - key simply won't persist */
    }
  }

  function getStoredProvider() {
    try {
      return localStorage.getItem(STORAGE_PROVIDER) || (window.STADIUM_CONFIG?.defaultProvider ?? 'gemini');
    } catch {
      return 'gemini';
    }
  }

  function setStoredProvider(provider) {
    try {
      localStorage.setItem(STORAGE_PROVIDER, provider);
    } catch {
      /* ignore */
    }
  }

  function hasKey() {
    return Boolean(getStoredKey());
  }

  /**
   * Send a prompt to the configured provider.
   * @param {string} systemPrompt - fixed instructions for this feature/module
   * @param {string} userPrompt - the user's message / dynamic context
   * @returns {Promise<string>} model's text reply
   */
  async function ask(systemPrompt, userPrompt) {
    const apiKey = getStoredKey();
    if (!apiKey) {
      const err = new Error('NO_API_KEY');
      err.code = 'NO_API_KEY';
      throw err;
    }
    const providerId = getStoredProvider();
    const provider = PROVIDERS[providerId];
    if (!provider) throw new Error(`Unknown provider: ${providerId}`);

    const model = window.STADIUM_CONFIG?.defaultModel || provider.defaultModel;
    const { url, init } = provider.buildRequest(apiKey, model, systemPrompt, userPrompt);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(`Provider responded with ${res.status}`);
        err.code = 'PROVIDER_ERROR';
        err.status = res.status;
        err.detail = text.slice(0, 300);
        throw err;
      }
      const json = await res.json();
      const text = provider.parseResponse(json);
      if (!text) {
        const err = new Error('Empty response from provider');
        err.code = 'EMPTY_RESPONSE';
        throw err;
      }
      return text;
    } catch (e) {
      if (e.name === 'AbortError') {
        const err = new Error('Request timed out');
        err.code = 'TIMEOUT';
        throw err;
      }
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    PROVIDERS,
    hasKey,
    getStoredKey,
    setStoredKey,
    getStoredProvider,
    setStoredProvider,
    ask,
  };
})();

if (typeof window !== 'undefined') {
  window.StadiumAI = StadiumAI;
}
