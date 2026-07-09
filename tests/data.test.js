const stadiumData = require('../data/stadiums.json');
const crowdData = require('../data/crowd-feed.json');

describe('stadiums.json', () => {
  test('contains at least one stadium', () => {
    expect(Array.isArray(stadiumData.stadiums)).toBe(true);
    expect(stadiumData.stadiums.length).toBeGreaterThan(0);
  });

  test.each(stadiumData.stadiums)('stadium "%s" has required fields', (stadium) => {
    expect(stadium.id).toEqual(expect.any(String));
    expect(stadium.name).toEqual(expect.any(String));
    expect(stadium.city).toEqual(expect.any(String));
    expect(stadium.capacity).toBeGreaterThan(0);
    expect(Array.isArray(stadium.gates)).toBe(true);
    expect(stadium.gates.length).toBeGreaterThan(0);
    expect(Array.isArray(stadium.transitOptions)).toBe(true);
    expect(stadium.sustainabilityScore).toBeGreaterThanOrEqual(0);
    expect(stadium.sustainabilityScore).toBeLessThanOrEqual(100);
  });

  test('all stadium ids are unique', () => {
    const ids = stadiumData.stadiums.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('languages list is non-empty and well-formed', () => {
    expect(stadiumData.languages.length).toBeGreaterThan(0);
    stadiumData.languages.forEach((lang) => {
      expect(lang.code).toEqual(expect.any(String));
      expect(lang.label).toEqual(expect.any(String));
    });
  });
});

describe('crowd-feed.json', () => {
  test('every zone has a valid capacity/current relationship', () => {
    expect(crowdData.zones.length).toBeGreaterThan(0);
    crowdData.zones.forEach((zone) => {
      expect(zone.capacity).toBeGreaterThan(0);
      expect(zone.current).toBeGreaterThanOrEqual(0);
      expect(['rising', 'falling', 'steady']).toContain(zone.trend);
    });
  });

  test('all zone ids are unique', () => {
    const ids = crowdData.zones.map((z) => z.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
