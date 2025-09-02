# VIGI C450 카메라 설정 가이드

## 1. 사전 준비

### 카메라 정보 확인
- 카메라 IP: 192.168.0.2
- 사용자명: admin
- 비밀번호: [VIGI 앱에서 설정한 비밀번호]
- 장치명: 성남_AtronC_3호기

### RTSP URL 형태
- 고화질: `rtsp://admin:password@192.168.0.2/stream1`
- 저화질: `rtsp://admin:password@192.168.0.2/stream2`

## 2. RTSPtoWeb 서버 실행

### Docker Compose 사용
```bash
# 1. 설정 파일에서 비밀번호 수정
# rtsp-config/config.json에서 "your_password_here"를 실제 비밀번호로 변경

# 2. Docker Compose 실행
docker-compose -f docker-compose.rtsp.yml up -d

# 3. 로그 확인
docker-compose -f docker-compose.rtsp.yml logs -f
```

### 수동 Docker 실행
```bash
docker run -d --name rtsp-to-web \
  -p 8083:8083 \
  -v $(pwd)/rtsp-config:/config \
  deepch/rtsp-to-web
```

## 3. 카메라 연결 테스트

### 1. VLC로 RTSP 테스트
```
미디어 > 네트워크 스트림 열기
rtsp://admin:password@192.168.0.2/stream1
```

### 2. RTSPtoWeb 관리 페이지
- http://localhost:8083
- 스트림 상태 확인 및 관리

### 3. HLS 스트림 URL
- Primary: http://localhost:8888/camera1/index.m3u8
- Alternative URLs:
  - http://localhost:8888/camera1_alt1/index.m3u8
  - http://localhost:8888/camera1_alt2/index.m3u8
  - http://localhost:8888/camera1_alt3/index.m3u8

## 4. React 프로젝트에서 확인

### 모니터링 탭에서 카메라 확인
1. 프로젝트 실행: `npm run dev`
2. 모니터링 탭으로 이동
3. 카메라 스트림이 표시되는지 확인

## 5. 문제 해결

### VIGI 카메라 RTSP 활성화 (중요!)
1. **VIGI Security Manager 앱** 실행
2. 카메라 선택 → **설정** → **고급 설정**
3. **네트워크** → **RTSP** 설정
4. **✅ RTSP 서비스 활성화** 체크 확인
5. **포트**: 554 (기본값)
6. **인증**: 활성화
7. **저장** 후 카메라 재부팅

### 스트림이 로드되지 않는 경우
1. VIGI 앱에서 RTSP 서비스 활성화 확인 ⭐ 가장 중요!
2. 카메라 IP와 비밀번호 확인 
3. 네트워크 연결 상태 확인
4. 방화벽 설정 확인 (포트 554, 8888)
5. 카메라와 서버가 같은 네트워크에 있는지 확인

### 네트워크 연결 테스트
```cmd
# Windows에서 포트 확인
telnet 192.168.0.2 554

# 또는 PowerShell에서
Test-NetConnection -ComputerName 192.168.0.2 -Port 554
```

### 추가 카메라 설정
1. `src/config/cameras.ts`에 카메라 정보 추가
2. `rtsp-config/config.json`에 스트림 추가
3. 모니터링 탭에 CameraStream 컴포넌트 추가

## 6. 보안 고려사항

- RTSP 비밀번호를 환경변수로 관리
- HTTPS 사용 시 Mixed Content 문제 해결
- 카메라 접근 IP 제한 설정