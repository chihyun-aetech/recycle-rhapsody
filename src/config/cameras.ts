// 카메라 설정 정보
export interface CameraConfig {
  id: string;
  name: string;
  ip: string;
  rtspUrl: string;
  hlsUrl?: string;
  location: string;
  status: 'online' | 'offline' | 'error';
}

// 현재 설정된 카메라 목록
export const cameras: CameraConfig[] = [
  {
    id: 'sungnam-atronc-3',
    name: '성남_AtronC_3호기',
    ip: '192.168.0.3',
    rtspUrl: 'rtsp://admin:password@192.168.0.3/stream1',
    location: '성남 공장',
    status: 'offline' // RTSPtoWeb 서버 설정 후 'online'으로 변경
  }
];

// RTSPtoWeb 서버 설정
export const rtspConfig = {
  serverUrl: 'http://localhost:8083',
  // 실제 서버 IP로 변경 필요
  // serverUrl: 'http://your-server-ip:8083',
};