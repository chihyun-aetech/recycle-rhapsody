export interface OperationStatus {
  station_id: string;
  station_name: string;
  is_operational: boolean;
  current_state: 'running' | 'stopped' | 'maintenance' | 'error';
  uptime_percentage: number;
  last_state_change: string;
  performance_metrics: {
    processing_rate: number;
    efficiency: number;
    error_rate: number;
  };
}

export interface OperationSummary {
  total_uptime_hours: number;
  total_downtime_hours: number;
  uptime_percentage: number;
  total_processed_items: number;
  average_efficiency: number;
  peak_processing_rate: number;
  maintenance_hours: number;
  error_incidents: number;
  stations: OperationStatus[];
}

export interface OperationPeriodStats {
  start_date: string;
  end_date: string;
  station_id?: string;
  daily_stats: Array<{
    date: string;
    uptime_hours: number;
    downtime_hours: number;
    uptime_percentage: number;
    processed_items: number;
    efficiency: number;
    incidents: number;
  }>;
  summary: {
    total_uptime_hours: number;
    total_downtime_hours: number;
    average_uptime_percentage: number;
    total_processed_items: number;
    average_efficiency: number;
    total_incidents: number;
  };
}

export interface CurrentStatusResponse {
  success: boolean;
  message: string;
  data: OperationStatus[];
  timestamp: string;
}

export interface OperationSummaryResponse {
  success: boolean;
  message: string;
  data: OperationSummary;
  period: string;
  timestamp: string;
}

export interface OperationPeriodResponse {
  success: boolean;
  message: string;
  data: OperationPeriodStats;
  timestamp: string;
}

export interface OperationStatsFilters {
  station_ids?: string;
  start_date?: string;
  end_date?: string;
  station_id?: string;
  granularity?: 'daily' | 'hourly';
}

export interface StationPerformance {
  station_id: string;
  station_name: string;
  uptime_percentage: number;
  processing_efficiency: number;
  error_rate: number;
  maintenance_frequency: number;
  performance_trend: 'improving' | 'declining' | 'stable';
  last_maintenance: string;
  next_scheduled_maintenance?: string;
}

export interface OperationInsights {
  overall_performance: {
    system_health_score: number;
    trending: 'up' | 'down' | 'stable';
    key_metrics: {
      total_uptime: number;
      average_efficiency: number;
      incident_rate: number;
    };
  };
  station_rankings: StationPerformance[];
  alerts: Array<{
    type: 'warning' | 'critical' | 'info';
    station_id?: string;
    message: string;
    timestamp: string;
    resolved: boolean;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'maintenance' | 'performance' | 'efficiency';
    station_id?: string;
    recommendation: string;
    expected_impact: string;
  }>;
}