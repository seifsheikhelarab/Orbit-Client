import { usePipelineFunnel } from '../api/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Funnel, FunnelChart, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { STATUS_DASHBOARD_COLORS } from '@/lib/status';

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
       <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 group animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 fill-mode-both">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-label-sm font-bold text-on-surface">Pipeline Funnel</h3>
        <div className="flex items-center gap-2">
          <span className="text-label-sm text-on-surface-variant/40">Efficiency</span>
        </div>
      </div>
      
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart layout="horizontal" margin={{ top: 20, right: 40, left: 40, bottom: 40 }}>
            <Tooltip
              animationDuration={500}
              animationEasing="ease-out"
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--color-outline)',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                padding: '8px 12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Funnel
              data={chartData}
              dataKey="value"
              animationDuration={300}
              animationBegin={150}
            >
              <LabelList 
                position="bottom" 
                fill="#4b5563" 
                stroke="none" 
                dataKey="name" 
                fontSize={11}
                fontWeight={800}
                className="uppercase"
              />
              {chartData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  fillOpacity={0.8}
                  className="transition-all duration-300 hover:fill-opacity-100 cursor-pointer"
                />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  return STATUS_DASHBOARD_COLORS[status as keyof typeof STATUS_DASHBOARD_COLORS] || '#1a1a2e';
}
