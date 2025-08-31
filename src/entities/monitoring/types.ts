import type { PaginatedResponse } from '@/shared/api';

// Object Logs Types
export interface GetObjectLogsParams {
  /** 스테이션 ID 필터 */
  station_id?: string | null;
  /** 주요 카테고리 필터 */
  major_category?: string | null;
  /** 픽업 여부 필터 */
  is_picked?: boolean | null;
  /** 시작 시간 (YYYY-MM-DDTHH:MM:SS) */
  start_time?: string | null;
  /** 종료 시간 (YYYY-MM-DDTHH:MM:SS) */
  end_time?: string | null;
  /** 페이지 번호 */
  page?: number;
  /** 페이지당 문서 수 */
  limit?: number;
}

// System Health Types
export interface GetSystemHealthParams {
  /** 스테이션 ID 필터 */
  station_id?: string | null;
  /** 시작 시간 */
  start_time?: string | null;
  /** 종료 시간 */
  end_time?: string | null;
  /** 페이지 번호 */
  page?: number;
  /** 페이지당 문서 수 */
  limit?: number;
}

// Alerts Types
export interface GetAlertsParams {
  /** 스테이션 ID 필터 */
  station_id?: string | null;
  /** 심각도 필터 (warning/critical) */
  severity?: string | null;
  /** 알람 타입 필터 */
  alert_type?: string | null;
  /** 시작 시간 */
  start_time?: string | null;
  /** 종료 시간 */
  end_time?: string | null;
  /** 페이지 번호 */
  page?: number;
  /** 페이지당 문서 수 */
  limit?: number;
}

// Operation State Types
export interface GetOperationStateParams {
  /** 스테이션 ID 필터 */
  station_id?: string | null;
  /** 작동 상태 필터 */
  state?: boolean | null;
  /** 시작 시간 */
  start_time?: string | null;
  /** 종료 시간 */
  end_time?: string | null;
  /** 페이지 번호 */
  page?: number;
  /** 페이지당 문서 수 */
  limit?: number;
}

// Machine Health Types
export interface GetMachineHealthParams {
  /** 스테이션 ID 필터 */
  station_id?: string | null;
  /** 시작 시간 */
  start_time?: string | null;
  /** 종료 시간 */
  end_time?: string | null;
  /** 페이지 번호 */
  page?: number;
  /** 페이지당 문서 수 */
  limit?: number;
}

// Response Types
export type GetObjectLogsResponse = PaginatedResponse;
export type GetSystemHealthResponse = PaginatedResponse;
export type GetAlertsResponse = PaginatedResponse;
export type GetOperationStateResponse = PaginatedResponse;
export type GetMachineHealthResponse = PaginatedResponse;