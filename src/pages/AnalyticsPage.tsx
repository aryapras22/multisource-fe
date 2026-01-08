import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RefreshCw, Filter } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { getBlacklistedProjects, addToBlacklist, removeFromBlacklist } from '@/lib/projectFilter';
import { DataCollectionChart } from '@/components/analytics/DataCollectionChart';
import { RequirementsOverviewChart } from '@/components/analytics/RequirementsOverviewChart';
import { ComparisonChart } from '@/components/analytics/ComparisonChart';
import { SourceVolumeChart } from '@/components/analytics/SourceVolumeChart';
import { SourceDistributionPieChart } from '@/components/analytics/SourceDistributionPieChart';
import { QualityBubbleChart } from '@/components/analytics/QualityBubbleChart';
import { TextLengthChart } from '@/components/analytics/TextLengthChart';
import { CompletenessRateChart } from '@/components/analytics/CompletenessRateChart';
import { RequirementsVsAIChart } from '@/components/analytics/RequirementsVsAIChart';
import { CompletenessComparisonAIChart } from '@/components/analytics/CompletenessComparisonAIChart';
import { WHOComparisonChart } from '@/components/analytics/WHOComparisonChart';
import { WHATComparisonChart } from '@/components/analytics/WHATComparisonChart';
import { WHYComparisonChart } from '@/components/analytics/WHYComparisonChart';
import { ComponentLengthRadarChart } from '@/components/analytics/ComponentLengthRadarChart';
import { DiversityRateHeatmapChart } from '@/components/analytics/DiversityRateHeatmapChart';
import { CompletenessMethodComparisonChart } from '@/components/analytics/CompletenessMethodComparisonChart';
import type {
  ProjectOverview,
  AllDataCollectionStats,
  AllRequirementsStats,
  ComparisonData
} from '@/types/analytics';
import type {
  DetailedSourceAnalysis,
  SourceProjectBreakdown,
  RequirementsComparison,
  ComponentAnalysisData
} from '@/types/detailedAnalytics';

interface Project {
  id: string;
  name: string;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Data states
  const [projectOverview, setProjectOverview] = useState<ProjectOverview | null>(null);
  const [dataCollectionStats, setDataCollectionStats] = useState<AllDataCollectionStats | null>(null);
  const [requirementsStats, setRequirementsStats] = useState<AllRequirementsStats | null>(null);

  // Source analysis states
  const [detailedSourceData, setDetailedSourceData] = useState<DetailedSourceAnalysis | null>(null);
  const [projectBreakdown, setProjectBreakdown] = useState<SourceProjectBreakdown | null>(null);

  // Requirements comparison state
  const [requirementsComparison, setRequirementsComparison] = useState<RequirementsComparison | null>(null);

  // Component analysis state
  const [componentAnalysis, setComponentAnalysis] = useState<ComponentAnalysisData | null>(null);

  // Filter states
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [blacklistedProjects, setBlacklistedProjects] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Comparison states
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);

  // Fetch all projects for filter
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const endpoint = import.meta.env.VITE_MULTISOURCE_SERVICE_API_ENDPOINT || '';
        const apiKey = import.meta.env.VITE_API_KEY || '';
        const response = await fetch(`${endpoint}/get-projects?key=${encodeURIComponent(apiKey)}`);
        if (!response.ok) throw new Error('Failed to fetch projects');

        interface ProjectData {
          _id: string;
          name: string;
        }
        const projects: ProjectData[] = await response.json();
        setAllProjects(projects.map((p: ProjectData) => ({ id: p._id, name: p.name })));
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();

    // Load blacklist from localStorage
    setBlacklistedProjects(getBlacklistedProjects());
  }, []);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const excluded = getBlacklistedProjects();

      const [overview, dataCollection, requirements, sourceAnalysis, breakdown, reqComparison, compAnalysis] = await Promise.all([
        analyticsService.getProjectsOverview(excluded),
        analyticsService.getAllDataCollectionStats(excluded),
        analyticsService.getAllRequirementsStats(excluded),
        analyticsService.getDetailedSourceAnalysis(excluded),
        analyticsService.getSourceProjectBreakdown(excluded),
        analyticsService.getRequirementsComparison(excluded),
        analyticsService.getComponentAnalysis(excluded),
      ]);

      setProjectOverview(overview);
      setDataCollectionStats(dataCollection);
      setRequirementsStats(requirements);
      setDetailedSourceData(sourceAnalysis);
      setProjectBreakdown(breakdown);
      setRequirementsComparison(reqComparison);
      setComponentAnalysis(compAnalysis);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [blacklistedProjects]);

  // Fetch comparison when selection changes
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (selectedProjects.length === 0) {
        setComparisonData(null);
        return;
      }

      try {
        const excluded = getBlacklistedProjects();
        const data = await analyticsService.getComparisonData(selectedProjects, excluded);
        setComparisonData(data);
      } catch (error) {
        console.error('Failed to fetch comparison data:', error);
      }
    };

    fetchComparisonData();
  }, [selectedProjects]);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAnalyticsData();
      }, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  const handleToggleBlacklist = (projectId: string) => {
    if (blacklistedProjects.includes(projectId)) {
      removeFromBlacklist(projectId);
      setBlacklistedProjects(prev => prev.filter(id => id !== projectId));
    } else {
      addToBlacklist(projectId);
      setBlacklistedProjects(prev => [...prev, projectId]);
    }
  };

  const handleToggleComparison = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive data visualization and insights</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter Projects
          </Button>

          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchAnalyticsData();
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-3">Project Filters</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Blacklist (Hide from all views)</h4>
              <div className="space-y-2">
                {allProjects.map(project => (
                  <div key={project.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`blacklist-${project.id}`}
                      checked={blacklistedProjects.includes(project.id)}
                      onCheckedChange={() => handleToggleBlacklist(project.id)}
                    />
                    <Label
                      htmlFor={`blacklist-${project.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {project.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Compare Projects</h4>
              <div className="space-y-2">
                {allProjects
                  .filter(p => !blacklistedProjects.includes(p.id))
                  .map(project => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`compare-${project.id}`}
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => handleToggleComparison(project.id)}
                      />
                      <Label
                        htmlFor={`compare-${project.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {project.name}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data-collection">Data Collection</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="source-analysis">Source Analysis</TabsTrigger>
          <TabsTrigger value="method-comparison">Method Comparison</TabsTrigger>
          <TabsTrigger value="comparison" disabled={selectedProjects.length === 0}>
            Comparison {selectedProjects.length > 0 && `(${selectedProjects.length})`}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="text-center py-12 text-gray-500">
            Overview charts have been removed
          </div>
        </TabsContent>

        {/* Data Collection Tab */}
        <TabsContent value="data-collection" className="space-y-4">
          {dataCollectionStats && (
            <DataCollectionChart data={dataCollectionStats} />
          )}
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-4">
          {requirementsStats && (
            <div className="grid grid-cols-1 gap-4">
              <RequirementsOverviewChart data={requirementsStats} />
            </div>
          )}
        </TabsContent>

        {/* Source Analysis Tab */}
        <TabsContent value="source-analysis" className="space-y-6">
          {/* Volume & Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Volume & Distribution</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {detailedSourceData && (
                <>
                  <SourceVolumeChart data={detailedSourceData} />
                  <SourceDistributionPieChart data={detailedSourceData} />
                </>
              )}
            </div>
          </div>


          {/* Text Length Analysis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Text Length Analysis</h3>
            <div className="grid grid-cols-1 gap-4">
              {detailedSourceData && detailedSourceData.sources && (
                <TextLengthChart data={detailedSourceData.sources} />
              )}
            </div>
          </div>

        </TabsContent>

        {/* Method Comparison Tab */}
        <TabsContent value="method-comparison" className="space-y-6">
          {/* Volume & Coverage */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Volume & Coverage</h3>
            <div className="grid grid-cols-1 gap-4">
              {requirementsComparison && (
                <RequirementsVsAIChart data={requirementsComparison} />
              )}
            </div>
          </div>

          {/* Component Analysis Per Source */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Component Analysis Per Source</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {componentAnalysis && (
                <>
                  <WHOComparisonChart data={componentAnalysis} />
                  <WHATComparisonChart data={componentAnalysis} />
                  <WHYComparisonChart data={componentAnalysis} />
                </>
              )}
            </div>
          </div>





        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          {comparisonData && comparisonData.projects.length > 0 ? (
            <ComparisonChart data={comparisonData} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select at least one project from the filter panel to compare
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
