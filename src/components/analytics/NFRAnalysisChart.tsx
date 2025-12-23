import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { NFRAnalysis } from '@/types/analytics';

interface NFRAnalysisChartProps {
  data: NFRAnalysis;
  title?: string;
  maxItems?: number;
}

export function NFRAnalysisChart({ data, title = 'NFR Frequency Analysis', maxItems = 10 }: NFRAnalysisChartProps) {
  const chartData = useMemo(() => {
    const entries = Object.entries(data.nfr_frequency);
    const sorted = entries.sort(([, a], [, b]) => b - a);
    const top = sorted.slice(0, maxItems);

    return top.map(([nfr, count]) => ({
      nfr: nfr.length > 25 ? nfr.substring(0, 25) + '...' : nfr,
      fullNfr: nfr,
      count,
    }));
  }, [data, maxItems]);

  const handleExport = () => {
    exportChartAsPNG('nfr-chart', 'nfr-analysis');
    exportDataAsCSV(chartData, 'nfr-data');
  };

  return (
    <ChartContainer
      title={title}
      description={`Unique NFRs: ${data.unique_nfrs} | Stories with NFR: ${data.total_stories_with_nfr}`}
      onExport={handleExport}
    >
      <div id="nfr-chart">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="nfr"
              width={150}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 p-3 rounded shadow-lg max-w-xs">
                      <p className="font-semibold mb-1">{data.fullNfr}</p>
                      <p>Count: {data.count}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" fill={CHART_PALETTE[0]}>
              {chartData.map((_, index) => (
                <Bar key={`bar-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
