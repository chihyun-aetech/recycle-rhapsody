import React from 'react';
import { useDashboard2 } from '../DashboardLayout2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const metricsData = [
  {
    title: { ko: '총 처리량', en: 'Total Processing' },
    value: '12,847',
    unit: { ko: '개', en: 'items' },
    change: '+12.5%',
    trend: 'up',
    icon: Activity,
  },
  {
    title: { ko: '시스템 효율성', en: 'System Efficiency' },
    value: '94.2',
    unit: '%',
    change: '+2.1%',
    trend: 'up',
    icon: Zap,
  },
  {
    title: { ko: '오류율', en: 'Error Rate' },
    value: '0.8',
    unit: '%',
    change: '-0.3%',
    trend: 'down',
    icon: AlertTriangle,
  },
  {
    title: { ko: '가동률', en: 'Uptime' },
    value: '99.7',
    unit: '%',
    change: '+0.1%',
    trend: 'up',
    icon: CheckCircle,
  },
];

const statusData = [
  { line: 1, status: 'normal', throughput: '3,245' },
  { line: 2, status: 'normal', throughput: '3,128' },
  { line: 3, status: 'warning', throughput: '2,891' },
  { line: 4, status: 'normal', throughput: '3,583' },
];

export const OverviewTab2: React.FC = () => {
  const { language } = useDashboard2();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">정상</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">주의</Badge>;
      case 'critical':
        return <Badge variant="destructive">위험</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '개요 (Design 2)' : 'Overview (Design 2)'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '시스템 전체 현황' : 'Overall System Status'}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {language === 'ko' ? metric.title.ko : metric.title.en}
                  </CardTitle>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {typeof metric.unit === 'string' ? metric.unit : language === 'ko' ? metric.unit.ko : metric.unit.en}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  )}
                  <span className="text-xs text-green-600 font-medium">
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Production Lines Status */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ko' ? '생산 라인 현황' : 'Production Lines Status'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusData.map((line, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="font-medium">
                    {language === 'ko' ? `라인 ${line.line}` : `Line ${line.line}`}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">{line.throughput} {language === 'ko' ? '개/시간' : 'items/hr'}</span>
                  {getStatusBadge(line.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};