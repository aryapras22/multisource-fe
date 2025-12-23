import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_COLORS } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';

interface TextLengthData {
  source: string;
  avg_who_length: number;
  avg_what_length: number;
  avg_why_length: number;
}

interface TextLengthChartProps {
  data: TextLengthData[];
  title?: string;
}

export function TextLengthChart({ data, title = 'Average Text Length by Component' }: TextLengthChartProps) {
  const chartData = useMemo(() => {
    return data.map(source => ({
      source: source.source.charAt(0).toUpperCase() + source.source.slice(1),
      'WHO Length': source.avg_who_length.toFixed(1),
      'WHAT Length': source.avg_what_length.toFixed(1),
      'WHY Length': source.avg_why_length.toFixed(1),
    }));
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('text-length-chart', 'text-length-comparison');
    exportDataAsCSV(chartData, 'text-length-data');
  };

  return (
    <ChartContainer
      title={title}
      description="Comparing extraction detail: character count per component by source"
      onExport={handleExport}
    >
      <div id="text-length-chart">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis label={{ value: 'Avg Characters', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="WHO Length" fill={CHART_COLORS.info} />
            <Bar dataKey="WHAT Length" fill={CHART_COLORS.success} />
            <Bar dataKey="WHY Length" fill={CHART_COLORS.warning} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
