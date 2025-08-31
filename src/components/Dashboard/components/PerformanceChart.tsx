import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../DashboardLayout';

const dailyData = [
  { date: '01/26', throughput: 2200, revenue: 195000, analysis: 2100, runtime: 18 },
  { date: '01/27', throughput: 2150, revenue: 190000, analysis: 2050, runtime: 17.5 },
  { date: '01/28', throughput: 2300, revenue: 205000, analysis: 2200, runtime: 19 },
  { date: '01/29', throughput: 2450, revenue: 215000, analysis: 2350, runtime: 20 },
  { date: '01/30', throughput: 2600, revenue: 230000, analysis: 2500, runtime: 21 },
  { date: '01/31', throughput: 2900, revenue: 217500, analysis: 2700, runtime: 22 }
];

export const PerformanceChart: React.FC = () => {
  const { language, expandedCard } = useDashboard();

  const getChartData = () => {
    switch (expandedCard) {
      case 'revenue':
        return { 
          data: dailyData, 
          dataKey: 'revenue', 
          color: '#22c55e',
          title: language === 'ko' ? '일일 수익 추이' : 'Daily Revenue Trends'
        };
      case 'analysis':
        return { 
          data: dailyData, 
          dataKey: 'analysis', 
          color: '#9333ea',
          title: language === 'ko' ? '일일 분석 추이' : 'Daily Analysis Trends'
        };
      case 'runtime':
        return { 
          data: dailyData, 
          dataKey: 'runtime', 
          color: '#f97316',
          title: language === 'ko' ? '일일 가동시간 추이' : 'Daily Runtime Trends'
        };
      default:
        return { 
          data: dailyData, 
          dataKey: 'throughput', 
          color: '#00A788',
          title: language === 'ko' ? '일일 처리량 추이' : 'Daily Throughput Trends'
        };
    }
  };

  const chartConfig = getChartData();

  return (
    <Card className={expandedCard ? 'col-span-full' : ''}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {chartConfig.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={expandedCard ? 'h-96' : 'h-64'}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartConfig.data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={chartConfig.dataKey}
                stroke={chartConfig.color}
                strokeWidth={3}
                dot={{ fill: chartConfig.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: chartConfig.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};