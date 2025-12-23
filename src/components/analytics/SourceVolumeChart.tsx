import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { SOURCE_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { DetailedSourceAnalysis } from '@/types/detailedAnalytics';

interface SourceVolumeChartProps {
  data: DetailedSourceAnalysis;
  title?: string;
}

export function SourceVolumeChart({ data, title = 'User Stories Volume per Source' }: SourceVolumeChartProps) {
  const chartData = useMemo(() => {
    if (!data?.sources) return [];

    return data.sources.map((sourceData) => ({
      source: sourceData.source.charAt(0).toUpperCase() + sourceData.source.slice(1),
      count: sourceData.total_stories,
      originalSource: sourceData.source,
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('source-volume-chart', 'source-volume-comparison');
    exportDataAsCSV(chartData, 'source-volume-data');
  };

  return (
    <ChartContainer
      title={title}
      description={`Total: ${data.total_stories} user stories across ${data.sources?.length || 0} sources`}
      onExport={handleExport}
    >
      <div id="source-volume-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="User Stories">
              {chartData.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  fill={SOURCE_COLORS[entry.originalSource as keyof typeof SOURCE_COLORS] || '#6b7280'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
