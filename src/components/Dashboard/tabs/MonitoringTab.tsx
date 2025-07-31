import React from 'react';
import { useDashboard } from '../DashboardLayout';
import { ConveyorSystem } from '../components/ConveyorSystem';
import { VisionBox } from '../components/VisionBox';
import { RealTimeMetrics } from '../components/RealTimeMetrics';

export const MonitoringTab: React.FC = () => {
  const { language } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '모니터링' : 'Monitoring'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '실시간 장비 모니터링' : 'Real-time Equipment Monitoring'}
        </div>
      </div>

      {/* Real-time Metrics */}
      <RealTimeMetrics />

      {/* Conveyor System Visualization */}
      <ConveyorSystem />

      {/* Vision Box Details */}
      <VisionBox />
    </div>
  );
};