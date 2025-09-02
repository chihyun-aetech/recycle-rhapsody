import { operationStatsApi } from './api';
import {
  OperationStatus,
  OperationSummary,
  OperationPeriodStats,
  OperationStatsFilters,
  StationPerformance,
  OperationInsights
} from './types';

export class OperationStatsService {
  // Get current operation status for all stations
  async getCurrentStatus(stationIds?: string): Promise<OperationStatus[]> {
    try {
      const response = await operationStatsApi.getCurrentStatus(stationIds);
      return response.data;
    } catch (error) {
      console.error('Error fetching current operation status:', error);
      return [];
    }
  }

  // Get today's operation summary
  async getTodaySummary(stationId?: string): Promise<OperationSummary | null> {
    try {
      const response = await operationStatsApi.getTodaySummary(stationId);
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s operation summary:', error);
      return null;
    }
  }

  // Get this week's operation summary
  async getWeekSummary(stationId?: string): Promise<OperationSummary | null> {
    try {
      const response = await operationStatsApi.getWeekSummary(stationId);
      return response.data;
    } catch (error) {
      console.error('Error fetching week\'s operation summary:', error);
      return null;
    }
  }

  // Get this month's operation summary
  async getMonthSummary(stationId?: string): Promise<OperationSummary | null> {
    try {
      const response = await operationStatsApi.getMonthSummary(stationId);
      return response.data;
    } catch (error) {
      console.error('Error fetching month\'s operation summary:', error);
      return null;
    }
  }

  // Get operation statistics for a specific period
  async getPeriodStats(filters: OperationStatsFilters): Promise<OperationPeriodStats | null> {
    try {
      if (!filters.start_date || !filters.end_date) {
        throw new Error('start_date and end_date are required');
      }

      const response = await operationStatsApi.getPeriodStats(filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching period operation statistics:', error);
      throw error;
    }
  }

  // Get operational stations only
  async getOperationalStations(): Promise<OperationStatus[]> {
    const allStations = await this.getCurrentStatus();
    return allStations.filter(station => station.is_operational);
  }

  // Get stations with issues
  async getProblematicStations(): Promise<OperationStatus[]> {
    const allStations = await this.getCurrentStatus();
    return allStations.filter(station => 
      !station.is_operational || 
      station.current_state === 'error' || 
      station.uptime_percentage < 80 ||
      station.performance_metrics.error_rate > 5
    );
  }

  // Get station performance rankings
  async getStationPerformanceRankings(): Promise<StationPerformance[]> {
    const currentStatus = await this.getCurrentStatus();
    
    const performances: StationPerformance[] = currentStatus.map(station => {
      const performance: StationPerformance = {
        station_id: station.station_id,
        station_name: station.station_name,
        uptime_percentage: station.uptime_percentage,
        processing_efficiency: station.performance_metrics.efficiency,
        error_rate: station.performance_metrics.error_rate,
        maintenance_frequency: 0, // Would need historical data
        performance_trend: 'stable', // Would need trend analysis
        last_maintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Mock data
      };

      // Determine performance trend (simplified)
      if (performance.uptime_percentage > 95 && performance.error_rate < 2) {
        performance.performance_trend = 'improving';
      } else if (performance.uptime_percentage < 85 || performance.error_rate > 5) {
        performance.performance_trend = 'declining';
      }

      return performance;
    });

    // Sort by overall performance score
    return performances.sort((a, b) => {
      const scoreA = (a.uptime_percentage * 0.4) + (a.processing_efficiency * 0.4) - (a.error_rate * 0.2);
      const scoreB = (b.uptime_percentage * 0.4) + (b.processing_efficiency * 0.4) - (b.error_rate * 0.2);
      return scoreB - scoreA;
    });
  }

  // Get comprehensive operation insights
  async getOperationInsights(): Promise<OperationInsights> {
    try {
      const [currentStatus, todaySummary, weekSummary] = await Promise.all([
        this.getCurrentStatus(),
        this.getTodaySummary(),
        this.getWeekSummary()
      ]);

      const stationRankings = await this.getStationPerformanceRankings();
      const problematicStations = await this.getProblematicStations();

      // Calculate system health score
      const avgUptime = currentStatus.reduce((acc, s) => acc + s.uptime_percentage, 0) / currentStatus.length;
      const avgEfficiency = currentStatus.reduce((acc, s) => acc + s.performance_metrics.efficiency, 0) / currentStatus.length;
      const avgErrorRate = currentStatus.reduce((acc, s) => acc + s.performance_metrics.error_rate, 0) / currentStatus.length;
      
      const systemHealthScore = Math.round((avgUptime * 0.5) + (avgEfficiency * 0.3) - (avgErrorRate * 0.2));

      // Generate alerts
      const alerts = problematicStations.map(station => ({
        type: station.current_state === 'error' ? 'critical' as const : 'warning' as const,
        station_id: station.station_id,
        message: station.current_state === 'error' 
          ? `Station ${station.station_name} is in error state`
          : `Station ${station.station_name} performance below threshold`,
        timestamp: new Date().toISOString(),
        resolved: false
      }));

      // Generate recommendations
      const recommendations = problematicStations.map(station => {
        if (station.performance_metrics.error_rate > 5) {
          return {
            priority: 'high' as const,
            category: 'maintenance' as const,
            station_id: station.station_id,
            recommendation: `Schedule immediate maintenance for ${station.station_name} due to high error rate`,
            expected_impact: 'Reduce error rate by 60-80%'
          };
        }
        if (station.uptime_percentage < 85) {
          return {
            priority: 'medium' as const,
            category: 'performance' as const,
            station_id: station.station_id,
            recommendation: `Investigate downtime causes for ${station.station_name}`,
            expected_impact: 'Improve uptime by 10-15%'
          };
        }
        return {
          priority: 'low' as const,
          category: 'efficiency' as const,
          station_id: station.station_id,
          recommendation: `Optimize processing parameters for ${station.station_name}`,
          expected_impact: 'Improve efficiency by 5-10%'
        };
      });

      return {
        overall_performance: {
          system_health_score: systemHealthScore,
          trending: systemHealthScore >= 90 ? 'up' : systemHealthScore >= 75 ? 'stable' : 'down',
          key_metrics: {
            total_uptime: todaySummary?.total_uptime_hours || 0,
            average_efficiency: avgEfficiency,
            incident_rate: avgErrorRate
          }
        },
        station_rankings: stationRankings,
        alerts,
        recommendations
      };
    } catch (error) {
      console.error('Error generating operation insights:', error);
      throw error;
    }
  }

  // Get uptime statistics
  async getUptimeStats(period: 'today' | 'week' | 'month' = 'today'): Promise<{
    overall_uptime: number;
    station_uptimes: Array<{
      station_id: string;
      station_name: string;
      uptime_percentage: number;
      uptime_hours: number;
      downtime_hours: number;
    }>;
  }> {
    let summary: OperationSummary | null = null;
    
    switch (period) {
      case 'today':
        summary = await this.getTodaySummary();
        break;
      case 'week':
        summary = await this.getWeekSummary();
        break;
      case 'month':
        summary = await this.getMonthSummary();
        break;
    }

    if (!summary) {
      return {
        overall_uptime: 0,
        station_uptimes: []
      };
    }

    const stationUptimes = summary.stations.map(station => ({
      station_id: station.station_id,
      station_name: station.station_name,
      uptime_percentage: station.uptime_percentage,
      uptime_hours: summary!.total_uptime_hours / summary!.stations.length, // Simplified
      downtime_hours: summary!.total_downtime_hours / summary!.stations.length
    }));

    return {
      overall_uptime: summary.uptime_percentage,
      station_uptimes: stationUptimes
    };
  }

  // Monitor critical thresholds
  async checkCriticalThresholds(): Promise<{
    critical_alerts: number;
    stations_below_threshold: OperationStatus[];
    immediate_actions_required: string[];
  }> {
    const currentStatus = await this.getCurrentStatus();
    
    const UPTIME_THRESHOLD = 85;
    const ERROR_RATE_THRESHOLD = 5;
    const EFFICIENCY_THRESHOLD = 70;

    const stationsBelowThreshold = currentStatus.filter(station =>
      station.uptime_percentage < UPTIME_THRESHOLD ||
      station.performance_metrics.error_rate > ERROR_RATE_THRESHOLD ||
      station.performance_metrics.efficiency < EFFICIENCY_THRESHOLD
    );

    const immediateActions = stationsBelowThreshold.map(station => {
      const issues = [];
      if (station.uptime_percentage < UPTIME_THRESHOLD) {
        issues.push('low uptime');
      }
      if (station.performance_metrics.error_rate > ERROR_RATE_THRESHOLD) {
        issues.push('high error rate');
      }
      if (station.performance_metrics.efficiency < EFFICIENCY_THRESHOLD) {
        issues.push('low efficiency');
      }
      
      return `Station ${station.station_name}: ${issues.join(', ')} - requires immediate attention`;
    });

    return {
      critical_alerts: stationsBelowThreshold.filter(s => 
        s.current_state === 'error' || s.uptime_percentage < 50
      ).length,
      stations_below_threshold: stationsBelowThreshold,
      immediate_actions_required: immediateActions
    };
  }
}

// Export singleton instance
export const operationStatsService = new OperationStatsService();