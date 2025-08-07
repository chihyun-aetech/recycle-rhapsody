import React from 'react';
import { useDashboard } from '../DashboardLayout';
import { StatusBar } from '../components/StatusBar';
import { ProcessingLineFlow } from '../components/ProcessingLineFlow';
import { SystemLogs } from '../components/SystemLogs';

export const IntegratedMonitoringTab: React.FC = () => {
  const { language } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '모니터링' : 'Monitoring'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '실시간 하드웨어 모니터링' : 'Real-time Hardware Monitoring'}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Processing Line Flow */}
      <ProcessingLineFlow />

      {/* System Logs */}
      <SystemLogs />
    </div>
  );
};