import { useState, memo, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, TrendingUp, TrendingDown, Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAnalyticsSummary,
  useApplicationsOverTime,
  useRecentActivity
} from '../api/useAnalytics';
import { SankeyChart } from '../components/SankeyChart';
import { PipelineFunnelChart } from '../components/PipelineFunnelChart';
import { useAnimatedCounter, formatCounter } from '@/hooks/useAnimatedCounter';

const DATE_RANGES = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: 'Year', value: 'year' },
  { label: 'All time', value: 'all' },
];

export function DashboardOverview() {
  const [dateRange, setDateRange] = useState('30d');
  const { data: summary, isLoading } = useAnalyticsSummary(dateRange);
  const isEmpty = !isLoading && (summary?.totalApplications === 0 || summary?.totalApplications === undefined);

  const stats = useMemo(() => [
    {
      title: "Applications",
      value: summary?.totalApplications?.toString() || "0",
      trend: summary?.totalApplicationsTrend,
      trendDir: summary?.totalApplicationsTrendDirection,
      accent: "from-primary/20 to-transparent",
    },
    {
      title: "Active",
      value: summary?.activePipeline?.toString() || "0",
      trend: summary?.activeTrend,
      trendDir: summary?.activeTrendDirection,
      accent: "from-tertiary-fixed/30 to-transparent",
    },
    {
      title: "Response Rate",
      value: `${summary?.responseRate || 0}%`,
      trend: summary?.responseRateTrend,
      trendDir: summary?.responseRateTrendDirection,
      accent: "from-primary-fixed/40 to-transparent",
    },
    {
      title: "Offer Rate",
      value: `${summary?.offerRate || 0}%`,
      trend: summary?.offerRateTrend,
      trendDir: summary?.offerRateTrendDirection,
      accent: "from-tertiary-fixed/40 to-transparent",
    }
  ], [summary]);

  return (
    <PageContainer maxWidth="xl" className="pb-16">
      {/* Refined Header */}
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Performance metrics for your current search."
        className="mb-10"
        actions={
          <div className="relative group">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-surface-container-low hover:bg-surface-container border border-outline-variant/10 rounded-xl px-4 py-2 pr-10 text-label-sm font-bold text-on-surface cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            >
              {DATE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none transition-colors" />
          </div>
        }
      />

      {/* Empty State - Enhanced */}
      {isEmpty && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Welcome Card */}
          <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/10">
            <div className="flex items-start gap-5 max-w-2xl">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="size-7 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-title-lg font-bold text-on-surface mb-2">Welcome to Your Dashboard</h2>
                <p className="text-body-md text-on-surface-variant mb-6">
                  Track every job application, never miss a follow-up, and land your next role faster.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/app/applications/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover transition-all shadow-sm"
                  >
                    Add a new Application
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    to="/app/applications"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-semibold text-sm hover:bg-surface-container-low transition-all"
                  >
                    View All Applications
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Applications", desc: "Track all your job applications" },
              { title: "Active", desc: "Applications in progress" },
              { title: "Response Rate", desc: "Percentage of responses" },
              { title: "Offer Rate", desc: "Percentage of offers" }
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex flex-col justify-between min-h-30">
                <span className="text-label-sm font-bold text-on-surface-variant/60">{stat.title}</span>
                <div>
                  <p className="text-3xl font-black text-on-surface/20 font-headline tracking-tight leading-none mb-1">--</p>
                  <p className="text-label-sm text-on-surface-variant/40">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty Charts Placeholder */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex flex-col items-center justify-center min-h-60">
              <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                <TrendingUp className="size-8 text-primary/30" />
              </div>
              <p className="text-label-sm font-bold text-on-surface-variant/40 mb-1">Pipeline Funnel</p>
              <p className="text-label-sm text-on-surface-variant/40">Charts will appear when you add applications</p>
            </div>
            <div className="xl:col-span-2 p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex flex-col items-center justify-center min-h-60">
              <div className="size-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-4">
                <Sparkles className="size-8 text-accent/30" />
              </div>
              <p className="text-label-sm font-bold text-on-surface-variant/40 mb-1">Application Flow</p>
              <p className="text-label-sm text-on-surface-variant/40">Visualization will appear when you add applications</p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content - Only show when not empty */}
      {!isEmpty && (
        <div className="space-y-8">
          {/* Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl bg-surface-container-low" />
              ))
            ) : (
              stats.map((stat, i) => (
                <StatCard
                  key={i}
                  title={stat.title}
                  value={stat.value}
                  trend={stat.trend}
                  trendDir={stat.trendDir as any}
                  index={i}
                />
              ))
            )}
          </div>

          {/* Pipeline Visualization */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150 fill-mode-both">
            <PipelineFunnelChart dateRange={dateRange} />
            <div className="xl:col-span-2">
              <SankeyChart />
            </div>
          </div>

          {/* Secondary Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200 fill-mode-both">
            <div className="lg:col-span-3">
              <ApplicationsOverTime dateRange={dateRange} />
            </div>
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

const StatCard = memo(function StatCard({
  title,
  value,
  trend,
  trendDir,
  index,
}: {
  title: string,
  value: string,
  trend?: string | number,
  trendDir?: 'up' | 'down' | 'neutral',
  index?: number,
}) {
  const direction = trendDir || 'neutral';
  
  // Extract numeric value for animation
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  const isPercentage = value.includes('%');
  
  const animatedValue = useAnimatedCounter(numericValue, {
    delay: (index || 0) * 50 + 50,
    duration: 500
  });

  return (
    <div
      className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex flex-col justify-between min-h-30 transition-all hover:bg-surface-container hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both"
      style={{ animationDelay: `${index ? index * 50 : 0}ms` }}
    >
      <div className="flex justify-between items-start">
        <span className="text-label-sm font-bold text-on-surface-variant/60">{title}</span>
        {direction !== 'neutral' && (
          <div className={`flex items-center gap-1 ${direction === 'up' ? 'text-success' : 'text-error'} animate-in fade-in zoom-in duration-300`} style={{ animationDelay: `${(index || 0) * 50 + 200}ms` }}>
            {direction === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="text-label-sm font-bold">{trend}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-on-surface font-headline tracking-tight leading-none">
        {formatCounter(animatedValue, { suffix: isPercentage ? '%' : '' })}
      </p>
    </div>
  );
});

const ApplicationsOverTime = memo(function ApplicationsOverTime({ dateRange }: { dateRange: string }) {
  const navigate = useNavigate();
  const { data: overTime, isLoading } = useApplicationsOverTime(dateRange);

  const maxCount = useMemo(() => {
    if (!overTime || overTime.length === 0) return 1;
    return Math.max(...overTime.map((d: any) => d.count || 0), 1);
  }, [overTime]);

  const formatDate = (period: string) => {
    const date = new Date(period);
    switch (dateRange) {
      case '7d':
        return date.toLocaleDateString(undefined, { weekday: 'short' });
      case '30d':
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      case '90d':
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      case 'year':
        return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      case 'all':
        return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) return <Skeleton className="h-[60] rounded-2xl bg-surface-container-low" />;

  // Dynamic label density based on date range
  const shouldShowLabel = (index: number, total: number) => {
    if (dateRange === '7d' || dateRange === '30d') return true;
    if (dateRange === '90d') return index % 2 === 0;
    if (dateRange === 'year' || dateRange === 'all') {
      const step = Math.ceil(total / 8);
      return index % step === 0;
    }
    return true;
  };

  return (
    <div
      onClick={() => navigate('/app/applications')}
      className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10 cursor-pointer hover:bg-surface-container transition-all group animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both"
    >
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-title-sm font-bold text-on-surface">Activity</h3>
      </div>

      <div className="flex items-end justify-between gap-1.5 h-40">
        {overTime?.map((bar: any, i: number) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group/bar">
            <div
              className="w-full max-w-6 bg-primary/20 rounded-t-md transition-all duration-300 group-hover/bar:bg-primary/40 animate-in fade-in slide-in-from-bottom-full fill-mode-both"
              style={{
                height: `${(bar.count / maxCount) * 100}%`,
                animationDelay: `${i * 30 + 150}ms`
              }}
            />
            <span className="text-label-sm font-bold text-on-surface-variant/40 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
              {shouldShowLabel(i, overTime.length) ? formatDate(bar.period) : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

const RecentActivity = memo(function RecentActivity() {
  const { data: recent, isLoading } = useRecentActivity();

  if (isLoading) return <Skeleton className="h-60 rounded-2xl bg-surface-container-low" />;

  return (
    <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/10 animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-title-sm font-bold text-on-surface">Activity</h3>
      </div>

      <div className="space-y-1">
        {recent?.slice(0, 5).map((item: any, i: number) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-surface-container transition-colors group animate-in fade-in slide-in-from-right-2 duration-300 fill-mode-both"
            style={{ animationDelay: `${i * 50 + 200}ms` }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{item.company}</p>
              <p className="text-label-sm text-on-surface-variant">{item.toStatus}</p>
            </div>
            <span className="text-label-sm text-on-surface-variant/30 font-medium whitespace-nowrap ml-4">
              {new Date(item.changedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
