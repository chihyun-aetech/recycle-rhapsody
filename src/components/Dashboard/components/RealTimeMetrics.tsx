import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDashboard } from '../DashboardLayout';

const realTimeData = [
  {
    name: 'Current Throughput',
    nameKo: '현재 처리량',
    value: '145 tons/hr',
    target: 150,
    current: 97,
    status: 'normal'
  },
  {
    name: 'System Health',
    nameKo: '시스템 상태',
    value: '98%',
    target: 95,
    current: 98,
    status: 'excellent'
  },
  {
    name: 'Processing Speed',
    nameKo: '처리 속도',
    value: '2.3 m/s',
    target: 2.5,
    current: 92,
    status: 'normal'
  },
  {
    name: 'Error Rate',
    nameKo: '오류율',
    value: '0.2%',
    target: 1,
    current: 20,
    status: 'excellent'
  }
];

export const RealTimeMetrics: React.FC = () => {
  const { language } = useDashboard();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'normal': return 'outline';
      case 'warning': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'ko') {
      switch (status) {
        case 'excellent': return '우수';
        case 'normal': return '정상';
        case 'warning': return '주의';
        case 'critical': return '위험';
        default: return status;
      }
    }
    return status;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {realTimeData.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {language === 'ko' ? metric.nameKo : metric.name}
              </CardTitle>
              <Badge variant={getStatusColor(metric.status) as any} className="text-xs">
                {getStatusText(metric.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-2xl font-bold text-foreground">
                {metric.value}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{language === 'ko' ? '진행률' : 'Progress'}</span>
                  <span>{metric.current}%</span>
                </div>
                <Progress value={metric.current} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};