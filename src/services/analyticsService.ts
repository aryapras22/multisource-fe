import { apiGet } from './apiClient';
import type {
  ProjectOverview,
  DataCollectionStats,
  AllDataCollectionStats,
  RequirementsStats,
  AllRequirementsStats,
  RatingsDistribution,
  EngagementMetrics,
  NFRAnalysis,
  ClusterStats,
  ComparisonData,
} from '../types/analytics';

export const analyticsService = {
  getProjectsOverview: async (excludeProjects?: string[]): Promise<ProjectOverview> => {
    const params = new URLSearchParams();
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    const url = `/analytics/projects/overview${params.toString() ? `?${params.toString()}` : ''}`;
    return apiGet<ProjectOverview>(url);
  },

  getProjectDataCollectionStats: async (projectId: string): Promise<DataCollectionStats> => {
    return apiGet<DataCollectionStats>(`/analytics/projects/${projectId}/data-collection`);
  },

  getAllDataCollectionStats: async (excludeProjects?: string[]): Promise<AllDataCollectionStats> => {
    const params = new URLSearchParams();
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    const url = `/analytics/data-collection/overview${params.toString() ? `?${params.toString()}` : ''}`;
    return apiGet<AllDataCollectionStats>(url);
  },

  getProjectRequirementsStats: async (projectId: string): Promise<RequirementsStats> => {
    return apiGet<RequirementsStats>(`/analytics/projects/${projectId}/requirements`);
  },

  getAllRequirementsStats: async (excludeProjects?: string[]): Promise<AllRequirementsStats> => {
    const params = new URLSearchParams();
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    const url = `/analytics/requirements/overview${params.toString() ? `?${params.toString()}` : ''}`;
    return apiGet<AllRequirementsStats>(url);
  },

  getProjectRatingsDistribution: async (projectId: string): Promise<RatingsDistribution> => {
    return apiGet<RatingsDistribution>(`/analytics/projects/${projectId}/ratings`);
  },

  getProjectEngagementMetrics: async (projectId: string): Promise<EngagementMetrics> => {
    return apiGet<EngagementMetrics>(`/analytics/projects/${projectId}/engagement`);
  },

  getProjectNFRAnalysis: async (projectId: string): Promise<NFRAnalysis> => {
    return apiGet<NFRAnalysis>(`/analytics/projects/${projectId}/nfr`);
  },

  getProjectClusterStats: async (projectId: string): Promise<ClusterStats> => {
    return apiGet<ClusterStats>(`/analytics/projects/${projectId}/clusters`);
  },

  getComparisonData: async (projectIds: string[], excludeProjects?: string[]): Promise<ComparisonData> => {
    const params = new URLSearchParams();
    params.append('project_ids', projectIds.join(','));
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    return apiGet<ComparisonData>(`/analytics/comparison?${params.toString()}`);
  },

  getDetailedSourceAnalysis: async (excludeProjects?: string[]) => {
    const params = new URLSearchParams();
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    const url = `/analytics/sources/detailed${params.toString() ? `?${params.toString()}` : ''}`;
    return apiGet(url);
  },

  getSourceProjectBreakdown: async (excludeProjects?: string[]) => {
    const params = new URLSearchParams();
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    const url = `/analytics/sources/project-breakdown${params.toString() ? `?${params.toString()}` : ''}`;
    return apiGet(url);
  },

  getTopPersonas: async (limit: number = 15, excludeProjects?: string[]) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    return apiGet(`/analytics/sources/top-personas?${params.toString()}`);
  },

  getTopActions: async (limit: number = 20, excludeProjects?: string[]) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    return apiGet(`/analytics/sources/top-actions?${params.toString()}`);
  },

  getRequirementsComparison: async (excludeProjects?: string[]) => {
    const params = new URLSearchParams();
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    const url = `/analytics/requirements/comparison${params.toString() ? `?${params.toString()}` : ''}`;
    return apiGet(url);
  },

  getComponentAnalysis: async (excludeProjects?: string[]) => {
    const params = new URLSearchParams();
    if (excludeProjects && excludeProjects.length > 0) {
      params.append('exclude_projects', excludeProjects.join(','));
    }
    const url = `/analytics/component-analysis${params.toString() ? `?${params.toString()}` : ''}`;
    return apiGet(url);
  },
};
