import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDashboard2 } from '../DashboardLayout2';

const wasteData = [
  { name: 'PET', value: 32, color: '#3b82f6' },
  { name: 'PE', value: 24, color: '#22c55e' },
  { name: 'PP', value: 19, color: '#9333ea' },
  { name: 'PS', value: 12, color: '#f97316' },
  { name: 'Glass', value: 7, color: '#06b6d4' },
  { name: 'Can', value: 4, color: '#84cc16' },
  { name: 'Paper', value: 2, color: '#f59e0b' }
];

export const WasteDistribution2: React.FC = () => {
  const { language } = useDashboard2();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {language === 'ko' ? '폐기물 유형 분포 (일일)' : 'Waste Type Distribution (Daily)'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={wasteData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {wasteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, language === 'ko' ? '비율' : 'Percentage']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};