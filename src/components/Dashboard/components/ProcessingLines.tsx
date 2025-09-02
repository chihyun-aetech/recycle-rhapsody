import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { languageAtom } from '@/shared/store/dashboardStore';
import { useAtom } from 'jotai';

const lineData = [
  { id: 1, name: 'Line 1', capacity: 1200, status: 'Active', efficiency: 92 },
  { id: 2, name: 'Line 2', capacity: 1100, status: 'Active', efficiency: 88 },
  { id: 3, name: 'Line 3', capacity: 600, status: 'Maintenance', efficiency: 65 }
];

export const ProcessingLines: React.FC = () => {
  const [language] = useAtom(languageAtom);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Maintenance':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'ko') {
      switch (status) {
        case 'Active': return '가동중';
        case 'Maintenance': return '점검중';
        default: return status;
      }
    }
    return status;
  };

  const handleLineClick = (lineId: number) => {
    setSelectedLine(selectedLine === lineId ? null : lineId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {language === 'ko' ? '처리 라인 성능' : 'Processing Line Performance'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lineData.map((line) => (
          <div 
            key={line.id}
            className={cn(
              'p-4 border rounded-lg cursor-pointer transition-all duration-200',
              'hover:shadow-md',
              selectedLine === line.id && 'ring-2 ring-primary ring-offset-2 bg-primary/5'
            )}
            onClick={() => handleLineClick(line.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-foreground">{line.name}</h3>
                <Badge variant={getStatusColor(line.status) as any}>
                  {getStatusText(line.status)}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {line.capacity} {language === 'ko' ? '톤' : 'tons'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'ko' ? '효율성' : 'Efficiency'}
                </span>
                <span className="font-medium">{line.efficiency}%</span>
              </div>
              <Progress value={line.efficiency} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};