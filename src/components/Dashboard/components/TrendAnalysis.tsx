import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboard } from '../DashboardLayout';
import { useAtom } from 'jotai';
import { languageAtom } from '@/shared/store/dashboardStore';

const trendData = [
  { week: 'Week 1', throughput: 2500, efficiency: 85, errors: 12 },
  { week: 'Week 2', throughput: 2650, efficiency: 87, errors: 10 },
  { week: 'Week 3', throughput: 2800, efficiency: 89, errors: 8 },
  { week: 'Week 4', throughput: 2900, efficiency: 92, errors: 6 }
];

const kpiTrends = [
  {
    name: 'Throughput Trend',
    nameKo: '처리량 추세',
    value: '+16%',
    trend: 'up',
    color: '#3b82f6'
  },
  {
    name: 'Efficiency Trend',
    nameKo: '효율성 추세',
    value: '+8.2%',
    trend: 'up',
    color: '#22c55e'
  },
  {
    name: 'Error Rate Trend',
    nameKo: '오류율 추세',
    value: '-50%',
    trend: 'down',
    color: '#ef4444'
  }
];

export const TrendAnalysis: React.FC = () => {
  const [language] = useAtom(languageAtom);

  return (
    <div className="space-y-6">
      {/* KPI Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiTrends.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ko' ? kpi.nameKo : kpi.name}
                  </p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {kpi.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${kpi.trend === 'up' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput & Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ko' ? '처리량 & 효율성 추세' : 'Throughput & Efficiency Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="throughput" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name={language === 'ko' ? '처리량' : 'Throughput'}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    name={language === 'ko' ? '효율성' : 'Efficiency'}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Error Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ko' ? '오류율 감소 추세' : 'Error Rate Reduction Trend'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}`, language === 'ko' ? '오류 수' : 'Errors']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="errors"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};