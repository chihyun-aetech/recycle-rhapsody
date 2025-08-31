import { useRef, useCallback } from 'react';

export type FitModeSource = 
  | 'manual-button'      // 사용자가 fit 버튼 클릭
  | 'manual-key'         // 사용자가 F키 또는 단축키 사용  
  | 'image-change'       // 사용자가 이미지 선택/변경
  | 'auto-trigger'       // 자동 트리거 (차단해야 함)
  | 'scroll-trigger'     // 스크롤 후 자동 트리거 (차단해야 함)
  | 'render-trigger';    // 렌더링 후 자동 트리거 (차단해야 함)

export interface FitModeControlState {
  isManualOnly: boolean;           // 수동 모드만 허용
  allowedSources: FitModeSource[]; // 허용된 소스 목록
  lastManualAction: number;        // 마지막 수동 액션 시간
  currentImageId: string | null;   // 현재 이미지 ID
}

export const useFitModeControl = () => {
  const controlStateRef = useRef<FitModeControlState>({
    isManualOnly: true,
    allowedSources: ['manual-button', 'manual-key', 'image-change'],
    lastManualAction: 0,
    currentImageId: null,
  });

  // fitMode 실행 허용 여부 체크
  const shouldAllowFitMode = useCallback((source: FitModeSource, imageId?: string) => {
    const state = controlStateRef.current;
    
    // 수동 모드에서 허용되지 않은 소스인 경우 차단
    if (state.isManualOnly && !state.allowedSources.includes(source)) {
      console.log(`🚫 FIT MODE BLOCKED - source: ${source} not allowed in manual-only mode`);
      return false;
    }

    // 이미지 변경이 아닌데 같은 이미지라면 차단 (중복 실행 방지)
    if (source !== 'image-change' && imageId && state.currentImageId === imageId) {
      console.log(`🚫 FIT MODE BLOCKED - duplicate call for same image: ${imageId}`);
      return false;
    }

    console.log(`✅ FIT MODE ALLOWED - source: ${source}${imageId ? `, imageId: ${imageId}` : ''}`);
    return true;
  }, []);

  // 수동 fitMode 실행 (버튼, 키보드)
  const executeFitMode = useCallback((source: FitModeSource, params: any, imageId?: string) => {
    if (!shouldAllowFitMode(source, imageId)) {
      return false;
    }

    // 상태 업데이트
    if (source === 'manual-button' || source === 'manual-key') {
      controlStateRef.current.lastManualAction = Date.now();
    }

    if (imageId) {
      controlStateRef.current.currentImageId = imageId;
    }

    console.log(`🎯 EXECUTING FIT MODE - source: ${source}`);
    return true;
  }, [shouldAllowFitMode]);

  // 이미지 변경 시 fitMode 허용
  const handleImageChange = useCallback((newImageId: string, params: any) => {
    const previousImageId = controlStateRef.current.currentImageId;
    
    // 실제로 이미지가 변경되었을 때만 허용
    if (previousImageId !== newImageId) {
      controlStateRef.current.currentImageId = newImageId;
      return executeFitMode('image-change', params, newImageId);
    }

    console.log(`🚫 IMAGE CHANGE IGNORED - same image: ${newImageId}`);
    return false;
  }, [executeFitMode]);

  // 자동 트리거 완전 차단
  const blockAutoTrigger = useCallback((source: FitModeSource, reason: string) => {
    console.log(`🚫 AUTO TRIGGER BLOCKED - source: ${source}, reason: ${reason}`);
    return false;
  }, []);

  return {
    shouldAllowFitMode,
    executeFitMode,
    handleImageChange,
    blockAutoTrigger,
    getState: () => controlStateRef.current,
  };
};