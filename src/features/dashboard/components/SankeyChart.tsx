import { ResponsiveContainer, Sankey, Tooltip, type SankeyLinkProps, type SankeyNodeProps } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { type ApplicationStatus, STATUS_DASHBOARD_COLORS } from '@/lib/status';
import { usePipelineFlow } from '../api/useAnalytics';

interface PipelineSankeyNode {
  name: string;
}

interface PipelineSankeyLink {
  source: number;
  target: number;
  value: number;
}

interface PipelineSankeyData {
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

// eslint-disable-next-line react-refresh/only-export-components
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

const STATUS_BY_LABEL: Record<string, ApplicationStatus> = {
  Saved: 'SAVED',
  Applied: 'APPLIED',
  'Phone Screen': 'PHONE_SCREEN',
  Interview: 'INTERVIEW',
  Offer: 'OFFER',
  Closed: 'CLOSED',
};

function getStatusColor(name?: string) {
  const status = name ? STATUS_BY_LABEL[name] : undefined;
  return status ? STATUS_DASHBOARD_COLORS[status] : '#1a1a2e';
}

function PipelineNode({ x, y, width, height, index, payload }: SankeyNodeProps) {
  const color = getStatusColor(payload.name);
  const labelX = x + width / 2;
  const labelAbove = index % 2 === 0;
  const labelY = labelAbove ? y - 22 : y + height + 24;
  const valueY = labelAbove ? labelY + 14 : labelY + 14;
  const [firstLabel, secondLabel] = payload.name === 'Phone Screen' ? ['Phone', 'Screen'] : [payload.name, undefined];

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={8} fill={color} />
      <text textAnchor="middle" x={labelX} y={labelY} fill="#111827" fontSize={11} fontWeight={900} className="uppercase tracking-[0.08em]">
        <tspan x={labelX}>{firstLabel}</tspan>
        {secondLabel ? <tspan x={labelX} dy={12}>{secondLabel}</tspan> : null}
      </text>
      <text textAnchor="middle" x={labelX} y={secondLabel ? valueY + 12 : valueY} fill="#4b5563" fontSize={11} fontWeight={700}>
        {payload.value ?? 0} applications
      </text>
    </g>
  );
}

function PipelineLink({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  payload,
}: SankeyLinkProps) {
  const sourceName = typeof payload.source === 'object' ? payload.source.name : undefined;
  const targetName = typeof payload.target === 'object' ? payload.target.name : undefined;
  const sourceColor = getStatusColor(sourceName);
  const targetColor = getStatusColor(targetName);
  const gradientId = `pipeline-link-${sourceName ?? 'source'}-${targetName ?? 'target'}`.replace(/\W+/g, '-');
  const halfWidth = Math.max(2, linkWidth) / 2;
  const path = [
    `M${sourceX},${sourceY - halfWidth}`,
    `C${sourceControlX},${sourceY - halfWidth} ${targetControlX},${targetY - halfWidth} ${targetX},${targetY - halfWidth}`,
    `L${targetX},${targetY + halfWidth}`,
    `C${targetControlX},${targetY + halfWidth} ${sourceControlX},${sourceY + halfWidth} ${sourceX},${sourceY + halfWidth}`,
    'Z',
  ].join(' ');

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor={sourceColor} />
          <stop offset="100%" stopColor={targetColor} />
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#${gradientId})`} fillOpacity={0.32} stroke="none" />
    </g>
  );
}

export function SankeyChart() {
  const { data, isLoading } = usePipelineFlow();
  const chartData = buildPipelineSankeyData(data);

  if (isLoading) return <Skeleton className="h-[450px] rounded-2xl bg-surface-container-low" />;

  return (
    <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 group min-h-[450px] animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 fill-mode-both">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-label-sm font-bold text-on-surface">Conversion Pipeline</h3>
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-success/60 animate-pulse" />
          <span className="text-label-sm text-on-surface-variant/40">Real-time</span>
        </div>
      </div>

      {chartData.links.length > 0 ? (
        <ResponsiveContainer width="100%" height={380}>
          <Sankey
            data={chartData}
            node={PipelineNode}
            nodePadding={56}
            nodeWidth={16}
            margin={{ top: 72, bottom: 72, left: 56, right: 112 }}
            link={PipelineLink}
          >
            <defs />
            <Tooltip 
              animationDuration={500}
              animationEasing="ease-out"
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--color-outline)',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '700',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '8px 12px'
              }}
            />
          </Sankey>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-80 items-center justify-center rounded-2xl bg-surface-container/60 text-center">
          <div className="max-w-xs space-y-2">
            <p className="text-title-sm font-bold text-on-surface">
              No conversion flow yet
            </p>
            <p className="text-body-sm font-medium text-on-surface-variant/70">
              Move applications through statuses to build a Sankey conversion path.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SankeyChart;
