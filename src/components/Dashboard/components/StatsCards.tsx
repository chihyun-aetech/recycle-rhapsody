import React, { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Clock } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { useDashboard } from '../DashboardLayout';
import { languageAtom } from '@/shared/store/dashboardStore';
import { useAtom } from 'jotai';

const statsData = {
  throughput: {
    value: '2,900',
    unit: 'tons',
    change: '+12%',
    trend: 'up',
    icon: TrendingUp,
    gradient: 'bg-gradient-blue'
  },
  revenue: {
    value: '$217.5K',
    unit: '',
    change: '+8.5%',
    trend: 'up',
    icon: DollarSign,
    gradient: 'bg-gradient-green'
  },
  analysis: {
    value: '2,700',
    unit: '',
    change: '93%',
    trend: 'up',
    icon: BarChart3,
    gradient: 'bg-gradient-purple'
  },
  runtime: {
    value: '720',
    unit: 'hrs',
    change: '100%',
    trend: 'up',
    icon: Clock,
    gradient: 'bg-gradient-orange'
  }
};

export const StatsCards: React.FC = () => {
  const [language] = useAtom(languageAtom);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const getCardTitle = (key: string) => {
    const titles = {
      ko: {
        throughput: '총 처리량',
        revenue: '총 수익',
        analysis: '총 분석',
        runtime: '총 가동시간'
      },
      en: {
        throughput: 'Total Throughput',
        revenue: 'Total Revenue',
        analysis: 'Total Analysis',
        runtime: 'Total Runtime'
      }
    };
    return titles[language][key as keyof typeof titles[typeof language]];
  };

  const getCardSubtitle = (key: string) => {
    const subtitles = {
      ko: {
        throughput: '지난 달 대비',
        revenue: '목표 대비',
        analysis: '정확도',
        runtime: '이번 달 가동률'
      },
      en: {
        throughput: 'from last month',
        revenue: 'from target',
        analysis: 'accuracy rate',
        runtime: 'uptime this month'
      }
    };
    return subtitles[language][key as keyof typeof subtitles[typeof language]];
  };

  const handleCardClick = (cardKey: string) => {
    setExpandedCard(expandedCard === cardKey ? null : cardKey);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(statsData).map(([key, data]) => {
        const Icon = data.icon;
        const isExpanded = expandedCard === key;
        
        return (
          <Card 
            key={key}
            className={cn(
              'relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg',
              isExpanded && 'ring-2 ring-primary ring-offset-2'
            )}
            onClick={() => handleCardClick(key)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {getCardTitle(key)}
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-foreground">
                      {data.value}
                    </span>
                    {data.unit && (
                      <span className="text-sm text-muted-foreground">
                        {data.unit}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={cn(
                      'text-xs font-medium',
                      data.trend === 'up' ? 'text-success' : 'text-destructive'
                    )}>
                      {data.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getCardSubtitle(key)}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  data.gradient
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};