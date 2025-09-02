import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { languageAtom } from '@/shared/store/dashboardStore';
import { useAtom } from 'jotai';

const wasteData = [
  { name: 'PET', value: 28, color: '#3b82f6' },
  { name: 'PE', value: 22, color: '#22c55e' },
  { name: 'PP', value: 18, color: '#9333ea' },
  { name: 'PS', value: 15, color: '#f97316' },
  { name: 'Glass', value: 8, color: '#06b6d4' },
  { name: 'Can', value: 5, color: '#84cc16' },
  { name: 'Paper', value: 3, color: '#f59e0b' },
  { name: 'Other', value: 1, color: '#ef4444' }
];

export const WasteDistribution: React.FC = () => {
  const [language] = useAtom(languageAtom);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {language === 'ko' ? '폐기물 유형 분포' : 'Waste Type Distribution'}
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
                innerRadius={50}
                outerRadius={90}
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
                height={30}
                className='mt-2'
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};