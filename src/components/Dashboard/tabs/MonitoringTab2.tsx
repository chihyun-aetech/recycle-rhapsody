import React from 'react';
import { useDashboard2 } from '../DashboardLayout2';
import { HardwareMonitoring } from '../components/HardwareMonitoring';
import { SystemLogs } from '../components/SystemLogs';

export const MonitoringTab2: React.FC = () => {
  const { language } = useDashboard2();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '모니터링 (Design 2)' : 'Monitoring (Design 2)'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '실시간 하드웨어 모니터링' : 'Real-time Hardware Monitoring'}
        </div>
      </div>

      {/* Hardware Monitoring */}
      <HardwareMonitoring />

      {/* System Logs */}
      <SystemLogs />
    </div>
  );
};