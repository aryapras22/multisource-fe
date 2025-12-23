// Extended analytics types for detailed source analysis

export interface StoryDetail {
  _id: string;
  who: string;
  what: string;
  why: string | null;
  source: 'review' | 'news' | 'tweet';
  project_id: string;
  similarity_score: number;
}

export interface SourceCompletenessData {
  source: string;
  total_stories: number;
  complete_stories: number;
  completeness_rate: number;
  who_filled: number;
  what_filled: number;
  why_filled: number;
  avg_who_length: number;
  avg_what_length: number;
  avg_why_length: number;
  avg_why_word_count: number;
}

export interface ProjectSourceBreakdown {
  project_id: string;
  project_name: string;
  sources: {
    review: number;
    news: number;
    tweet: number;
  };
  total: number;
}

export interface TopPersona {
  who: string;
  count: number;
  sources: string[];
}

export interface TopAction {
  action: string;
  count: number;
  sources: string[];
}

export interface SourceQualityComparison {
  sources: SourceCompletenessData[];
  overall_completeness: number;
  total_stories: number;
}

export interface DetailedSourceAnalysis {
  sources: SourceCompletenessData[];
  total_stories: number;
  overall_completeness: number;
}

export interface SourceProjectBreakdown {
  projects: ProjectSourceBreakdown[];
  total_stories: number;
}

export interface TopPersonasData {
  personas: TopPersona[];
  total_count: number;
}

export interface TopActionsData {
  actions: TopAction[];
  total_count: number;
}

export interface ComponentMetrics {
  unique_count: number;
  filled_count: number;
  filled_rate: number;
  avg_length: number;
  diversity_rate: number;
  avg_word_count?: number;
}

export interface ComponentAnalysisPerSource {
  source: string;
  method: string;
  total_stories: number;
  who_metrics: ComponentMetrics;
  what_metrics: ComponentMetrics;
  why_metrics: ComponentMetrics & { avg_word_count: number };
  completeness_rate: number;
}

export interface ComponentAnalysisData {
  rule_based: ComponentAnalysisPerSource[];
  ai_generated: ComponentAnalysisPerSource[];
  summary: {
    total_rule_based: number;
    total_ai_generated: number;
    coverage_ratio: number;
  };
}

export interface RequirementsComparison {
  user_requirements: {
    total: number;
    by_source: {
      review: number;
      news: number;
      tweet: number;
    };
    completeness_rate: number;
    complete_count: number;
  };
  ai_requirements: {
    total: number;
    by_source: {
      review: number;
      news: number;
      tweet: number;
    };
    sentiment_distribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
    completeness_rate: number;
    complete_count: number;
  };
  generation_ratio: {
    review: number;
    news: number;
    tweet: number;
  };
}

export interface SourceDetailedAnalytics {
  completeness_data: SourceQualityComparison;
  project_breakdown: ProjectSourceBreakdown[];
  top_personas: TopPersona[];
  top_actions: TopAction[];
}
