import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { AllDataCollectionStats } from '@/types/analytics';

interface DataCollectionChartProps {
  data: AllDataCollectionStats;
  title?: string;
}

export function DataCollectionChart({ data, title = 'Data Collection Overview' }: DataCollectionChartProps) {
  const chartData = useMemo(() => {
    return data.projects.map((project) => ({
      name: project.project_name.length > 15
        ? project.project_name.substring(0, 15) + '...'
        : project.project_name,
      fullName: project.project_name,
      Apps: project.apps,
      Reviews: project.reviews,
      News: project.news,
      Tweets: project.tweets,
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('data-collection-chart', 'data-collection-overview');
    exportDataAsCSV(chartData, 'data-collection-data');
  };

  return (
    <ChartContainer title={title} description={`Total: ${data.total_apps + data.total_reviews + data.total_news + data.total_tweets} items`} onExport={handleExport}>
      <div id="data-collection-chart">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-3 rounded shadow-lg">
                      <p className="font-semibold mb-2">{data.fullName}</p>
                      {payload.map((entry) => (
                        <p key={entry.name} style={{ color: entry.color }}>
                          {entry.name}: {entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="Apps" fill={CHART_COLORS.primary} />
            <Bar dataKey="Reviews" fill={CHART_COLORS.info} />
            <Bar dataKey="News" fill={CHART_COLORS.success} />
            <Bar dataKey="Tweets" fill={CHART_COLORS.purple} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
