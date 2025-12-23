import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { SOURCE_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { AllRequirementsStats } from '@/types/analytics';

interface RequirementsOverviewChartProps {
  data: AllRequirementsStats;
  title?: string;
}

export function RequirementsOverviewChart({ data, title = 'Requirements by Source' }: RequirementsOverviewChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(data.source_distribution).map(([source, count]) => ({
      name: source.charAt(0).toUpperCase() + source.slice(1),
      'User Stories': count,
      source,
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('requirements-chart', 'requirements-overview');
    exportDataAsCSV(chartData, 'requirements-data');
  };

  return (
    <ChartContainer
      title={title}
      description={`Total User Stories: ${data.total_user_stories} | AI Stories: ${data.total_ai_stories}`}
      onExport={handleExport}
    >
      <div id="requirements-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="User Stories">
              {chartData.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  fill={SOURCE_COLORS[entry.source as keyof typeof SOURCE_COLORS] || '#6b7280'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
