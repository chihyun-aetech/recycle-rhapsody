import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { languageAtom } from '@/shared/store/dashboardStore';
import { useAtom } from 'jotai';

const monthlyStats = [
  { month: 'Jan', throughput: 2800, revenue: 210000, efficiency: 85 },
  { month: 'Feb', throughput: 2650, revenue: 198000, efficiency: 82 },
  { month: 'Mar', throughput: 2950, revenue: 225000, efficiency: 88 },
  { month: 'Apr', throughput: 3100, revenue: 240000, efficiency: 91 },
  { month: 'May', throughput: 2900, revenue: 218000, efficiency: 87 },
  { month: 'Jun', throughput: 3200, revenue: 255000, efficiency: 93 }
];

export const StatsOverview: React.FC = () => {
  const [language] = useAtom(languageAtom);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Throughput */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ko' ? '월별 처리량' : 'Monthly Throughput'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} tons`, language === 'ko' ? '처리량' : 'Throughput']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="throughput" fill="hsl(var(--dashboard-blue))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ko' ? '월별 수익' : 'Monthly Revenue'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, language === 'ko' ? '수익' : 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--dashboard-green))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};