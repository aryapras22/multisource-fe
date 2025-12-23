import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { ComparisonData } from '@/types/analytics';

interface ComparisonChartProps {
  data: ComparisonData;
  title?: string;
}

export function ComparisonChart({ data, title = 'Project Comparison' }: ComparisonChartProps) {
  const chartData = useMemo(() => {
    return data.projects.map((project) => ({
      name: project.project_name.length > 12
        ? project.project_name.substring(0, 12) + '...'
        : project.project_name,
      fullName: project.project_name,
      Apps: project.data_collection.apps,
      Reviews: project.data_collection.reviews,
      News: project.data_collection.news,
      Tweets: project.data_collection.tweets,
      'User Stories': project.requirements.user_stories,
      'AI Stories': project.requirements.ai_stories,
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('comparison-chart', 'project-comparison');
    exportDataAsCSV(chartData, 'comparison-data');
  };

  return (
    <ChartContainer title={title} description={`Comparing ${data.count} projects`} onExport={handleExport}>
      <div id="comparison-chart">
        <ResponsiveContainer width="100%" height={450}>
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
            <Bar dataKey="Apps" stackId="a" fill={CHART_PALETTE[0]} />
            <Bar dataKey="Reviews" stackId="a" fill={CHART_PALETTE[1]} />
            <Bar dataKey="News" stackId="a" fill={CHART_PALETTE[2]} />
            <Bar dataKey="Tweets" stackId="a" fill={CHART_PALETTE[3]} />
            <Bar dataKey="User Stories" stackId="b" fill={CHART_PALETTE[4]} />
            <Bar dataKey="AI Stories" stackId="b" fill={CHART_PALETTE[5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
