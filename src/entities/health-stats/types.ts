import type { BaseResponse, AlertsStats, SystemHealthStats, MachineHealthStats } from '@/shared/api';

// Period Health Statistics Types
export interface GetPeriodHealthStatisticsParams {
  /** 시작 날짜 (YYYY-MM-DDTHH:MM:SS) */
  start_date: string;
  /** 종료 날짜 (YYYY-MM-DDTHH:MM:SS) */
  end_date: string;
  /** 스테이션 ID 목록 (기본: 전체) */
  station_ids?: string[] | null;
}

export interface GetPeriodHealthStatisticsResponse extends BaseResponse {
  /** 조회 기간 정보 */
  period_info: any;
  /** 시스템 헬스 통계 */
  system_health: SystemHealthStats;
  /** 머신 헬스 통계 */
  machine_health: MachineHealthStats;
  /** 알람 통계 */
  alerts: AlertsStats;
}

// Summary Types
export interface GetTodayHealthSummaryParams {
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

export interface GetWeekHealthSummaryParams {
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

export interface GetMonthHealthSummaryParams {
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

// Component-specific Types
export interface GetSystemHealthOnlyParams {
  /** 시작 날짜 */
  start_date: string;
  /** 종료 날짜 */
  end_date: string;
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

export interface GetMachineHealthOnlyParams {
  /** 시작 날짜 */
  start_date: string;
  /** 종료 날짜 */
  end_date: string;
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

export interface GetAlertsStatsOnlyParams {
  /** 시작 날짜 */
  start_date: string;
  /** 종료 날짜 */
  end_date: string;
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

// Response Types
export type GetTodayHealthSummaryResponse = any;
export type GetWeekHealthSummaryResponse = any;
export type GetMonthHealthSummaryResponse = any;
export type GetSystemHealthOnlyResponse = any;
export type GetMachineHealthOnlyResponse = any;
export type GetAlertsStatsOnlyResponse = any;