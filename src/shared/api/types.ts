import { AxiosError, AxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}


export interface PaginationInfo {
  /** 전체 문서 수 */
  total: number;
  /** 현재 페이지 */
  page: number;
  /** 페이지당 문서 수 */
  limit: number;
  /** 전체 페이지 수 */
  total_pages: number;
}

export interface BaseResponse {
  /** 성공 여부 */
  success: boolean;
  /** 응답 메시지 */
  message: string;
}

export interface PaginatedResponse<T = any> extends BaseResponse {
  /** 페이지네이션 정보 */
  pagination: PaginationInfo;
  /** 데이터 목록 */
  data: T[];
}

export interface ValidationError {
  /** 에러 위치 */
  loc: (string | number)[];
  /** 에러 메시지 */
  msg: string;
  /** 에러 타입 */
  type: string;
}

export interface HTTPValidationError {
  /** 상세 에러 정보 */
  detail: ValidationError[];
}

export interface CategoryCount {
  /** 카테고리명 */
  category: string;
  /** 개수 */
  count: number;
}

export interface AlertTypeStats {
  /** 알람 타입 */
  type: string;
  /** 발생 횟수 */
  count: number;
  /** 컴포넌트별 상세 통계 */
  components: any[];
}

export interface AlertSeverityStats {
  /** 심각도 (warning/critical) */
  severity: string;
  /** 해당 심각도 총 발생 횟수 */
  total_count: number;
  /** 타입별 상세 통계 */
  types: AlertTypeStats[];
}

export interface AlertsStats {
  /** 총 알람 수 */
  total_alerts: number;
  /** 경고 알람 수 */
  warning_count: number;
  /** 치명적 알람 수 */
  critical_count: number;
  /** 심각도별 상세 통계 */
  by_severity: AlertSeverityStats[];
}

export interface SystemHealthStats {
  /** 사용량 평균값 (cpu, gpu, ram) */
  usage_avg: Record<string, number>;
  /** 사용량 최대값 (cpu, gpu, ram) */
  usage_max: Record<string, number>;
  /** 온도 평균값 (cpu, gpu, camera_left, camera_right) */
  temp_avg: Record<string, number>;
  /** 온도 최대값 (cpu, gpu, camera_left, camera_right) */
  temp_max: Record<string, number>;
}

export interface MachineHealthStats {
  /** 컨베이어 속도 최소값 */
  conveyor_speed_min: number;
  /** 컨베이어 속도 평균값 */
  conveyor_speed_avg: number;
  /** 컨베이어 속도 최대값 */
  conveyor_speed_max: number;
}

export interface DetectionStatistics {
  /** 총 감지 객체 수 */
  total: number;
  /** 주요 카테고리별 감지 통계 */
  by_major_category: CategoryCount[];
  /** 세부 카테고리별 감지 통계 */
  by_sub_category: CategoryCount[];
}

export interface PickingStatistics {
  /** 총 픽업 시도 횟수 */
  total: number;
  /** 주요 카테고리별 픽업 통계 */
  by_major_category: CategoryCount[];
  /** 세부 카테고리별 픽업 통계 */
  by_sub_category: CategoryCount[];
}

