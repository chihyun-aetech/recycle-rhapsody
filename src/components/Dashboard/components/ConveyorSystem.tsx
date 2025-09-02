import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { languageAtom } from '@/shared/store/dashboardStore';
import { useAtom } from 'jotai';
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

// 로봇 위치 정의 (프롬프팅 사양 기반)
const robotPositions = [
  { id: 'R1', position: 25, name: 'Robot 1', capacity: '65/min' },
  { id: 'R2', position: 50, name: 'Robot 2', capacity: '58/min' }, 
  { id: 'R3', position: 75, name: 'Robot 3', capacity: '53/min' }
];

export const ConveyorSystem: React.FC = () => {
  const [language] = useAtom(languageAtom);
  const { selectedLine } = useDashboard();
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [activeRobot, setActiveRobot] = useState<string | null>(null);

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
          .map(item => ({ ...item, position: item.position + 1.5 }))
          .filter(item => item.position < 100);
        
        // 시간당 20,000개 기준으로 유입 (약 5.6개/초)
        if (Math.random() < 0.28) { // 28% 확률로 100ms마다 = 약 2.8개/초
          updated.push(generateWasteItem());
        }
        
        // 로봇 활동 시뮬레이션
        updated.forEach(item => {
          robotPositions.forEach(robot => {
            if (Math.abs(item.position - robot.position) < 2) {
              setActiveRobot(robot.id);
              setTimeout(() => setActiveRobot(null), 200);
            }
          });
        });
        
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
          {/* Conveyor Belt with 3 Robots */}
          <div className="relative bg-muted rounded-lg p-4 h-40 overflow-hidden">
            <div className="absolute top-4 left-4 text-sm font-medium text-muted-foreground">
              {language === 'ko' ? '컨베이어 벨트 (R1 → R2 → R3)' : 'Conveyor Belt (R1 → R2 → R3)'}
            </div>
            
            {/* Belt direction indicator */}
            <div className="absolute top-4 right-4 text-xs text-muted-foreground flex items-center">
              <span className="mr-2">{language === 'ko' ? '벨트 속도: 2.3 m/s' : 'Belt Speed: 2.3 m/s'}</span>
              <div className="w-6 h-1 bg-primary rounded animate-pulse" />
            </div>
            
            {/* Moving belt lines */}
            <div className="absolute bottom-16 left-0 right-0 h-2 bg-border rounded">
              <div className="h-full bg-gradient-to-r from-transparent via-foreground to-transparent opacity-30 animate-pulse" />
            </div>
            
            {/* Robot positions and detection zones */}
            {robotPositions.map((robot, index) => (
              <div key={robot.id} className="absolute bottom-20" style={{ left: `${robot.position}%`, transform: 'translateX(-50%)' }}>
                {/* Robot arm */}
                <div className={cn(
                  "w-8 h-12 bg-primary rounded-t-lg flex flex-col items-center justify-center transition-all duration-200",
                  activeRobot === robot.id && "bg-green-500 scale-110"
                )}>
                  <div className="w-4 h-4 bg-white rounded-full mb-1" />
                  <div className="text-xs font-bold text-white">{robot.id}</div>
                </div>
                
                {/* Detection zone */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-primary/20 rounded-full border-2 border-primary/40" />
                
                {/* Robot info */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-xs font-medium text-foreground">{robot.capacity}</div>
                  <div className="text-xs text-muted-foreground">
                    {language === 'ko' ? `로봇 ${index + 1}` : `Robot ${index + 1}`}
                  </div>
                </div>
                
                {/* Connection arrow to next robot */}
                {index < robotPositions.length - 1 && (
                  <div className="absolute top-6 left-8 w-16 h-0.5 bg-muted-foreground">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-2 border-l-muted-foreground border-y-1 border-y-transparent" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Waste items moving on belt */}
            {wasteItems.map((item) => (
              <div
                key={item.id}
                className="absolute bottom-14 w-3 h-3 rounded transition-all duration-100 shadow-sm"
                style={{
                  left: `${item.position}%`,
                  backgroundColor: item.color,
                  transform: 'translateX(-50%)',
                  zIndex: 10
                }}
                title={item.type}
              />
            ))}
          </div>

          {/* System Flow Diagram */}
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-foreground">
                {language === 'ko' ? '시스템 플로우' : 'System Flow'}
              </h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white font-bold">IN</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ko' ? '유입' : 'Inflow'}
                </div>
                <div className="text-xs font-medium">20K/hr</div>
              </div>
              
              <div className="flex-1 flex items-center justify-center space-x-4">
                {robotPositions.map((robot, index) => (
                  <React.Fragment key={robot.id}>
                    <div className="text-center">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all",
                        activeRobot === robot.id ? "bg-green-500" : "bg-primary"
                      )}>
                        <span className="text-white font-bold text-xs">{robot.id}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{robot.capacity}</div>
                    </div>
                    {index < robotPositions.length - 1 && (
                      <div className="w-6 h-0.5 bg-muted-foreground">
                        <div className="w-0 h-0 border-l-2 border-l-muted-foreground border-y-1 border-y-transparent float-right" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white font-bold">OUT</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ko' ? '분류완료' : 'Sorted'}
                </div>
                <div className="text-xs font-medium">97%</div>
              </div>
            </div>
          </div>

          {/* Category Legend */}
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-foreground">
                {language === 'ko' ? '분류 카테고리' : 'Sorting Categories'}
              </h3>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(wasteColors).slice(0, 10).map(([type, color]) => (
                <div key={type} className="text-center">
                  <div 
                    className="w-6 h-6 rounded mx-auto mb-1"
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