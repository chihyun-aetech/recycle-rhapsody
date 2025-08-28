// Response Types
export interface RootResponse {
  /** API 서버 상태 */
  status: string;
  /** API 버전 */
  version: string;
}

export interface HealthCheckResponse {
  /** 서버 상태 */
  status: string;
  /** 상세 정보 */
  details: {
    /** 데이터베이스 상태 */
    database: string;
    /** 캐시 상태 */
    cache: string;
    /** 메모리 사용량 */
    memory_usage: number;
    /** CPU 사용량 */
    cpu_usage: number;
  };
}