import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { SOURCE_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { DetailedSourceAnalysis } from '@/types/detailedAnalytics';

interface SourceDistributionPieChartProps {
  data: DetailedSourceAnalysis;
  title?: string;
}

export function SourceDistributionPieChart({
  data,
  title = 'Source Distribution'
}: SourceDistributionPieChartProps) {
  const chartData = useMemo(() => {
    if (!data?.sources || !data.total_stories) return [];

    const total = data.total_stories;
    return data.sources.map((sourceData) => ({
      name: sourceData.source.charAt(0).toUpperCase() + sourceData.source.slice(1),
      value: sourceData.total_stories,
      percentage: ((sourceData.total_stories / total) * 100).toFixed(1),
      source: sourceData.source,
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('source-distribution-pie', 'source-distribution');
    exportDataAsCSV(chartData, 'source-distribution-data');
  };

  return (
    <ChartContainer
      title={title}
      description="Distribution of user stories across data sources"
      onExport={handleExport}
    >
      <div id="source-distribution-pie">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={(entry: { name?: string; percentage?: string }) => `${entry.name}: ${entry.percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.source}`}
                  fill={SOURCE_COLORS[entry.source as keyof typeof SOURCE_COLORS] || '#6b7280'}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props) => [
                `${value} stories (${props.payload.percentage}%)`,
                name
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
