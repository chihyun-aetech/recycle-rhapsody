import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from '@/shared/ui';
import { useDashboard } from '../DashboardLayout';
import { languageAtom } from '@/shared/store/dashboardStore';
import { useAtom } from 'jotai';

const efficiencyData = [
  {
    category: 'Overall System',
    categoryKo: '전체 시스템',
    efficiency: 92,
    target: 90,
    status: 'excellent'
  },
  {
    category: 'Sorting Accuracy',
    categoryKo: '분류 정확도',
    efficiency: 98,
    target: 95,
    status: 'excellent'
  },
  {
    category: 'Processing Speed',
    categoryKo: '처리 속도',
    efficiency: 87,
    target: 85,
    status: 'good'
  },
  {
    category: 'Equipment Uptime',
    categoryKo: '장비 가동률',
    efficiency: 96,
    target: 95,
    status: 'excellent'
  },
  {
    category: 'Energy Efficiency',
    categoryKo: '에너지 효율',
    efficiency: 84,
    target: 80,
    status: 'good'
  },
  {
    category: 'Maintenance Schedule',
    categoryKo: '정비 일정',
    efficiency: 78,
    target: 85,
    status: 'needs_improvement'
  }
];

export const EfficiencyMetrics: React.FC = () => {
  const [language] = useAtom(languageAtom);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'outline';
      case 'needs_improvement': return 'warning';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'ko') {
      switch (status) {
        case 'excellent': return '우수';
        case 'good': return '양호';
        case 'needs_improvement': return '개선필요';
        case 'poor': return '불량';
        default: return status;
      }
    }
    return status.replace('_', ' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'ko' ? '효율성 지표' : 'Efficiency Metrics'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {efficiencyData.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-foreground">
                  {language === 'ko' ? metric.categoryKo : metric.category}
                </h3>
                <Badge variant={getStatusColor(metric.status) as any} className="text-xs">
                  {getStatusText(metric.status)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {language === 'ko' ? '현재' : 'Current'}
                  </span>
                  <span className="font-medium">{metric.efficiency}%</span>
                </div>
                <Progress value={metric.efficiency} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{language === 'ko' ? '목표' : 'Target'}: {metric.target}%</span>
                  <span>
                    {metric.efficiency >= metric.target ? '+' : ''}
                    {metric.efficiency - metric.target}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};