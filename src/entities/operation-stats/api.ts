import {
  CurrentStatusResponse,
  OperationSummaryResponse,
  OperationPeriodResponse,
  OperationStatsFilters
} from './types';

const API_BASE = '/api/v1/operation-statistics';

export const operationStatsApi = {
  // Get current operation status for all stations
  getCurrentStatus: async (stationIds?: string): Promise<CurrentStatusResponse> => {
    const params = new URLSearchParams();
    if (stationIds) {
      params.append('station_ids', stationIds);
    }

    const url = `${API_BASE}/current-status${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch current operation status: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get today's operation summary
  getTodaySummary: async (stationId?: string): Promise<OperationSummaryResponse> => {
    const params = new URLSearchParams();
    if (stationId) {
      params.append('station_id', stationId);
    }

    const url = `${API_BASE}/summary/today${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch today's operation summary: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get this week's operation summary
  getWeekSummary: async (stationId?: string): Promise<OperationSummaryResponse> => {
    const params = new URLSearchParams();
    if (stationId) {
      params.append('station_id', stationId);
    }

    const url = `${API_BASE}/summary/week${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch week's operation summary: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get this month's operation summary
  getMonthSummary: async (stationId?: string): Promise<OperationSummaryResponse> => {
    const params = new URLSearchParams();
    if (stationId) {
      params.append('station_id', stationId);
    }

    const url = `${API_BASE}/summary/month${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch month's operation summary: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get operation statistics for a specific period
  getPeriodStats: async (filters: OperationStatsFilters): Promise<OperationPeriodResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    if (!filters.start_date || !filters.end_date) {
      throw new Error('start_date and end_date are required for period stats');
    }

    const url = `${API_BASE}/period?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch period operation statistics: ${response.statusText}`);
    }
    
    return response.json();
  },
};