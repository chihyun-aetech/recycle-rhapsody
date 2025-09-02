import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@/shared/ui';
import { useDashboard } from '../DashboardLayout';
import { useAtom } from 'jotai';
import { languageAtom } from '@/shared/store/dashboardStore';

// 3대 로봇 시스템의 실시간 데이터 (프롬프팅 사양 기반)
const realTimeData = [
  {
    name: 'Conveyor Inflow',
    nameKo: '컨베이어 유입량',
    value: '19,500/hr',
    target: 20000,
    current: 97,
    status: 'normal',
    description: 'Objects entering conveyor'
  },
  {
    name: 'Total Processing',
    nameKo: '전체 처리량',
    value: '176/min',
    target: 176, // R1(65) + R2(58) + R3(53)
    current: 92,
    status: 'normal',
    description: 'Combined robot capacity'
  },
  {
    name: 'Belt Speed',
    nameKo: '벨트 속도',
    value: '2.3 m/s',
    target: 2.5,
    current: 92,
    status: 'normal',
    description: 'Conveyor belt movement'
  },
  {
    name: 'Overall Pickup Rate',
    nameKo: '전체 픽업률',
    value: '97.2%',
    target: 95,
    current: 97,
    status: 'excellent',
    description: 'System-wide success rate'
  }
];

// 로봇별 상세 데이터
const robotData = [
  {
    id: 'R1',
    name: 'Robot 1',
    nameKo: '로봇 1',
    position: 1,
    capacity: '65/min',
    current: 62,
    efficiency: 95.4,
    status: 'normal',
    pickupRate: 98.1
  },
  {
    id: 'R2', 
    name: 'Robot 2',
    nameKo: '로봇 2',
    position: 2,
    capacity: '58/min',
    current: 54,
    efficiency: 93.1,
    status: 'normal',
    pickupRate: 96.8
  },
  {
    id: 'R3',
    name: 'Robot 3',
    nameKo: '로봇 3',
    position: 3,
    capacity: '53/min',
    current: 51,
    efficiency: 96.2,
    status: 'excellent',
    pickupRate: 97.5
  }
];

export const RealTimeMetrics: React.FC = () => {
  const [language] = useAtom(languageAtom);

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
    <div className="space-y-6">
      {/* System Overview Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {language === 'ko' ? '시스템 전체 현황' : 'System Overview'}
        </h2>
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
      </div>

      {/* Robot Status */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {language === 'ko' ? '로봇별 상태 (R1 → R2 → R3)' : 'Robot Status (R1 → R2 → R3)'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {robotData.map((robot, index) => (
            <Card key={robot.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <CardTitle className="text-sm font-medium">
                      {language === 'ko' ? robot.nameKo : robot.name}
                    </CardTitle>
                  </div>
                  <Badge variant={getStatusColor(robot.status) as any} className="text-xs">
                    {getStatusText(robot.status)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ko' ? `처리 용량: ${robot.capacity}` : `Capacity: ${robot.capacity}`}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {language === 'ko' ? '현재:' : 'Current:'}
                    </span>
                    <div className="font-semibold">{robot.current}/min</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {language === 'ko' ? '픽업률:' : 'Pickup:'}
                    </span>
                    <div className="font-semibold">{robot.pickupRate}%</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'ko' ? '효율성' : 'Efficiency'}</span>
                    <span>{robot.efficiency}%</span>
                  </div>
                  <Progress value={robot.efficiency} className="h-2" />
                </div>
              </CardContent>
              {index < robotData.length - 1 && (
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden md:block">
                  <div className="w-6 h-0.5 bg-muted-foreground">
                    <div className="w-0 h-0 border-l-4 border-l-muted-foreground border-y-2 border-y-transparent absolute right-0 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};