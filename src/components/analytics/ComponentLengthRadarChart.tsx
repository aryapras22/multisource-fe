import { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer } from '../charts/ChartContainer';
import { CHART_PALETTE } from '@/lib/chartColors';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { ComponentAnalysisData } from '@/types/detailedAnalytics';

interface ComponentLengthRadarChartProps {
  data: ComponentAnalysisData;
  source?: 'review' | 'news' | 'tweet' | 'all';
  title?: string;
}

export function ComponentLengthRadarChart({
  data,
  source = 'all',
  title
}: ComponentLengthRadarChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    // Calculate averages across sources or for specific source
    const getRuleBased = () => {
      if (source === 'all') {
        return data.rule_based;
      }
      return data.rule_based.filter(d => d.source === source);
    };

    const getAIGenerated = () => {
      if (source === 'all') {
        return data.ai_generated;
      }
      return data.ai_generated.filter(d => d.source === source);
    };

    const ruleBasedData = getRuleBased();
    const aiGeneratedData = getAIGenerated();

    // Calculate averages for rule-based
    const ruleWhoAvg = ruleBasedData.reduce((sum, d) => sum + d.who_metrics.avg_length, 0) / ruleBasedData.length || 0;
    const ruleWhatAvg = ruleBasedData.reduce((sum, d) => sum + d.what_metrics.avg_length, 0) / ruleBasedData.length || 0;
    const ruleWhyAvg = ruleBasedData.reduce((sum, d) => sum + d.why_metrics.avg_length, 0) / ruleBasedData.length || 0;
    const ruleWhoDiversity = ruleBasedData.reduce((sum, d) => sum + d.who_metrics.diversity_rate, 0) / ruleBasedData.length || 0;
    const ruleWhatDiversity = ruleBasedData.reduce((sum, d) => sum + d.what_metrics.diversity_rate, 0) / ruleBasedData.length || 0;
    const ruleWhyDiversity = ruleBasedData.reduce((sum, d) => sum + d.why_metrics.diversity_rate, 0) / ruleBasedData.length || 0;

    // Calculate averages for AI-generated
    const aiWhoAvg = aiGeneratedData.reduce((sum, d) => sum + d.who_metrics.avg_length, 0) / aiGeneratedData.length || 0;
    const aiWhatAvg = aiGeneratedData.reduce((sum, d) => sum + d.what_metrics.avg_length, 0) / aiGeneratedData.length || 0;
    const aiWhyAvg = aiGeneratedData.reduce((sum, d) => sum + d.why_metrics.avg_length, 0) / aiGeneratedData.length || 0;
    const aiWhoDiversity = aiGeneratedData.reduce((sum, d) => sum + d.who_metrics.diversity_rate, 0) / aiGeneratedData.length || 0;
    const aiWhatDiversity = aiGeneratedData.reduce((sum, d) => sum + d.what_metrics.diversity_rate, 0) / aiGeneratedData.length || 0;
    const aiWhyDiversity = aiGeneratedData.reduce((sum, d) => sum + d.why_metrics.diversity_rate, 0) / aiGeneratedData.length || 0;

    return [
      {
        metric: 'WHO Length',
        'Rule-Based': ruleWhoAvg,
        'AI-Generated': aiWhoAvg,
        fullMark: 100,
      },
      {
        metric: 'WHAT Length',
        'Rule-Based': ruleWhatAvg,
        'AI-Generated': aiWhatAvg,
        fullMark: 100,
      },
      {
        metric: 'WHY Length',
        'Rule-Based': ruleWhyAvg,
        'AI-Generated': aiWhyAvg,
        fullMark: 100,
      },
      {
        metric: 'WHO Diversity',
        'Rule-Based': ruleWhoDiversity,
        'AI-Generated': aiWhoDiversity,
        fullMark: 100,
      },
      {
        metric: 'WHAT Diversity',
        'Rule-Based': ruleWhatDiversity,
        'AI-Generated': aiWhatDiversity,
        fullMark: 100,
      },
      {
        metric: 'WHY Diversity',
        'Rule-Based': ruleWhyDiversity,
        'AI-Generated': aiWhyDiversity,
        fullMark: 100,
      },
    ];
  }, [data, source]);

  const handleExport = () => {
    exportChartAsPNG('component-length-radar-chart', 'component-length-radar');
    exportDataAsCSV(chartData, 'component-length-radar-data');
  };

  const chartTitle = title || `Component Length & Diversity - ${source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}`;

  if (!data) return null;

  return (
    <ChartContainer
      title={chartTitle}
      description="Multi-dimensional comparison of component length and diversity metrics"
      onExport={handleExport}
    >
      <div id="component-length-radar-chart">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold mb-2">{data.metric}</p>
                    <p className="text-sm text-blue-600">
                      Rule-Based: {data['Rule-Based'].toFixed(1)}
                    </p>
                    <p className="text-sm text-green-600">
                      AI-Generated: {data['AI-Generated'].toFixed(1)}
                    </p>
                  </div>
                );
              }}
            />
            <Legend />
            <Radar
              name="Rule-Based"
              dataKey="Rule-Based"
              stroke={CHART_PALETTE[0]}
              fill={CHART_PALETTE[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="AI-Generated"
              dataKey="AI-Generated"
              stroke={CHART_PALETTE[1]}
              fill={CHART_PALETTE[1]}
              fillOpacity={0.3}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
