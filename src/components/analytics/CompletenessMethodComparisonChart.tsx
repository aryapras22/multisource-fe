import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { ComponentAnalysisData } from '@/types/detailedAnalytics';

interface CompletenessMethodComparisonChartProps {
  data: ComponentAnalysisData;
  title?: string;
}

export function CompletenessMethodComparisonChart({
  data,
  title = 'Completeness Rate by Method'
}: CompletenessMethodComparisonChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    const sources = ['review', 'news', 'tweet'];
    return sources.map(source => {
      const ruleBased = data.rule_based.find(d => d.source === source);
      const aiGenerated = data.ai_generated.find(d => d.source === source);

      return {
        source: source.charAt(0).toUpperCase() + source.slice(1),
        'Rule-Based': ruleBased?.completeness_rate || 0,
        'AI-Generated': aiGenerated?.completeness_rate || 0,
        ruleStories: ruleBased?.total_stories || 0,
        aiStories: aiGenerated?.total_stories || 0,
      };
    });
  }, [data]);

  const overallData = useMemo(() => {
    if (!data) return null;

    const totalRuleStories = data.rule_based.reduce((sum, d) => sum + d.total_stories, 0);
    const totalAiStories = data.ai_generated.reduce((sum, d) => sum + d.total_stories, 0);

    const ruleCompleteStories = data.rule_based.reduce((sum, d) => {
      return sum + Math.round((d.completeness_rate / 100) * d.total_stories);
    }, 0);

    const aiCompleteStories = data.ai_generated.reduce((sum, d) => {
      return sum + Math.round((d.completeness_rate / 100) * d.total_stories);
    }, 0);

    return {
      ruleRate: totalRuleStories > 0 ? (ruleCompleteStories / totalRuleStories) * 100 : 0,
      aiRate: totalAiStories > 0 ? (aiCompleteStories / totalAiStories) * 100 : 0,
      ruleStories: totalRuleStories,
      aiStories: totalAiStories,
      coverageRatio: data.summary.coverage_ratio,
    };
  }, [data]);

  const handleExport = () => {
    exportChartAsPNG('completeness-method-chart', 'completeness-method');
    exportDataAsCSV(chartData, 'completeness-method-data');
  };

  if (!data || !overallData) return null;

  return (
    <ChartContainer
      title={title}
      description="Completeness rate comparison between rule-based and AI-generated methods"
      onExport={handleExport}
    >
      <div id="completeness-method-chart">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 px-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Rule-Based Method</div>
            <div className="text-3xl font-bold text-blue-600">
              {overallData.ruleRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {overallData.ruleStories} total stories
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">AI-Generated Method</div>
            <div className="text-3xl font-bold text-green-600">
              {overallData.aiRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {overallData.aiStories} total stories ({overallData.coverageRatio.toFixed(1)}% coverage)
            </div>
          </div>
        </div>

        {/* Per-Source Breakdown */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis domain={[0, 100]} label={{ value: 'Completeness (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold mb-2">{data.source}</p>
                    <p className="text-sm text-blue-600">
                      Rule-Based: {data['Rule-Based'].toFixed(1)}%
                    </p>
                    <p className="text-xs text-blue-500 ml-2">
                      {data.ruleStories} stories
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      AI-Generated: {data['AI-Generated'].toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-500 ml-2">
                      {data.aiStories} stories
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
