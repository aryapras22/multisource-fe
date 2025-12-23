import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { SOURCE_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';

interface BubbleDataPoint {
  source: string;
  volume: number;
  completeness: number;
  avgWhyComplexity: number;
}

interface QualityBubbleChartProps {
  data: BubbleDataPoint[];
  title?: string;
}

export function QualityBubbleChart({ data, title = 'Volume vs Quality Analysis' }: QualityBubbleChartProps) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      x: d.volume,
      y: d.completeness,
      z: d.avgWhyComplexity * 20, // Scale for bubble size
      source: d.source,
      name: d.source.charAt(0).toUpperCase() + d.source.slice(1),
      whyComplexity: d.avgWhyComplexity.toFixed(1),
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('quality-bubble-chart', 'volume-quality-analysis');
    exportDataAsCSV(chartData, 'volume-quality-data');
  };

  return (
    <ChartContainer
      title={title}
      description="Bubble size represents WHY complexity (word count)"
      onExport={handleExport}
    >
      <div id="quality-bubble-chart">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              name="Volume"
              label={{ value: 'Number of Stories', position: 'bottom' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Completeness"
              label={{ value: 'Completeness %', angle: -90, position: 'left' }}
              domain={[0, 100]}
            />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-3 rounded shadow-lg">
                      <p className="font-semibold mb-1">{data.name}</p>
                      <p className="text-sm">Volume: {data.x} stories</p>
                      <p className="text-sm">Completeness: {data.y.toFixed(1)}%</p>
                      <p className="text-sm">WHY Complexity: {data.whyComplexity} words</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {data.map((entry) => (
              <Scatter
                key={entry.source}
                name={entry.source.charAt(0).toUpperCase() + entry.source.slice(1)}
                data={chartData.filter(d => d.source === entry.source)}
                fill={SOURCE_COLORS[entry.source as keyof typeof SOURCE_COLORS] || '#6b7280'}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
