// i18n.js attaches to `window` in the browser; under Node/Jest we stub a
// minimal `window`/`document`/`localStorage` before requiring it so the
// same source file can be exercised without a browser.
beforeAll(() => {
  global.window = global.window || {};
  global.document = { documentElement: {} };
  global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] ?? null; },
    setItem(key, val) { this.store[key] = val; },
  };
  global.window.StadiumUtils = require('../js/utils.js');
  require('../js/i18n.js');
});

describe('StadiumI18n', () => {
  test('every language defines the same keys as English', () => {
    const { STRINGS } = global.window.StadiumI18n;
    const englishKeys = Object.keys(STRINGS.en).sort();
    Object.values(STRINGS).forEach((dict) => {
      expect(Object.keys(dict).sort()).toEqual(englishKeys);
    });
  });

  test('setLang falls back to English for an unknown code', () => {
    global.window.StadiumI18n.setLang('xx-not-real');
    expect(global.window.StadiumI18n.getLang()).toBe('en');
  });

  test('setLang sets rtl direction for Arabic', () => {
    global.window.StadiumI18n.setLang('ar');
    expect(global.document.documentElement.dir).toBe('rtl');
    expect(global.window.StadiumI18n.getLang()).toBe('ar');
  });

  test('t() returns the key itself if missing everywhere', () => {
    global.window.StadiumI18n.setLang('en');
    expect(global.window.StadiumI18n.t('totallyMadeUpKey')).toBe('totallyMadeUpKey');
  });
});
