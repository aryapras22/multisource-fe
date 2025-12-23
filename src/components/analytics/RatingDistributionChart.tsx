import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { RatingsDistribution } from '@/types/analytics';

interface RatingDistributionChartProps {
  data: RatingsDistribution;
  title?: string;
}

export function RatingDistributionChart({ data, title = 'Review Ratings Distribution' }: RatingDistributionChartProps) {
  const chartData = useMemo(() => {
    return [1, 2, 3, 4, 5].map((rating) => ({
      rating: `${rating} Star${rating > 1 ? 's' : ''}`,
      count: data.distribution[rating] || 0,
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('rating-distribution-chart', 'rating-distribution');
    exportDataAsCSV(chartData, 'rating-distribution-data');
  };

  return (
    <ChartContainer
      title={title}
      description={`Average: ${data.average_rating.toFixed(2)} | Total Reviews: ${data.total_reviews}`}
      onExport={handleExport}
    >
      <div id="rating-distribution-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={CHART_COLORS.warning}>
              {chartData.map((_, index) => {
                const colors = ['#ef4444', '#f59e0b', '#6b7280', '#3b82f6', '#10b981'];
                return <Bar key={`bar-${index}`} fill={colors[index]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
