const {
  occupancyPercent,
  congestionLevel,
  rankZonesByCongestion,
  suggestAlternateZone,
  estimateCo2SavedGrams,
  sanitizeForDisplay,
  clampInput,
} = require('../js/utils.js');

describe('occupancyPercent', () => {
  test('computes a basic percentage', () => {
    expect(occupancyPercent(50, 100)).toBe(50);
  });

  test('rounds to 1 decimal place', () => {
    expect(occupancyPercent(1, 3)).toBeCloseTo(33.3, 1);
  });

  test('allows over-capacity values above 100', () => {
    expect(occupancyPercent(120, 100)).toBe(120);
  });

  test('throws on non-finite input', () => {
    expect(() => occupancyPercent(NaN, 100)).toThrow();
    expect(() => occupancyPercent(10, 0)).toThrow();
    expect(() => occupancyPercent(10, -5)).toThrow();
  });
});

describe('congestionLevel', () => {
  test.each([
    [10, 'low'],
    [49.9, 'low'],
    [50, 'moderate'],
    [79.9, 'moderate'],
    [80, 'high'],
    [94.9, 'high'],
    [95, 'critical'],
    [140, 'critical'],
  ])('%d%% => %s', (pct, expected) => {
    expect(congestionLevel(pct)).toBe(expected);
  });
});

describe('rankZonesByCongestion', () => {
  const zones = [
    { id: 'a', label: 'A', capacity: 100, current: 20, trend: 'steady' },
    { id: 'b', label: 'B', capacity: 100, current: 90, trend: 'rising' },
    { id: 'c', label: 'C', capacity: 100, current: 50, trend: 'falling' },
  ];

  test('sorts descending by occupancy percent', () => {
    const ranked = rankZonesByCongestion(zones);
    expect(ranked.map((z) => z.id)).toEqual(['b', 'c', 'a']);
  });

  test('enriches each zone with percent and level', () => {
    const ranked = rankZonesByCongestion(zones);
    expect(ranked[0]).toMatchObject({ id: 'b', percent: 90, level: 'high' });
  });

  test('throws on non-array input', () => {
    expect(() => rankZonesByCongestion('nope')).toThrow();
  });
});

describe('suggestAlternateZone', () => {
  const zones = [
    { id: 'gate-a', label: 'Gate A', capacity: 100, current: 95, trend: 'rising' },
    { id: 'gate-b', label: 'Gate B', capacity: 100, current: 40, trend: 'steady' },
    { id: 'concessions-1', label: 'Concessions 1', capacity: 100, current: 10, trend: 'steady' },
  ];

  test('suggests the least congested zone in the same family', () => {
    expect(suggestAlternateZone(zones, 'gate-a').id).toBe('gate-b');
  });

  test('returns null when there is no zone with that id', () => {
    expect(suggestAlternateZone(zones, 'unknown')).toBeNull();
  });

  test('returns null when there is no alternative in the same family', () => {
    expect(suggestAlternateZone(zones, 'concessions-1')).toBeNull();
  });
});

describe('estimateCo2SavedGrams', () => {
  test('returns 0 for zero distance', () => {
    expect(estimateCo2SavedGrams(0, 'bus')).toBe(0);
  });

  test('walking/biking saves the full baseline amount', () => {
    expect(estimateCo2SavedGrams(10, 'walk')).toBe(1920);
    expect(estimateCo2SavedGrams(10, 'bike')).toBe(1920);
  });

  test('rejects unknown transport modes', () => {
    expect(() => estimateCo2SavedGrams(10, 'jetpack')).toThrow();
  });

  test('rejects negative distance', () => {
    expect(() => estimateCo2SavedGrams(-5, 'bus')).toThrow();
  });
});

describe('sanitizeForDisplay', () => {
  test('escapes HTML-significant characters', () => {
    expect(sanitizeForDisplay('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    );
  });

  test('returns empty string for non-string input', () => {
    expect(sanitizeForDisplay(42)).toBe('');
    expect(sanitizeForDisplay(null)).toBe('');
  });
});

describe('clampInput', () => {
  test('trims whitespace', () => {
    expect(clampInput('  hello  ')).toBe('hello');
  });

  test('truncates to maxLen', () => {
    expect(clampInput('abcdefgh', 4)).toBe('abcd');
  });

  test('returns empty string for non-string input', () => {
    expect(clampInput(123)).toBe('');
  });
});
