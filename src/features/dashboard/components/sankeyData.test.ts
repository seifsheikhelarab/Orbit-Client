import { describe, expect, it } from 'bun:test';
import { buildPipelineSankeyData } from './SankeyChart';

describe('buildPipelineSankeyData', () => {
  it('keeps only forward pipeline links and aggregates duplicates', () => {
    const data = buildPipelineSankeyData({
      nodes: [
        { name: 'Saved' },
        { name: 'Applied' },
        { name: 'Phone Screen' },
        { name: 'Interview' },
        { name: 'Offer' },
        { name: 'Closed' },
      ],
      links: [
        { source: 1, target: 2, value: 3 },
        { source: 2, target: 1, value: 99 },
        { source: 1, target: 2, value: 2 },
        { source: 3, target: 3, value: 4 },
        { source: 4, target: 5, value: 0 },
      ],
    });

    expect(data.links).toEqual([{ source: 1, target: 2, value: 5 }]);
  });
});
