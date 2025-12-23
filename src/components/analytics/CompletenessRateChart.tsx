import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { SOURCE_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';

interface CompletenessRateData {
  source: string;
  completeness_rate: number;
  total_stories: number;
  complete_stories: number;
}

interface CompletenessRateChartProps {
  data: CompletenessRateData[];
  title?: string;
}

export function CompletenessRateChart({
  data,
  title = 'Completeness Rate by Source'
}: CompletenessRateChartProps) {
  const chartData = useMemo(() => {
    return data
      .sort((a, b) => b.completeness_rate - a.completeness_rate)
      .map(source => ({
        source: source.source.charAt(0).toUpperCase() + source.source.slice(1),
        rate: source.completeness_rate.toFixed(1),
        complete: source.complete_stories,
        total: source.total_stories,
        originalSource: source.source,
      }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('completeness-rate-chart', 'completeness-rate');
    exportDataAsCSV(chartData, 'completeness-rate-data');
  };

  return (
    <ChartContainer
      title={title}
      description="Quality assessment: % of stories with complete WHO-WHAT-WHY"
      onExport={handleExport}
    >
      <div id="completeness-rate-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis domain={[0, 100]} label={{ value: 'Completeness %', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-3 rounded shadow-lg">
                      <p className="font-semibold mb-1">{data.source}</p>
                      <p className="text-sm">Completeness: {data.rate}%</p>
                      <p className="text-sm">Complete: {data.complete} / {data.total}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="rate" name="Completeness %">
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
