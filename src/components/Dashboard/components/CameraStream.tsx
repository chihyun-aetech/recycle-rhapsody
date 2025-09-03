import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import ReactPlayer from 'react-player';
import { useAtom } from 'jotai';
import { languageAtom } from '@/shared/store/dashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import { Play, Pause, RotateCcw, Maximize, Settings } from 'lucide-react';

type StreamProtocol = 'hls' | 'rtsp' | 'http';

interface CameraStreamProps {
  cameraId: string;
  cameraName: string;
  streamUrl?: string;
  className?: string;
  enableProtocolSelection?: boolean;
}

export const CameraStream: React.FC<CameraStreamProps> = ({
  cameraId,
  cameraName,
  streamUrl,
  className,
  enableProtocolSelection = true
}) => {
  const [language] = useAtom(languageAtom);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<StreamProtocol>('hls');
  const [showSettings, setShowSettings] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 프로토콜별 스트림 URL 생성
  const generateStreamUrl = (selectedProtocol: StreamProtocol): string => {
    if (streamUrl) return streamUrl;
    
    const baseUrl = window.location.hostname;
    
    switch (selectedProtocol) {
      case 'hls':
        return `http://${baseUrl}:8800/${cameraId}/index.m3u8`;
      case 'rtsp':
        return `rtsp://${baseUrl}:554/${cameraId}`;
      case 'http':
        return `https://${baseUrl}:443/stream/${cameraId}`;
      default:
        return `http://${baseUrl}:8800/${cameraId}/index.m3u8`;
    }
  };

  const currentStreamUrl = generateStreamUrl(protocol);

  const handlePlay = () => {
    setIsLoading(true);
    setError(null);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReload = () => {
    setError(null);
    setIsLoading(true);
    // 프로토콜이 변경되었을 때 플레이어 재시작
    setIsPlaying(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
      }
    }, 100);
  };

  const handleProtocolChange = (newProtocol: StreamProtocol) => {
    setProtocol(newProtocol);
    setError(null);
    setIsLoading(true);
    setIsPlaying(false);
    // 프로토콜 변경 시 플레이어 재시작
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
      }
    }, 100);
  };

  const handleError = (error: any) => {
    setError(language === 'ko' ? '스트림 로드 실패' : 'Stream load failed');
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setError(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            {cameraName}
          </CardTitle>
          <div className="flex items-center gap-2">
            {enableProtocolSelection && (
              <Select value={protocol} onValueChange={handleProtocolChange}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hls">HLS</SelectItem>
                  <SelectItem value="rtsp">RTSP</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReload}
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={isLoading}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black rounded-lg overflow-hidden">
          {error ? (
            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800">
              <div className="text-center">
                <p className="text-red-500 mb-2">{error}</p>
                <Button onClick={handleReload} variant="outline" size="sm">
                  {language === 'ko' ? '다시 시도' : 'Retry'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <div className="text-white">
                    {language === 'ko' ? '로딩 중...' : 'Loading...'}
                  </div>
                </div>
              )}
              <div style={{ width: '100%', height: 320, backgroundColor: 'black' }}>
                {/* @ts-ignore */}
                <ReactPlayer
                  key={currentStreamUrl}
                  playsInline
                  src={currentStreamUrl}
                  playing={isPlaying}
                  controls={true}
                  width="100%"
                  height="100%"
                  onProgress={() => setIsLoading(false)}
                  onError={handleError}
                  onReady={handleLoadedData}
                  onStart={() => {
                    setIsLoading(false);
                    setError(null);
                  }}
                  onPause={handlePause}
                  onPlay={handlePlay}
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {language === 'ko' ? '카메라 ID' : 'Camera ID'}: {cameraId}
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${
              error ? 'bg-red-500' : isLoading ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            {protocol.toUpperCase()} | 
            {error ? (language === 'ko' ? '오류' : 'Error') : 
             isLoading ? (language === 'ko' ? '연결 중' : 'Connecting') : 
             (language === 'ko' ? '연결됨' : 'Connected')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};