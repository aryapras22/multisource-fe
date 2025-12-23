import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { ComponentAnalysisData } from '@/types/detailedAnalytics';

interface WHOComparisonChartProps {
  data: ComponentAnalysisData;
  title?: string;
}

export function WHOComparisonChart({
  data,
  title = 'WHO (User Personas) Comparison by Source'
}: WHOComparisonChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    const sources = ['review', 'news', 'tweet'];
    return sources.map(source => {
      const ruleBased = data.rule_based.find(d => d.source === source);
      const aiGenerated = data.ai_generated.find(d => d.source === source);

      return {
        source: source.charAt(0).toUpperCase() + source.slice(1),
        'Rule-Based': ruleBased?.who_metrics.unique_count || 0,
        'AI-Generated': aiGenerated?.who_metrics.unique_count || 0,
        ruleDiversity: ruleBased?.who_metrics.diversity_rate || 0,
        aiDiversity: aiGenerated?.who_metrics.diversity_rate || 0,
      };
    });
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('who-comparison-chart', 'who-comparison');
    exportDataAsCSV(chartData, 'who-comparison-data');
  };

  if (!data) return null;

  return (
    <ChartContainer
      title={title}
      description="Unique WHO (user personas) count comparison between extraction methods"
      onExport={handleExport}
    >
      <div id="who-comparison-chart">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold mb-2">{data.source}</p>
                    <p className="text-sm text-blue-600">
                      Rule-Based: {data['Rule-Based']} unique ({data.ruleDiversity.toFixed(1)}% diversity)
                    </p>
                    <p className="text-sm text-green-600">
                      AI-Generated: {data['AI-Generated']} unique ({data.aiDiversity.toFixed(1)}% diversity)
                    </p>
                  </div>
                );
              }}
            />
            <Legend />
            <Bar dataKey="Rule-Based" fill={CHART_PALETTE[0]} />
            <Bar dataKey="AI-Generated" fill={CHART_PALETTE[1]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
