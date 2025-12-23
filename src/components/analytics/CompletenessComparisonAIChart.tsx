import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { RequirementsComparison } from '@/types/detailedAnalytics';

interface CompletenessComparisonAIChartProps {
  data: RequirementsComparison;
  title?: string;
}

export function CompletenessComparisonAIChart({
  data,
  title = 'Completeness Rate: User vs AI Requirements'
}: CompletenessComparisonAIChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    return [
      {
        type: 'User Requirements',
        'Completeness Rate': data.user_requirements.completeness_rate.toFixed(1),
        complete: data.user_requirements.complete_count,
        total: data.user_requirements.total,
      },
      {
        type: 'AI Requirements',
        'Completeness Rate': data.ai_requirements.completeness_rate.toFixed(1),
        complete: data.ai_requirements.complete_count,
        total: data.ai_requirements.total,
      },
    ];
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('completeness-ai-chart', 'completeness-comparison-ai');
    exportDataAsCSV(chartData, 'completeness-comparison-ai-data');
  };

  if (!data) return null;

  return (
    <ChartContainer
      title={title}
      description="Percentage of requirements with complete WHO, WHAT, and WHY fields"
      onExport={handleExport}
    >
      <div id="completeness-ai-chart">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis label={{ value: 'Completeness Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold">{data.type}</p>
                    <p className="text-sm text-gray-600">
                      Completeness Rate: {data['Completeness Rate']}%
                    </p>
                    <p className="text-sm text-gray-600">
                      Complete: {data.complete}/{data.total}
                    </p>
                  </div>
                );
              }}
            />
            <Legend />
            <Bar dataKey="Completeness Rate" fill={CHART_PALETTE[3]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
