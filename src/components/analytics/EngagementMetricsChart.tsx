import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { EngagementMetrics } from '@/types/analytics';

interface EngagementMetricsChartProps {
  data: EngagementMetrics;
  title?: string;
}

export function EngagementMetricsChart({ data, title = 'Social Media Engagement' }: EngagementMetricsChartProps) {
  const chartData = useMemo(() => {
    return [
      {
        name: 'Retweets',
        count: data.engagement.retweets,
        avg: data.average_per_tweet.retweets,
      },
      {
        name: 'Replies',
        count: data.engagement.replies,
        avg: data.average_per_tweet.replies,
      },
      {
        name: 'Likes',
        count: data.engagement.likes,
        avg: data.average_per_tweet.likes,
      },
      {
        name: 'Quotes',
        count: data.engagement.quotes,
        avg: data.average_per_tweet.quotes,
      },
    ];
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('engagement-chart', 'engagement-metrics');
    exportDataAsCSV(chartData, 'engagement-data');
  };

  return (
    <ChartContainer
      title={title}
      description={`Total Tweets: ${data.total_tweets} | Total Engagement: ${data.engagement.total}`}
      onExport={handleExport}
    >
      <div id="engagement-chart">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke={CHART_COLORS.primary} />
            <YAxis yAxisId="right" orientation="right" stroke={CHART_COLORS.info} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-3 rounded shadow-lg">
                      <p className="font-semibold mb-2">{data.name}</p>
                      <p style={{ color: CHART_COLORS.primary }}>
                        Total: {data.count}
                      </p>
                      <p style={{ color: CHART_COLORS.info }}>
                        Avg per Tweet: {data.avg.toFixed(2)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="count" fill={CHART_COLORS.primary} name="Total Count" />
            <Bar yAxisId="right" dataKey="avg" fill={CHART_COLORS.info} name="Avg per Tweet" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
