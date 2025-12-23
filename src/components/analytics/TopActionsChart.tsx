import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';

interface TopAction {
  action: string;
  count: number;
  sources: string[];
}

interface TopActionsChartProps {
  data: TopAction[];
  title?: string;
}

export function TopActionsChart({ data, title = 'Top 20 Action Verbs' }: TopActionsChartProps) {
  const chartData = useMemo(() => {
    return data.map(action => ({
      action: action.action,
      count: action.count,
      sources: action.sources.join(', '),
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('top-actions-chart', 'top-actions');
    exportDataAsCSV(chartData, 'top-actions-data');
  };

  return (
    <ChartContainer
      title={title}
      description="Most frequent WHAT action patterns for functional requirements"
      onExport={handleExport}
    >
      <div id="top-actions-chart">
        <ResponsiveContainer width="100%" height={550}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="action"
              width={70}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-3 rounded shadow-lg">
                      <p className="font-semibold mb-1 capitalize">{data.action}</p>
                      <p className="text-sm">Count: {data.count}</p>
                      <p className="text-xs text-gray-600">Sources: {data.sources}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" name="Frequency">
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
