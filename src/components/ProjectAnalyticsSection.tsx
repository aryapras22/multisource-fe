import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsService } from '@/services/analyticsService';
import { RatingDistributionChart } from './analytics/RatingDistributionChart';
import { EngagementMetricsChart } from './analytics/EngagementMetricsChart';
import { NFRAnalysisChart } from './analytics/NFRAnalysisChart';
import type {
  RatingsDistribution,
  EngagementMetrics,
  NFRAnalysis,
  RequirementsStats
} from '@/types/analytics';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectAnalyticsSectionProps {
  projectId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function ProjectAnalyticsSection({
  projectId,
  autoRefresh = false,
  refreshInterval = 30000
}: ProjectAnalyticsSectionProps) {
  const [ratings, setRatings] = useState<RatingsDistribution | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [nfr, setNfr] = useState<NFRAnalysis | null>(null);
  const [requirements, setRequirements] = useState<RequirementsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingsData, engagementData, nfrData, reqData] = await Promise.all([
          analyticsService.getProjectRatingsDistribution(projectId).catch(() => null),
          analyticsService.getProjectEngagementMetrics(projectId).catch(() => null),
          analyticsService.getProjectNFRAnalysis(projectId).catch(() => null),
          analyticsService.getProjectRequirementsStats(projectId).catch(() => null),
        ]);

        setRatings(ratingsData);
        setEngagement(engagementData);
        setNfr(nfrData);
        setRequirements(reqData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      try {
        const [ratingsData, engagementData, nfrData, reqData] = await Promise.all([
          analyticsService.getProjectRatingsDistribution(projectId).catch(() => null),
          analyticsService.getProjectEngagementMetrics(projectId).catch(() => null),
          analyticsService.getProjectNFRAnalysis(projectId).catch(() => null),
          analyticsService.getProjectRequirementsStats(projectId).catch(() => null),
        ]);

        setRatings(ratingsData);
        setEngagement(engagementData);
        setNfr(nfrData);
        setRequirements(reqData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, projectId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    );
  }

  const hasData = ratings || engagement || nfr;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No analytics data available yet. Start collecting data to see insights.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Requirements Stats Summary */}
      {requirements && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{requirements.user_stories.total}</div>
              <p className="text-sm text-gray-600">User Stories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{requirements.ai_stories.total}</div>
              <p className="text-sm text-gray-600">AI Stories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {(requirements.user_stories.similarity_scores.avg * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">Avg Similarity</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {(requirements.ai_stories.confidence_scores.avg * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4">
        {ratings && ratings.total_reviews > 0 && (
          <RatingDistributionChart data={ratings} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {engagement && engagement.total_tweets > 0 && (
            <EngagementMetricsChart data={engagement} />
          )}

          {nfr && nfr.unique_nfrs > 0 && (
            <NFRAnalysisChart data={nfr} maxItems={8} />
          )}
        </div>
      </div>
    </div>
  );
}
