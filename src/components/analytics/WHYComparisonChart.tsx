import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { ComponentAnalysisData } from '@/types/detailedAnalytics';

interface WHYComparisonChartProps {
  data: ComponentAnalysisData;
  title?: string;
}

export function WHYComparisonChart({
  data,
  title = 'WHY (Goals) Comparison by Source'
}: WHYComparisonChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    const sources = ['review', 'news', 'tweet'];
    return sources.map(source => {
      const ruleBased = data.rule_based.find(d => d.source === source);
      const aiGenerated = data.ai_generated.find(d => d.source === source);

      return {
        source: source.charAt(0).toUpperCase() + source.slice(1),
        'Rule-Based': ruleBased?.why_metrics.unique_count || 0,
        'AI-Generated': aiGenerated?.why_metrics.unique_count || 0,
        ruleWordCount: ruleBased?.why_metrics.avg_word_count || 0,
        aiWordCount: aiGenerated?.why_metrics.avg_word_count || 0,
        ruleLength: ruleBased?.why_metrics.avg_length || 0,
        aiLength: aiGenerated?.why_metrics.avg_length || 0,
      };
    });
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('why-comparison-chart', 'why-comparison');
    exportDataAsCSV(chartData, 'why-comparison-data');
  };

  if (!data) return null;

  return (
    <ChartContainer
      title={title}
      description="Unique WHY (goals/motivations) count and complexity comparison"
      onExport={handleExport}
    >
      <div id="why-comparison-chart">
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
                      Rule-Based: {data['Rule-Based']} unique
                    </p>
                    <p className="text-xs text-blue-500 ml-2">
                      Avg: {data.ruleWordCount.toFixed(1)} words, {data.ruleLength.toFixed(0)} chars
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      AI-Generated: {data['AI-Generated']} unique
                    </p>
                    <p className="text-xs text-green-500 ml-2">
                      Avg: {data.aiWordCount.toFixed(1)} words, {data.aiLength.toFixed(0)} chars
                    </p>
                  </div>
                );
              }}
            />
            <Legend />
            <Bar dataKey="Rule-Based" fill={CHART_PALETTE[4]} />
            <Bar dataKey="AI-Generated" fill={CHART_PALETTE[5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
