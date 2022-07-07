import {
  DataStructureHints,
  makeDataHintsContainer as makeHints,
  makeDataSummarizationConfig as makeConfig,
} from '../src/a11y/hints';
import {
  AnalyzedData,
  ClusterNode,
  ComparisonNode,
  extractDataInsights,
  Insight,
} from '../src/a11y/insights';
import { serialize } from '../src/a11y/serialize';
import { translations } from '../src/a11y/translations/view/translations';

const pixelArtToPointsList = (space: string) =>
  space
    .split('\n')
    .map((line, lineIndex) =>
      line.split('').map((char, index) => {
        if (char === ' ') return null;
        const x = index;
        const y = lineIndex;
        const label = char;
        return { x, y, label };
      }),
    )
    .flat()
    .filter((point) => point !== null);

describe('Plot a11y summarization', () => {
  test('insights-extraction/general-trends/static', () => {
    const data = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
      { x: 10, y: 1 },
    ];
    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'general-trend',
        priority: (insights[0] as any).priority,
        change: {
          from: 1,
          to: 1,
          strength: 'static',
        },
        from: 0,
        to: 10,
        dataKey: 'y',
      },
    ]);
  });

  test('insights-extraction/general-trends/weak-growth', () => {
    const data = [
      { x: 0, y: 1 },
      { x: 1, y: 1.1 },
      { x: 2, y: 1.2 },
      { x: 3, y: 1.3 },
      { x: 4, y: 1.4 },
      { x: 5, y: 1.5 },
      { x: 6, y: 1.6 },
      { x: 7, y: 1.7 },
      { x: 8, y: 1.8 },
      { x: 9, y: 1.9 },
      { x: 10, y: 2 },
    ];
    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'general-trend',
        priority: (insights[0] as any).priority,
        change: {
          from: (insights[0] as any).change.from,
          to: (insights[0] as any).change.to,
          strength: 'weak-growth',
        },
        from: 0,
        to: 10,
        dataKey: 'y',
      },
    ]);
  });

  test('insights-extraction/general-trends/growth', () => {
    const data = [
      { x: 0, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 9 },
      { x: 9, y: 10 },
      { x: 10, y: 11 },
    ];
    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'general-trend',
        priority: (insights[0] as any).priority,
        change: {
          from: (insights[0] as any).change.from,
          to: (insights[0] as any).change.to,
          strength: 'strong-growth',
        },
        from: 0,
        to: 10,
        dataKey: 'y',
      },
    ]);
  });

  test('insights-extraction/general-trends/strong-growth', () => {
    const data = [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 5 },
      { x: 3, y: 7 },
      { x: 4, y: 9 },
      { x: 5, y: 11 },
      { x: 6, y: 13 },
      { x: 7, y: 15 },
      { x: 8, y: 17 },
      { x: 9, y: 19 },
      { x: 10, y: 21 },
    ];
    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'general-trend',
        priority: (insights[0] as any).priority,
        change: {
          from: (insights[0] as any).change.from,
          to: (insights[0] as any).change.to,
          strength: 'strong-growth',
        },
        from: 0,
        to: 10,
        dataKey: 'y',
      },
    ]);
  });

  test('insights-extraction/general-trends/weak-reduction', () => {
    const data = [
      { x: 0, y: 2 },
      { x: 1, y: 1.9 },
      { x: 2, y: 1.8 },
      { x: 3, y: 1.7 },
      { x: 4, y: 1.6 },
      { x: 5, y: 1.5 },
      { x: 6, y: 1.4 },
      { x: 7, y: 1.3 },
      { x: 8, y: 1.2 },
      { x: 9, y: 1.1 },
      { x: 10, y: 1 },
    ];
    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'general-trend',
        priority: (insights[0] as any).priority,
        change: {
          from: (insights[0] as any).change.from,
          to: (insights[0] as any).change.to,
          strength: 'weak-reduction',
        },
        from: 0,
        to: 10,
        dataKey: 'y',
      },
    ]);
  });

  test('insights-extraction/trends/peak', () => {
    const data = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
      { x: 5, y: 5 },
      { x: 6, y: 4 },
      { x: 7, y: 3 },
      { x: 8, y: 2 },
      { x: 9, y: 1 },
      { x: 10, y: 0 },
    ];
    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'trend',
        priority: (insights[0] as any).priority,
        change: {
          from: (insights[0] as any).change.from,
          to: (insights[0] as any).change.to,
          strength: 'strong-growth',
        },
        from: 0,
        to: 5,
        dataKey: 'y',
      },
      {
        type: 'trend',
        priority: (insights[1] as any).priority,
        change: {
          from: (insights[1] as any).change.from,
          to: (insights[1] as any).change.to,
          strength: 'strong-reduction',
        },
        from: 5,
        to: 10,
        dataKey: 'y',
      },
    ]);
  });

  test('insights-extraction/trends/random-data', () => {
    const data = Array(100)
      .fill(0)
      .map((_, x) => ({ x, y: x % 2 === 0 ? 10 : -10 }));
    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'general-trend',
        priority: (insights[0] as any).priority,
        change: {
          from: 0,
          to: 0,
          strength: 'static',
        },
        from: 0,
        to: 99,
        dataKey: 'y',
      },
    ]);
  });

  test('insights-extraction/clusters/base', () => {
    const data = pixelArtToPointsList(`
    AAA
    AA      FFF
              AA

    BBBBB
    CCAABB  DD
    EEE
  `);

    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'cluster',
        priority: 1,
        size: 14,
        labels: ['B', 'C', 'E', 'A'],
        relativeSize: 'significantly-bigger',
        center: {
          x: (insights[0] as ClusterNode).center.x,
          y: (insights[0] as ClusterNode).center.y,
          xLabel: 'x',
          yLabel: 'y',
        },
      },
      {
        type: 'cluster',
        priority: 1,
        size: 5,
        labels: ['A'],
        relativeSize: 'average',
        center: {
          x: (insights[1] as ClusterNode).center.x,
          y: (insights[1] as ClusterNode).center.y,
          xLabel: 'x',
          yLabel: 'y',
        },
      },
      {
        type: 'cluster',
        priority: 1,
        size: 5,
        labels: ['F', 'A'],
        relativeSize: 'average',
        center: {
          x: (insights[2] as ClusterNode).center.x,
          y: (insights[2] as ClusterNode).center.y,
          xLabel: 'x',
          yLabel: 'y',
        },
      },
      {
        type: 'cluster',
        priority: 1,
        size: 2,
        labels: ['D'],
        relativeSize: 'smaller',
        center: {
          x: (insights[3] as ClusterNode).center.x,
          y: (insights[3] as ClusterNode).center.y,
          xLabel: 'x',
          yLabel: 'y',
        },
      },
    ]);
  });

  test('insights-extraction/values/base', () => {
    const data = {
      A: 100,
      B: 200,
      C: 300,
    };
    const { insights } = extractDataInsights(data, makeHints(), makeConfig());
    expect(insights).toEqual([
      {
        type: 'comparison',
        values: [
          {
            label: 'C',
            value: 300,
          },
          {
            label: 'B',
            value: 200,
          },
          {
            label: 'A',
            value: 100,
          },
        ],
        priority: 1,
      },
    ]);
  });

  test('insights-extraction/titles/values-set', () => {
    const data = {
      some_deep_field: {
        with_real_data: {
          A: 100,
          B: 200,
          C: 300,
        },
      },
    };
    const hints = {
      ...makeHints(),
      fields: {
        ...makeHints().fields,
        values: {
          A: 100,
          B: 200,
          C: 300,
          D: 400,
        },
      },
    };
    const { insights } = extractDataInsights(data, hints, makeConfig());
    expect(insights).toEqual([
      {
        type: 'comparison',
        values: [
          {
            label: 'D',
            value: 400,
          },
          {
            label: 'C',
            value: 300,
          },
          {
            label: 'B',
            value: 200,
          },
          {
            label: 'A',
            value: 100,
          },
        ],
        priority: 1,
      },
    ]);
  });

  test('insights-extraction/grid-size', () => {
    const data = pixelArtToPointsList(`
  AAA
  AA      FFF
            AA






            
  BBBBB
  CCAABB  DD
  EEE
`);
    const hints = {
      ...makeHints(),
      grid: {
        verticalAxes: 5,
        horizontalAxes: 5,
      },
    };
    const { insights } = extractDataInsights(data, hints, makeConfig());
    expect(insights.length).toBe(2);
  });

  test('insights-extraction/titles/points-cloud', () => {
    const data = pixelArtToPointsList(`
  AAA
  AA      FFF
            AA

  BBBBB
  CCAABB  DD
  EEE
    `);

    const hints = {
      ...makeHints(),
      title: {
        ...makeHints().title,
        horizontalAxes: 'horizontalAxes',
        verticalAxes: 'verticalAxes',
      },
    };
    const { insights } = extractDataInsights(data, hints, makeConfig());
    expect(insights.length).toBeGreaterThan(0);
    expect(
      (insights as ClusterNode[]).map((insight) => [insight.center.xLabel, insight.center.yLabel]),
    ).toEqual(Array(insights.length).fill(['horizontalAxes', 'verticalAxes']));
  });

  test('insights-extraction/grouped-values', () => {
    const data = {};
    const hints: DataStructureHints = {
      ...makeHints(),
      groups: {
        a: {
          groupName: 'My super group A',
          values: {
            c: 1,
            d: 5,
          },
        },
        b: {
          groupName: 'My super group B',
          values: {
            c: 200,
            d: 50,
          },
        },
      },
      dataType: 'grouped-values',
    };
    const { insights } = extractDataInsights(data, hints, makeConfig());
    expect(insights).toEqual([
      {
        label: 'My super group B',
        priority: (insights[0] as any).priority,
        type: 'comparison',
        values: [
          {
            label: 'c',
            value: 200,
          },
          {
            label: 'd',
            value: 50,
          },
        ],
      },
      {
        label: 'My super group A',
        priority: (insights[1] as any).priority,
        type: 'comparison',
        values: [
          {
            label: 'd',
            value: 5,
          },
          {
            label: 'c',
            value: 1,
          },
        ],
      },
    ]);
  });

  test('insights-extraction/titles/values-set', () => {
    const data = {
      A: 100,
      B: 200,
      C: 300,
    };
    const hints = {
      ...makeHints(),
      title: {
        ...makeHints().title,
        values: {
          A: 'a-haha',
          B: 'b-anana',
          C: 'C-onan Doyle',
        },
      },
    };
    const { insights } = extractDataInsights(data, hints, makeConfig());
    expect(
      (insights[0] as ComparisonNode).values
        .map(({ label }) => label)
        .sort((a: string, b: string) => a.localeCompare(b)),
    ).toEqual(['a-haha', 'b-anana', 'C-onan Doyle']);
  });

  test('insights-extraction/auto-data-type/time-series', () => {
    const data = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
    ];
    const { dataType } = extractDataInsights(data, makeHints(), makeConfig());
    expect(dataType).toBe('time-series');
  });

  test('insights-extraction/auto-data-type/values-set/array', () => {
    const data = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ];
    const { dataType } = extractDataInsights(data, makeHints(), makeConfig());
    expect(dataType).toBe('values-set');
  });

  test('insights-extraction/auto-data-type/values-set/dict', () => {
    const data = {};
    for (let i = 0; i < 27; i++) {
      const char = String.fromCharCode('A'.charCodeAt(0) + i);
      data[char] = i;
    }
    const { dataType } = extractDataInsights(data, makeHints(), makeConfig());
    expect(dataType).toBe('values-set');
  });

  test('insights-extraction/auto-data-type/points-cloud/default-names', () => {
    const data = [
      {
        x: 0,
        y: 0,
        value: 0,
      },
    ];
    const { dataType } = extractDataInsights(data, makeHints(), makeConfig());
    expect(dataType).toBe('points-cloud');
  });

  test('insights-extraction/auto-data-type/points-cloud/hints-names', () => {
    const data = [{}];
    const hints: DataStructureHints = {
      ...makeHints(),
      fields: {
        verticalAxes: new Set<string>(['x']),
        horizontalAxes: new Set<string>(['y']),
        valueAxes: new Set<string>(['value']),
        values: {},
      },
    };
    const { dataType } = extractDataInsights(data, hints, makeConfig());
    expect(dataType).toBe('points-cloud');
  });

  test('insights-extraction/data-range/time-series', () => {
    const data = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
      { x: 10, y: 1 },
    ];
    const { dataRange } = extractDataInsights(data, makeHints(), makeConfig());
    expect(dataRange).toEqual({
      from: 0,
      to: 10,
      label: 'x',
    });
  });

  test('insights-extraction/data-range/cloud-points', () => {
    const data = pixelArtToPointsList(`
    AAAAAAAAAAAAAAAAA
  `);

    const { dataRange } = extractDataInsights(data, makeHints(), makeConfig());
    expect(dataRange).toEqual({
      // not sure data range from and to is needed
      from: 4,
      to: 20,
      label: null,
    });
  });

  test('insights-extraction/data-title/from-horizaontal-title', () => {
    const data = [{}];
    const hints = {
      ...makeHints(),
      title: { ...makeHints().title, horizontalAxes: 'Hello world' },
    };

    const { dataTitle } = extractDataInsights(data, hints, makeConfig());
    expect(dataTitle).toBe('Hello world');
  });
  test('insights-extraction/data-title/from-vertical-title', () => {
    const data = [{}];
    const hints = { ...makeHints(), title: { ...makeHints().title, verticalAxes: 'Hello world' } };

    const { dataTitle } = extractDataInsights(data, hints, makeConfig());
    expect(dataTitle).toBe('Hello world');
  });
  test('insights-extraction/data-title/vertical-priority', () => {
    const data = [{}];
    const hints = {
      ...makeHints(),
      title: {
        ...makeHints().title,
        horizontalAxes: 'horizontalAxes',
        verticalAxes: 'verticalAxes',
      },
    };

    const { dataTitle } = extractDataInsights(data, hints, makeConfig());
    expect(dataTitle).toBe('verticalAxes');
  });

  test('insights-extraction/data-title/vertical-priority', () => {
    const data = [{}];
    const hints = {
      ...makeHints(),
      title: {
        ...makeHints().title,
        horizontalAxes: 'horizontalAxes',
        verticalAxes: 'verticalAxes',
      },
    };

    const { dataTitle } = extractDataInsights(data, hints, makeConfig());
    expect(dataTitle).toBe('verticalAxes');
  });

  test('insights-extraction/trends/from-static-to-growth', () => {
    const { insights } = extractDataInsights(
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
        { x: 4, y: 0 },
        { x: 5, y: 1.1 },
        { x: 6, y: 1.2 },
        { x: 7, y: 1.3 },
        { x: 8, y: 1.4 },
        { x: 9, y: 1.5 },
        { x: 10, y: 1.6 },
      ],
      makeHints(),
      makeConfig(),
    );
    expect(
      insights.find((insight) => insight.type === 'trend' && insight.from >= 5) !== undefined,
    ).toBeTruthy();
  });

  test('serizalizetion/basic', () => {
    const insights: Insight[] = [
      {
        type: 'general-trend',
        priority: 1,
        change: { from: 0, to: 10, strength: 'growth' },
        from: 0,
        to: 10,
        dataKey: 'y',
      },
    ];
    const dataTitle = 'Awesome data';
    const dataType = 'time-series';
    const dataRange: AnalyzedData['dataRange'] = { from: 0, to: 10, label: 'x' };
    const text = serialize({ insights, dataType, dataRange, dataTitle }, makeConfig(), {
      locale: 'en',
    });

    expect(text.includes('0')).toBeTruthy();
    expect(text.includes('10')).toBeTruthy();
    expect(text.includes('Awesome data')).toBeTruthy();
    expect(text.includes('grow')).toBeTruthy();
    expect(text.includes('x')).toBeTruthy();
    expect(text.includes('y')).toBeTruthy();
  });

  test('serizalizetion/insights-cut', () => {
    const insights: Insight[] = Array(10000)
      .fill(0)
      .map(() => ({
        type: 'trend',
        priority: 1,
        change: { from: Math.random() * 10, to: 20 + Math.random() * 100, strength: 'growth' },
        from: Math.random() * 10,
        to: 20 + Math.random() * 100,
        dataKey: 'y',
      }));
    const dataTitle = 'Awesome data';
    const dataType = 'time-series';
    const dataRange: AnalyzedData['dataRange'] = { from: 0, to: 120, label: 'x' };
    const text = serialize({ insights, dataType, dataRange, dataTitle }, makeConfig(), {
      locale: 'en',
    });

    const limit = 500;
    const length = text.length;

    if (length >= limit) {
      // eslint-disable-next-line no-console
      console.log(
        `Expected summarization result for a huge count of insights be limited, for example, by ${limit} characters (got ${length})`,
      );
    }
    expect(length).toBeLessThan(limit);
  });

  test('serizalizetion/basic', () => {
    const insights: Insight[] = [
      {
        type: 'general-trend',
        priority: 1,
        change: { from: 0, to: 10, strength: 'growth' },
        from: 0,
        to: 10,
        dataKey: 'y',
      },
    ];
    const dataTitle = 'Awesome data';
    const dataType = 'time-series';
    const dataRange: AnalyzedData['dataRange'] = { from: 0, to: 10, label: 'x' };
    const locale = { locale: 'en' };
    const text = serialize({ insights, dataType, dataRange, dataTitle }, makeConfig(), locale);

    expect(text.includes('0')).toBeTruthy();
    expect(text.includes('10')).toBeTruthy();
    expect(text.includes('Awesome data')).toBeTruthy();
    expect(text.includes('grow')).toBeTruthy();
    expect(text.includes('x')).toBeTruthy();
    expect(text.includes('y')).toBeTruthy();
  });

  test('serizalizetion/locale-switch', () => {
    const insights: Insight[] = [
      {
        type: 'general-trend',
        priority: 1,
        change: { from: 0, to: 10, strength: 'growth' },
        from: 0,
        to: 10,
        dataKey: 'y',
      },
    ];
    const dataTitle = 'Awesome data';
    const dataType = 'time-series';
    const dataRange: AnalyzedData['dataRange'] = { from: 0, to: 10, label: 'x' };

    const locale = { locale: 'ES', translations: { ES: {} } };
    for (const messageId in translations.en) {
      locale.translations.ES[messageId] = 'EcmaScript';
    }

    const text = serialize({ insights, dataType, dataRange, dataTitle }, makeConfig(), locale);

    expect(text.includes('EcmaScript')).toBeTruthy();
  });

  test('serizalizetion/all-texts-are-used', () => {
    const translationsList = Object.keys(translations.en).filter(
      (messageId) => !messageId.startsWith('view-'),
    );
    const usedMessages = new Set<string>();

    const locale = {
      locale: 'en',
      translations: {
        en: new Proxy(translations.en, {
          get(target, property) {
            if (typeof property === 'symbol') return;
            usedMessages.add(property);
            return target[property];
          },
        }),
      },
    };

    serialize(
      extractDataInsights(
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 4, y: 0 },
          { x: 5, y: 1.1 },
          { x: 6, y: 1.2 },
          { x: 7, y: 1.3 },
          { x: 8, y: 1.4 },
          { x: 9, y: 1.5 },
          { x: 10, y: 1.6 },
          { x: 11, y: 1.7 },
          { x: 12, y: 1.8 },
          { x: 13, y: 1.9 },
          { x: 14, y: 1.1 },
          { x: 15, y: 1.11 },
          { x: 16, y: 0 },
          { x: 16, y: 0 },
          { x: 16, y: 0 },
          { x: 16, y: 0 },
          { x: 16, y: 0 },
          { x: 16, y: 0 },
          { x: 16, y: 0 },
          { x: 16, y: 0 },
          { x: 17, y: -1 },
          { x: 18, y: -2 },
          { x: 19, y: -3 },
          { x: 20, y: -4 },
          { x: 21, y: -5 },
          { x: 22, y: 0 },
          { x: 23, y: 0 },
          { x: 24, y: 0 },
          { x: 24, y: 0 },
          { x: 24, y: 0 },
          { x: 24, y: 0 },
          { x: 24, y: 0 },
          { x: 24, y: 0 },
          { x: 25, y: -0.1 },
          { x: 26, y: -0.2 },
          { x: 27, y: -0.3 },
          { x: 28, y: -0.4 },
          { x: 29, y: -0.5 },
          { x: 30, y: -0.6 },
        ],
        { ...makeHints(), title: { ...makeHints().title, horizontalAxes: 'Awesome chart' } },
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );

    serialize(
      extractDataInsights(
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 4, y: 0 },
        ],
        {
          ...makeHints(),
          dataType: 'time-series',
          title: { ...makeHints().title, horizontalAxes: 'Awesome chart' },
        },
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );
    serialize(
      extractDataInsights(
        [
          { x: 0, y: 0 },
          { x: 1, y: 0.2 },
          { x: 2, y: 0.4 },
          { x: 3, y: 0.6 },
          { x: 4, y: 0.8 },
        ],
        {
          ...makeHints(),
          dataType: 'time-series',
          title: { ...makeHints().title, horizontalAxes: 'Awesome chart' },
        },
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );
    serialize(
      extractDataInsights(
        [
          { x: 0, y: 0 },
          { x: 1, y: 0.2 },
          { x: 2, y: 0.4 },
          { x: 3, y: 0.6 },
          { x: 4, y: 0.8 },
        ],
        {
          ...makeHints(),
          dataType: 'time-series',
          title: { ...makeHints().title, horizontalAxes: 'Awesome chart' },
        },
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );
    serialize(
      extractDataInsights(
        [
          { x: 0, y: 0 },
          { x: 1, y: -0.5 },
          { x: 2, y: -1 },
          { x: 3, y: -1.5 },
          { x: 4, y: -2 },
        ],
        {
          ...makeHints(),
          dataType: 'time-series',
          title: { ...makeHints().title, horizontalAxes: 'Awesome chart' },
        },
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );
    serialize(
      extractDataInsights(
        pixelArtToPointsList(`
        AAA
        AA      FFF
                  AA

        BBBBB
        CCAABB  DD
        EEE

        A
      `),
        makeHints(),
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );
    serialize(
      extractDataInsights(
        pixelArtToPointsList(`
        1
      `),
        makeHints(),
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );

    serialize(
      extractDataInsights(
        pixelArtToPointsList(`
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

        AAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAA

        AAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAA

        AAAAAAAAAAAAAA
        AAAAAAAAAAAAAA

        AAAAAAA
        AAAAAAA

        A
      `),
        makeHints(),
        makeConfig(),
      ),
      makeConfig({ clustersLimit: Infinity }),
      locale,
    );
    serialize(
      extractDataInsights(
        [
          { x: 0, y: 0, value: 1, label: 'named point' },
          { x: 200, y: 0, value: 100 },
        ],
        makeHints(),
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );

    serialize(
      extractDataInsights(
        {
          A: 100,
          B: 'B',
          C: { displayName: 'Some ReactComponent-like object' },
          D: 10,
          E: 10,
          F: 10,
          G: 10,
        },
        makeHints(),
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );
    serialize(
      extractDataInsights(
        [],
        {
          ...makeHints(),
          groups: {
            a: {
              groupName: 'My super group A',
              values: {
                c: 1,
                d: 5,
              },
            },
            b: {
              groupName: 'My super group B',
              values: {
                c: 200,
                d: 50,
              },
            },
          },
          dataType: 'grouped-values',
        },
        makeConfig(),
      ),
      makeConfig(),
      locale,
    );

    const unusedMessages = translationsList.filter((messageId) => !usedMessages.has(messageId));
    const unusedMessagesCount = unusedMessages.length;
    const unusedMessagesJoin = unusedMessages.join(', ');

    if (unusedMessagesCount !== 0) {
      // eslint-disable-next-line no-console
      console.log(
        `Expected all non-view translations messages be used (unused messages [${unusedMessagesCount}]: ${unusedMessagesJoin})`,
      );
    }
    expect(unusedMessages).toHaveLength(0);
  });

  test('serialization/trends/no-ellipsis-on-too-much-trends', () => {
    const text = serialize(
      extractDataInsights(
        Array(10000)
          .fill(0)
          .map((_, x) => ({ x, y: Math.sin(Math.exp(x)) * 10 })),
        makeHints(),
        makeConfig(),
      ),
      makeConfig(),
      {
        locale: 'en',
        translations: {
          en: { ...translations.en, 'time-series-local-trend': '%TREND%', ellipsis: '%ELLIPSIS%' },
        },
      },
    );

    expect(text.includes('%TREND%')).toBeTruthy();
    expect(text.includes('%ELLIPSIS%')).toBeFalsy();
  });
});
