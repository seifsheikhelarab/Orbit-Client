import { usePipelineFunnel } from '../api/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Funnel, FunnelChart, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

export function PipelineFunnelChart({ dateRange }: { dateRange: string }) {
  const { data, isLoading } = usePipelineFunnel(dateRange);

  if (isLoading) return <Skeleton className="h-[450px] rounded-2xl bg-surface-container-low" />;
  if (!data) return null;

  // Map backend status to user-friendly names
  const chartData = data.map((item: any) => ({
    name: item.status.replace(/_/g, ' '),
    value: item.count,
    conversion: item.conversionFromPrev,
    fill: getStatusColor(item.status)
  }));

  return (
       <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-label-sm font-bold text-on-surface uppercase tracking-wider">Pipeline Funnel</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/40">Efficiency</span>
        </div>
      </div>
      
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart layout="horizontal" margin={{ top: 20, right: 40, left: 40, bottom: 40 }}>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #dcbed1',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '700',
                textTransform: 'uppercase',
                padding: '8px 12px'
              }}
            />
            <Funnel
              data={chartData}
              dataKey="value"
            >
              <LabelList 
                position="bottom" 
                fill="#56404f" 
                stroke="none" 
                dataKey="name" 
                fontSize={10}
                fontWeight={800}
                className="uppercase tracking-wider"
              />
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'APPLIED': '#a8009a',
    'PHONE_SCREEN': '#9c318d',
    'INTERVIEW': '#5c6000',
    'OFFER': '#0f766e',
    'CLOSED': '#56404f',
    'SAVED': '#dcbed1'
  };
  return colors[status] || '#1a1a2e';
}
