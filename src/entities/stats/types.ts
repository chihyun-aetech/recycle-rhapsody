import type { BaseResponse, DetectionStatistics, PickingStatistics } from '@/shared/types/api';

// Period Statistics Types
export interface GetPeriodStatisticsParams {
  /** 시작 날짜 (YYYY-MM-DDTHH:MM:SS) */
  start_date: string;
  /** 종료 날짜 (YYYY-MM-DDTHH:MM:SS) */
  end_date: string;
  /** 스테이션 ID 목록 (기본: 전체) */
  station_ids?: string[] | null;
  /** 집계 단위 (daily/hourly) */
  granularity?: 'daily' | 'hourly';
}

export interface GetPeriodStatisticsResponse extends BaseResponse {
  /** 요청 기간 정보 */
  period: GetPeriodStatisticsParams;
  /** 기간 내 총 픽업 시도 통계 */
  picking_attempts: PickingStatistics;
  /** 기간 내 총 감지 객체 통계 */
  detected_objects: DetectionStatistics;
  /** 일별 트렌드 데이터 */
  daily_trends?: any[];
  /** 시간별 트렌드 데이터 */
  hourly_trends?: any[];
}

// Daily Reports Types
export interface GetDailyReportsParams {
  /** 시작 날짜 */
  start_date: string;
  /** 종료 날짜 */
  end_date: string;
  /** 스테이션 ID 필터 */
  station_id?: string | null;
  /** 페이지 번호 */
  page?: number;
  /** 페이지당 문서 수 */
  limit?: number;
}

export interface GenerateDailyReportsParams {
  /** 시작 날짜 */
  start_date: string;
  /** 종료 날짜 */
  end_date: string;
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

// Hourly Reports Types
export interface GetHourlyReportsParams {
  /** 시작 시간 */
  start_datetime: string;
  /** 종료 시간 */
  end_datetime: string;
  /** 스테이션 ID 필터 */
  station_id?: string | null;
  /** 페이지 번호 */
  page?: number;
  /** 페이지당 문서 수 */
  limit?: number;
}

export interface GenerateHourlyReportsParams {
  /** 시작 시간 */
  start_datetime: string;
  /** 종료 시간 */
  end_datetime: string;
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

// Summary Types
export interface GetTodaySummaryParams {
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

export interface GetWeekSummaryParams {
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

export interface GetMonthSummaryParams {
  /** 스테이션 ID 목록 */
  station_ids?: string[] | null;
}

// Response Types
export type GetDailyReportsResponse = any;
export type GetHourlyReportsResponse = any;
export type GetTodaySummaryResponse = any;
export type GetWeekSummaryResponse = any;
export type GetMonthSummaryResponse = any;