import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';

interface TopPersona {
  who: string;
  count: number;
  sources: string[];
}

interface TopPersonasChartProps {
  data: TopPersona[];
  title?: string;
}

export function TopPersonasChart({ data, title = 'Top 15 User Personas' }: TopPersonasChartProps) {
  const chartData = useMemo(() => {
    return data.map(persona => ({
      persona: persona.who.length > 30
        ? persona.who.substring(0, 30) + '...'
        : persona.who,
      fullPersona: persona.who,
      count: persona.count,
      sources: persona.sources.join(', '),
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('top-personas-chart', 'top-personas');
    exportDataAsCSV(chartData, 'top-personas-data');
  };

  return (
    <ChartContainer
      title={title}
      description="Most frequent user personas across all sources"
      onExport={handleExport}
    >
      <div id="top-personas-chart">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="persona"
              width={110}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-3 rounded shadow-lg max-w-xs">
                      <p className="font-semibold mb-1">{data.fullPersona}</p>
                      <p className="text-sm">Stories: {data.count}</p>
                      <p className="text-xs text-gray-600">Sources: {data.sources}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" name="Story Count">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
