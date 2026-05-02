export interface PipelineSankeyNode {
  name: string;
}

export interface PipelineSankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface PipelineSankeyData {
  nodes: PipelineSankeyNode[];
  links: PipelineSankeyLink[];
}

const PIPELINE_NODES: PipelineSankeyNode[] = [
  { name: 'Saved' },
  { name: 'Applied' },
  { name: 'Phone Screen' },
  { name: 'Interview' },
  { name: 'Offer' },
  { name: 'Closed' },
];

export function buildPipelineSankeyData(data?: PipelineSankeyData | null): PipelineSankeyData {
  const nodes = data?.nodes?.length ? data.nodes : PIPELINE_NODES;
  const linksByTransition = new Map<string, PipelineSankeyLink>();

  for (const link of data?.links ?? []) {
    const source = Number(link.source);
    const target = Number(link.target);
    const value = Number(link.value);

    if (!Number.isInteger(source) || !Number.isInteger(target) || !Number.isFinite(value)) continue;
    if (source < 0 || target < 0 || source >= nodes.length || target >= nodes.length) continue;
    if (target <= source || value <= 0) continue;

    const key = `${source}-${target}`;
    const existing = linksByTransition.get(key);
    linksByTransition.set(key, {
      source,
      target,
      value: (existing?.value ?? 0) + value,
    });
  }

  return {
    nodes,
    links: Array.from(linksByTransition.values()),
  };
}
