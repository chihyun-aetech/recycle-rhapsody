import { useCallback, useRef, useEffect } from 'react';
import { useFitModeControl, FitModeSource } from './useScrollState';

export interface CanvasInteractionOptions {
  onFitMode?: (params: any) => void;
  onImageChange?: (imageId: string, params: any) => void;
}

export const useCanvasInteraction = (options: CanvasInteractionOptions = {}) => {
  const { onFitMode, onImageChange } = options;
  
  const {
    shouldAllowFitMode,
    executeFitMode,
    handleImageChange,
    blockAutoTrigger,
  } = useFitModeControl();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ❌ 모든 자동 트리거 차단
  const interceptAutoFitMode = useCallback((source: FitModeSource, reason: string, params?: any) => {
    // 자동 트리거는 무조건 차단
    if (source === 'auto-trigger' || source === 'scroll-trigger' || source === 'render-trigger') {
      blockAutoTrigger(source, reason);
      return false;
    }
    
    return true;
  }, [blockAutoTrigger]);

  // ✅ 수동 FIT 버튼 클릭
  const handleManualFitButton = useCallback((params: any) => {
    console.log(`🎯 MANUAL FIT BUTTON CLICKED`);
    
    if (executeFitMode('manual-button', params)) {
      onFitMode?.(params);
      return true;
    }
    
    return false;
  }, [executeFitMode, onFitMode]);

  // ✅ F키 또는 키보드 단축키
  const handleFitKeyPress = useCallback((params: any, key: string = 'F') => {
    console.log(`🎯 FIT KEY PRESSED: ${key}`);
    
    if (executeFitMode('manual-key', params)) {
      onFitMode?.(params);
      return true;
    }
    
    return false;
  }, [executeFitMode, onFitMode]);

  // ✅ 이미지 선택/변경 (실제 변경일 때만)
  const handleImageSelection = useCallback((newImageId: string, params: any) => {
    console.log(`🖼️ IMAGE SELECTION: ${newImageId}`);
    
    if (handleImageChange(newImageId, params)) {
      onFitMode?.(params);
      onImageChange?.(newImageId, params);
      return true;
    }
    
    return false;
  }, [handleImageChange, onFitMode, onImageChange]);

  // ❌ 스크롤 이벤트 (fitMode 실행하지 않음)
  const handleWheel = useCallback((event: WheelEvent) => {
    const { deltaY } = event;
    
    console.log(`🎯 SCROLL EVENT START: {deltaY: ${deltaY}}`);
    
    // 스크롤은 처리하지만 fitMode는 실행하지 않음
    // 줌이나 팬 등의 뷰포트 조작만 수행
    
    console.log(`🎯 SCROLL EVENT END - NO fitMode execution`);
  }, []);

  // ❌ 렌더링 후 자동 트리거 차단
  const handleRenderComplete = useCallback(() => {
    console.log(`🎨 RENDER COMPLETE - blocking auto fitMode`);
    
    // 렌더링이 완료되어도 fitMode를 자동으로 실행하지 않음
    interceptAutoFitMode('render-trigger', 'render complete');
  }, [interceptAutoFitMode]);

  // ❌ 기타 모든 자동 트리거 차단 래퍼
  const wrapAutoTriggerCall = useCallback((originalCall: () => void, source: FitModeSource, reason: string) => {
    if (!interceptAutoFitMode(source, reason)) {
      return; // 차단됨
    }
    
    // 만약 허용된다면 (현재는 없음) 실행
    originalCall();
  }, [interceptAutoTriggerCall]);

  // 키보드 이벤트 리스너 설정
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // F키 감지
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        
        // 기본 fitMode 파라미터 (실제로는 현재 캔버스 상태에서 가져와야 함)
        const params = {
          imgWidth: 1920,
          imgHeight: 1200,
          canvasWidth: 1100,
          canvasHeight: 760,
        };
        
        handleFitKeyPress(params, event.key);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleFitKeyPress]);

  // 캔버스 이벤트 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return {
    canvasRef,
    
    // ✅ 허용된 수동 액션들
    handleManualFitButton,
    handleFitKeyPress,
    handleImageSelection,
    
    // ❌ 차단된 자동 트리거들
    interceptAutoFitMode,
    handleRenderComplete,
    wrapAutoTriggerCall,
  };
};