import React from 'react';
import { useDashboard } from '../DashboardLayout';
import { StatsOverview } from '../components/StatsOverview';
import { EfficiencyMetrics } from '../components/EfficiencyMetrics';
import { TrendAnalysis } from '../components/TrendAnalysis';

export const StatsTab: React.FC = () => {
  const { language } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '통계' : 'Statistics'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '성능 분석 및 통계' : 'Performance Analysis & Statistics'}
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Efficiency Metrics */}
      <EfficiencyMetrics />

      {/* Trend Analysis */}
      <TrendAnalysis />
    </div>
  );
};