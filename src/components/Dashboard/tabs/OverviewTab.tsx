import React from 'react';
import { useDashboard } from '../DashboardLayout';
import { StatsCards } from '../components/StatsCards';
import { PerformanceChart } from '../components/PerformanceChart';
import { WasteDistribution } from '../components/WasteDistribution';
import { ProcessingLines } from '../components/ProcessingLines';

export const OverviewTab: React.FC = () => {
  const { language, expandedCard } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '개요' : 'Overview'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '실시간 폐기물 처리 현황' : 'Real-time Waste Processing Status'}
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Expanded Chart or Grid Layout */}
      {expandedCard ? (
        <div className="space-y-6">
          <PerformanceChart />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <PerformanceChart />
          
          {/* Waste Distribution */}
          <WasteDistribution />
        </div>
      )}

      {/* Processing Lines */}
      <ProcessingLines />
    </div>
  );
};