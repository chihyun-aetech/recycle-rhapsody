import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDashboard } from '../DashboardLayout';

type WasteType = 'PET' | 'PE' | 'PP' | 'PS' | 'Other' | 'Glass' | 'Can' | 'Paper' | 'Plastic Film' | 'Else' | 'Hole' | 'Object';

interface WasteItem {
  id: string;
  type: WasteType;
  position: number;
  color: string;
}

const wasteColors: Record<WasteType, string> = {
  'PET': '#3b82f6',
  'PE': '#22c55e',
  'PP': '#9333ea',
  'PS': '#f97316',
  'Other': '#ef4444',
  'Glass': '#06b6d4',
  'Can': '#84cc16',
  'Paper': '#f59e0b',
  'Plastic Film': '#ec4899',
  'Else': '#6b7280',
  'Hole': '#1f2937',
  'Object': '#dc2626'
};

export const ConveyorSystem: React.FC = () => {
  const { language, selectedLine } = useDashboard();
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);

  useEffect(() => {
    const generateWasteItem = (): WasteItem => {
      const types = Object.keys(wasteColors) as WasteType[];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: randomType,
        position: 0,
        color: wasteColors[randomType]
      };
    };

    const interval = setInterval(() => {
      setWasteItems(prev => {
        const updated = prev
          .map(item => ({ ...item, position: item.position + 2 }))
          .filter(item => item.position < 100);
        
        if (Math.random() < 0.3) {
          updated.push(generateWasteItem());
        }
        
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={cn(
      'transition-all duration-300',
      selectedLine && 'ring-2 ring-primary ring-offset-2'
    )}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {language === 'ko' ? '컨베이어 시스템' : 'Conveyor System'}
        </CardTitle>
        {selectedLine && (
          <Badge variant="outline" className="w-fit">
            {language === 'ko' ? `라인 ${selectedLine} 하이라이트` : `Line ${selectedLine} Highlighted`}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Conveyor Belt */}
          <div className="relative bg-muted rounded-lg p-4 h-32 overflow-hidden">
            <div className="absolute top-4 left-4 text-sm font-medium text-muted-foreground">
              {language === 'ko' ? '컨베이어 벨트' : 'Conveyor Belt'}
            </div>
            
            {/* Moving belt lines */}
            <div className="absolute bottom-8 left-0 right-0 h-1 bg-border">
              <div className="h-full bg-gradient-to-r from-transparent via-foreground to-transparent opacity-30 animate-pulse" />
            </div>
            
            {/* Waste items */}
            {wasteItems.map((item) => (
              <div
                key={item.id}
                className="absolute bottom-10 w-4 h-4 rounded transition-all duration-100"
                style={{
                  left: `${item.position}%`,
                  backgroundColor: item.color,
                  transform: 'translateX(-50%)'
                }}
                title={item.type}
              />
            ))}
          </div>

          {/* Vision Box */}
          <div className="flex items-center justify-center">
            <div className="bg-card border-2 border-dashed border-primary rounded-lg p-4 w-32 h-24 flex flex-col items-center justify-center">
              <div className="w-6 h-6 bg-primary rounded-full mb-2 animate-pulse" />
              <span className="text-xs font-medium text-center">
                {language === 'ko' ? '비전 박스' : 'Vision Box'}
              </span>
            </div>
          </div>

          {/* Atron Equipment */}
          <div className="bg-accent/20 rounded-lg p-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-foreground">
                {language === 'ko' ? 'Atron 분리 장비' : 'Atron Sorting Equipment'}
              </h3>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(wasteColors).slice(0, 8).map(([type, color]) => (
                <div key={type} className="text-center">
                  <div 
                    className="w-8 h-8 rounded mx-auto mb-1"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};