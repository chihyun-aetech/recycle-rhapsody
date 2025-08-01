import React from 'react';
import { useDashboard2 } from '../DashboardLayout2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const performanceData = [
  { time: '06:00', value: 85 },
  { time: '09:00', value: 92 },
  { time: '12:00', value: 88 },
  { time: '15:00', value: 94 },
  { time: '18:00', value: 89 },
  { time: '21:00', value: 91 },
];

const productionData = [
  { line: 'Line 1', current: 3245, target: 3500 },
  { line: 'Line 2', current: 3128, target: 3200 },
  { line: 'Line 3', current: 2891, target: 3400 },
  { line: 'Line 4', current: 3583, target: 3600 },
];

export const StatsTab2: React.FC = () => {
  const { language } = useDashboard2();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '통계 (Design 2)' : 'Statistics (Design 2)'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '상세 분석 데이터' : 'Detailed Analytics'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ko' ? '시간별 성능 추이' : 'Performance Trend'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="fill-muted-foreground" />
                <YAxis className="fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Production Progress */}
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ko' ? '라인별 생산 진도' : 'Production Progress by Line'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {productionData.map((line, index) => {
              const progressPercent = (line.current / line.target) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{line.line}</span>
                    <span className="text-sm text-muted-foreground">
                      {line.current} / {line.target}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {progressPercent.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Daily Production Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ko' ? '일별 생산량' : 'Daily Production'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="line" className="fill-muted-foreground" />
              <YAxis className="fill-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};