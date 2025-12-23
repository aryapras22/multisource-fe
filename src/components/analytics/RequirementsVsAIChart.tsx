import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { RequirementsComparison } from '@/types/detailedAnalytics';

interface RequirementsVsAIChartProps {
  data: RequirementsComparison;
  title?: string;
}

export function RequirementsVsAIChart({
  data,
  title = 'Requirements vs AI Requirements by Source'
}: RequirementsVsAIChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    return [
      {
        source: 'Review',
        'User Requirements': data.user_requirements.by_source.review,
        'AI Requirements': data.ai_requirements.by_source.review,
      },
      {
        source: 'News',
        'User Requirements': data.user_requirements.by_source.news,
        'AI Requirements': data.ai_requirements.by_source.news,
      },
      {
        source: 'Tweet',
        'User Requirements': data.user_requirements.by_source.tweet,
        'AI Requirements': data.ai_requirements.by_source.tweet,
      },
    ];
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('requirements-vs-ai-chart', 'requirements-vs-ai-comparison');
    exportDataAsCSV(chartData, 'requirements-vs-ai-data');
  };

  if (!data) return null;

  return (
    <ChartContainer
      title={title}
      description={`Total: ${data.user_requirements.total} user requirements → ${data.ai_requirements.total} AI requirements`}
      onExport={handleExport}
    >
      <div id="requirements-vs-ai-chart">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="User Requirements" fill={CHART_PALETTE[0]} />
            <Bar dataKey="AI Requirements" fill={CHART_PALETTE[1]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
