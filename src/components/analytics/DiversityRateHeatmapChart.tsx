import { useMemo } from 'react';
import { ChartContainer } from '../charts/ChartContainer';
import { exportChartAsPNG, exportDataAsCSV } from '@/lib/chartExport';
import type { ComponentAnalysisData } from '@/types/detailedAnalytics';

interface DiversityRateHeatmapChartProps {
  data: ComponentAnalysisData;
  title?: string;
}

interface HeatmapCell {
  source: string;
  component: string;
  method: string;
  rate: number;
}

export function DiversityRateHeatmapChart({
  data,
  title = 'Diversity Rate Heatmap'
}: DiversityRateHeatmapChartProps) {
  const heatmapData = useMemo(() => {
    if (!data) return [];

    const cells: HeatmapCell[] = [];
    const sources = ['review', 'news', 'tweet'];
    const components = ['WHO', 'WHAT', 'WHY'];

    sources.forEach(source => {
      const ruleBased = data.rule_based.find(d => d.source === source);
      const aiGenerated = data.ai_generated.find(d => d.source === source);

      components.forEach(component => {
        if (ruleBased) {
          const rateKey = `${component.toLowerCase()}_metrics` as 'who_metrics' | 'what_metrics' | 'why_metrics';
          cells.push({
            source,
            component,
            method: 'Rule-Based',
            rate: ruleBased[rateKey]?.diversity_rate || 0,
          });
        }

        if (aiGenerated) {
          const rateKey = `${component.toLowerCase()}_metrics` as 'who_metrics' | 'what_metrics' | 'why_metrics';
          cells.push({
            source,
            component,
            method: 'AI-Generated',
            rate: aiGenerated[rateKey]?.diversity_rate || 0,
          });
        }
      });
    });

    return cells;
  }, [data]);

  const getColorForRate = (rate: number): string => {
    if (rate >= 80) return 'bg-green-600';
    if (rate >= 60) return 'bg-green-500';
    if (rate >= 40) return 'bg-yellow-500';
    if (rate >= 20) return 'bg-orange-500';
    if (rate >= 10) return 'bg-red-500';
    return 'bg-red-600';
  };

  const getTextColorForRate = (rate: number): string => {
    return rate >= 40 ? 'text-white' : 'text-gray-800';
  };

  const handleExport = () => {
    exportChartAsPNG('diversity-heatmap-chart', 'diversity-heatmap');
    const exportData = heatmapData.map(d => ({
      source: d.source,
      component: d.component,
      method: d.method,
      diversity_rate: d.rate,
    }));
    exportDataAsCSV(exportData, 'diversity-heatmap-data');
  };

  if (!data) return null;

  const sources = ['review', 'news', 'tweet'];
  const columns = [
    { component: 'WHO', method: 'Rule-Based' },
    { component: 'WHO', method: 'AI-Generated' },
    { component: 'WHAT', method: 'Rule-Based' },
    { component: 'WHAT', method: 'AI-Generated' },
    { component: 'WHY', method: 'Rule-Based' },
    { component: 'WHY', method: 'AI-Generated' },
  ];

  return (
    <ChartContainer
      title={title}
      description="Diversity rate heatmap by source, component, and method"
      onExport={handleExport}
    >
      <div id="diversity-heatmap-chart" className="overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-100 p-2 text-sm font-semibold">Source</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="border border-gray-300 bg-gray-100 p-2 text-xs font-semibold">
                    {col.component}<br />
                    <span className="font-normal text-gray-600">{col.method === 'Rule-Based' ? 'Rule' : 'AI'}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sources.map(source => (
                <tr key={source}>
                  <td className="border border-gray-300 bg-gray-50 p-2 font-semibold text-sm capitalize">
                    {source}
                  </td>
                  {columns.map((col, idx) => {
                    const cell = heatmapData.find(
                      c => c.source === source && c.component === col.component && c.method === col.method
                    );
                    const rate = cell?.rate || 0;
                    return (
                      <td
                        key={idx}
                        className={`border border-gray-300 p-3 text-center ${getColorForRate(rate)} ${getTextColorForRate(rate)}`}
                        title={`${source} - ${col.component} (${col.method}): ${rate.toFixed(1)}%`}
                      >
                        <div className="font-semibold">{rate.toFixed(1)}%</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            <span className="font-semibold">Legend:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-600 border"></div>
              <span>≥80%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 border"></div>
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500 border"></div>
              <span>40-59%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-500 border"></div>
              <span>20-39%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500 border"></div>
              <span>10-19%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-600 border"></div>
              <span>&lt;10%</span>
            </div>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
}
