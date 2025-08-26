import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Package, Cpu, Zap } from 'lucide-react';
import { useDashboard } from '../DashboardLayout';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Force cache refresh - removed Settings icon dependency

interface Equipment {
  id: string;
  name: string;
  nameKo: string;
  icon: React.ReactNode;
  status: 'online' | 'warning' | 'offline';
  type: 'input' | 'camera' | 'atron' | 'output';
  stationId?: string; // R1, R2, R3 매핑용
}

interface ProcessingStats {
  stationId: string;
  totalProcessed: number;
  processingRate: number; // 분당 처리량
  currentHourProcessed: number;
  averageArea: number;
  averageDepth: number;
  categoryDistribution: { [key: string]: number };
  lastProcessedTime: string;
}

// 실제 CSV 데이터를 시뮬레이션하는 함수 (장비별 처리량 분석용)
const generateEquipmentProcessingData = (): { [key: string]: ProcessingStats } => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // R1, R2, R3의 처리 성능 차이 반영
  const baseRates = {
    'R1': 65, // 분당 65개
    'R2': 58, // 분당 58개
    'R3': 53  // 분당 53개
  };
  
  // 실제 CSV 데이터에서 관찰되는 모든 major_category 반영
  const categories = ['Pet', 'Pe', 'Pp', 'Ps', 'Glass', 'Can', 'Paper', 'Other', 'PP', 'Else'];
  
  const result: { [key: string]: ProcessingStats } = {};
  
  ['R1', 'R2', 'R3'].forEach(stationId => {
    const baseRate = baseRates[stationId as keyof typeof baseRates];
    const variance = 0.1 + Math.random() * 0.2; // ±15% 변동
    const currentRate = Math.round(baseRate * (1 + (Math.random() - 0.5) * variance));
    const hourlyTotal = Math.round(baseRate * 60 * (0.8 + Math.random() * 0.4)); // 시간당 처리량
    
    // 카테고리별 분포 생성
    const categoryDist: { [key: string]: number } = {};
    let remaining = hourlyTotal;
    categories.forEach((cat, index) => {
      if (index === categories.length - 1) {
        categoryDist[cat] = remaining;
      } else {
        const portion = Math.round(remaining * (0.1 + Math.random() * 0.3));
        categoryDist[cat] = portion;
        remaining -= portion;
      }
    });
    
    result[stationId] = {
      stationId,
      totalProcessed: Math.round(baseRate * 60 * 7), // 일일 총 처리량 (7시간 기준)
      processingRate: currentRate,
      currentHourProcessed: hourlyTotal,
      averageArea: Math.round(25000 + Math.random() * 20000), // 25000-45000 픽셀
      averageDepth: Math.round(50 + Math.random() * 50), // 50-100mm
      categoryDistribution: categoryDist,
      lastProcessedTime: new Date(now.getTime() - Math.random() * 30000).toISOString() // 최근 30초 내
    };
  });
  
  return result;
};

const equipmentList: Equipment[] = [
  { id: 'vision-box-1', name: 'Vision Box #1 (R1)', nameKo: 'Vision Box #1 (R1)', icon: <Camera className="w-4 h-4" />, status: 'online', type: 'camera', stationId: 'R1' },
  { id: 'vision-box-2', name: 'Vision Box #2 (R2)', nameKo: 'Vision Box #2 (R2)', icon: <Camera className="w-4 h-4" />, status: 'warning', type: 'camera', stationId: 'R2' },
  { id: 'vision-box-3', name: 'Vision Box #3 (R3)', nameKo: 'Vision Box #3 (R3)', icon: <Camera className="w-4 h-4" />, status: 'offline', type: 'camera', stationId: 'R3' },
  { id: 'atron-1', name: 'Atron H/W #1 (R1)', nameKo: 'Atron H/W #1 (R1)', icon: <Cpu className="w-4 h-4" />, status: 'online', type: 'atron', stationId: 'R1' },
  { id: 'atron-2', name: 'Atron H/W #2 (R2)', nameKo: 'Atron H/W #2 (R2)', icon: <Cpu className="w-4 h-4" />, status: 'online', type: 'atron', stationId: 'R2' },
  { id: 'atron-3', name: 'Atron H/W #3 (R3)', nameKo: 'Atron H/W #3 (R3)', icon: <Cpu className="w-4 h-4" />, status: 'online', type: 'atron', stationId: 'R3' },
  { id: 'input-1', name: 'Input', nameKo: 'Input', icon: <Package className="w-4 h-4" />, status: 'online', type: 'input' },
  { id: 'output-1', name: 'Output', nameKo: 'Output', icon: <Zap className="w-4 h-4" />, status: 'online', type: 'output' },
];

// Custom node component with hover tooltip for processing stats
const CustomNode = ({ data, id }: { data: any, id: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const processingStats = data.processingStats;
  const language = data.language || 'en';
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const updateTooltipPosition = () => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // 기본 위치 계산
      let x = rect.right + 10;
      let y = rect.top - 8;
      
      // 툴팁이 오른쪽 화면을 벗어나는 경우
      if (x + 300 > windowWidth) { // 300px는 툴팁의 대략적인 너비
        x = rect.left - 310; // 왼쪽에 표시
      }
      
      // 툴팁이 아래쪽 화면을 벗어나는 경우
      if (y + 400 > windowHeight) { // 400px는 툴팁의 대략적인 최대 높이
        y = windowHeight - 410; // 위쪽으로 조정
      }
      
      // 툴팁이 위쪽 화면을 벗어나는 경우
      if (y < 10) {
        y = 10; // 최소 상단 여백
      }
      
      setTooltipPosition({ x, y });
    }
  };

  useEffect(() => {
    if (showTooltip) {
      updateTooltipPosition();
      // 스크롤이나 리사이즈 시 위치 업데이트
      window.addEventListener('scroll', updateTooltipPosition);
      window.addEventListener('resize', updateTooltipPosition);
      return () => {
        window.removeEventListener('scroll', updateTooltipPosition);
        window.removeEventListener('resize', updateTooltipPosition);
      };
    }
  }, [showTooltip]);

  return (
    <div 
      ref={nodeRef}
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="px-4 py-2 bg-background dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg shadow-sm text-foreground dark:text-white cursor-pointer hover:shadow-md transition-shadow">
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={{ background: '#555' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{ background: '#555' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{ background: '#555' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={{ background: '#555' }}
        />
        {data.label}
        
        {/* Processing rate indicator */}
        {processingStats && (
          <div className="text-xs text-muted-foreground mt-1">
            {language === 'ko' ? `분당 ${processingStats.processingRate}개` : `${processingStats.processingRate}/min`}
          </div>
        )}
      </div>

      {/* Hover Tooltip - Portal */}
      {showTooltip && processingStats && createPortal(
        <div 
          className="fixed p-3 bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl text-sm min-w-64 max-h-96 overflow-y-auto"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 99999,
            pointerEvents: 'auto',
            transform: 'translateZ(0)'
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="font-semibold mb-2">
            {language === 'ko' ? `${processingStats.stationId} 처리 현황` : `${processingStats.stationId} Processing Status`}
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>{language === 'ko' ? '현재 처리율:' : 'Current Rate:'}</span>
              <span className="font-medium">{language === 'ko' ? `분당 ${processingStats.processingRate}개` : `${processingStats.processingRate}/min`}</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'ko' ? '시간당 처리:' : 'Hourly Total:'}</span>
              <span className="font-medium">{processingStats.currentHourProcessed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'ko' ? '일일 총량:' : 'Daily Total:'}</span>
              <span className="font-medium">{processingStats.totalProcessed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'ko' ? '평균 면적:' : 'Avg Area:'}</span>
              <span className="font-medium">{processingStats.averageArea.toLocaleString()}px</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'ko' ? '평균 깊이:' : 'Avg Depth:'}</span>
              <span className="font-medium">{processingStats.averageDepth}mm</span>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <div className="font-medium mb-2">{language === 'ko' ? '카테고리별 처리량 (시간당):' : 'Category Distribution (Hourly):'}</div>
              <div className="grid grid-cols-1 gap-1">
                {Object.entries(processingStats.categoryDistribution)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span className="text-muted-foreground">{category}:</span>
                      <span className="font-medium">{count.toLocaleString()}개</span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="border-t pt-1 mt-1 text-muted-foreground">
              <div className="text-xs">
                {language === 'ko' ? '최근 처리:' : 'Last Processed:'} {new Date(processingStats.lastProcessedTime).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>,
        document.getElementById('portal-root') as HTMLElement
      )}
    </div>
  );
};

const lines = ['Line1', 'Line2', 'Line3', 'Line4'];

const getStatusColor = (status: string): 'default' | 'secondary' | 'destructive' => {
  switch (status) {
    case 'online': return 'default';
    case 'warning': return 'secondary';
    case 'offline': return 'destructive';
    default: return 'default';
  }
};

const getStatusText = (status: string, language: string): string => {
  switch (status) {
    case 'online': return language === 'ko' ? '온라인' : 'online';
    case 'warning': return language === 'ko' ? '경고' : 'warning';
    case 'offline': return language === 'ko' ? '오프라인' : 'offline';
    default: return status;
  }
};

export const ProcessingLineFlow: React.FC = () => {
  const { language } = useDashboard();
  
  // Set initial equipment: Input => Vision Box #1 => Atron H/W #1 => Output
  const initialEquipment = [
    equipmentList.find(eq => eq.id === 'input-1')!,
    equipmentList.find(eq => eq.id === 'vision-box-1')!,
    equipmentList.find(eq => eq.id === 'atron-1')!,
    equipmentList.find(eq => eq.id === 'atron-2')!,
    equipmentList.find(eq => eq.id === 'atron-3')!,
    equipmentList.find(eq => eq.id === 'output-1')!,
  ];
  
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(initialEquipment);
  const [selectedLine, setSelectedLine] = useState<string>('Line1');
  const [processingData, setProcessingData] = useState<{ [key: string]: ProcessingStats }>({});

  // 실시간 처리량 데이터 업데이트
  useEffect(() => {
    const updateProcessingData = () => {
      setProcessingData(generateEquipmentProcessingData());
    };

    // 초기 데이터 로드
    updateProcessingData();

    // 30초마다 데이터 업데이트
    const interval = setInterval(updateProcessingData, 30000);

    return () => clearInterval(interval);
  }, []);
  
  const nodeTypes = {
    custom: CustomNode,
  };

  // Helper function to create nodes with processing data
  const createNodesWithData = (equipment: Equipment[]) => {
    return equipment.map((eq, index) => ({
      id: eq.id,
      type: 'custom',
      position: { x: index * 250, y: 100 },
      data: { 
        label: (
          <div className="flex items-center space-x-2">
            {eq.icon}
            <span className="text-xs">{language === 'ko' ? eq.nameKo : eq.name}</span>
          </div>
        ),
        processingStats: eq.stationId ? processingData[eq.stationId] : null,
        language
      },
      style: {
        background: eq.status === 'online' ? '#dcfce7' : eq.status === 'warning' ? '#fef3c7' : '#fee2e2',
        border: eq.status === 'online' ? '1px solid #16a34a' : eq.status === 'warning' ? '1px solid #d97706' : '1px solid #dc2626',
      }
    }));
  };

  // Initial nodes for the flow
  const initialNodes: Node[] = createNodesWithData(selectedEquipment);

  const initialEdges: Edge[] = selectedEquipment.length > 1 
    ? selectedEquipment.slice(0, -1).map((_, index) => ({
        id: `e${index}-${index + 1}`,
        source: selectedEquipment[index].id,
        target: selectedEquipment[index + 1].id,
        type: 'smoothstep',
      }))
    : [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Update nodes when selected equipment or processing data changes
  React.useEffect(() => {
    const newNodes = createNodesWithData(selectedEquipment);

    const newEdges = selectedEquipment.length > 1 
      ? selectedEquipment.slice(0, -1).map((_, index) => ({
          id: `e${index}-${index + 1}`,
          source: selectedEquipment[index].id,
          target: selectedEquipment[index + 1].id,
          type: 'smoothstep',
        }))
      : [];

    setNodes(newNodes);
    setEdges(newEdges);
  }, [selectedEquipment, language, processingData, setNodes, setEdges]);

  const handleEquipmentClick = (equipment: Equipment) => {
    if (selectedEquipment.find(eq => eq.id === equipment.id)) {
      setSelectedEquipment(prev => prev.filter(eq => eq.id !== equipment.id));
    } else {
      setSelectedEquipment(prev => [...prev, equipment]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'ko' ? 'Site1 현황' : 'Site1 Status'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-96 space-x-4">
          {/* Left Panel - Equipment List */}
          <div className="w-80 border rounded-lg p-4 bg-muted/20 flex flex-col">
            {/* Minimap */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">
                {language === 'ko' ? '라인 선택' : 'Line Selection'}
              </h4>
              <div className="grid grid-cols-2 gap-1 border rounded p-2 bg-background">
                {lines.map((line) => (
                  <div
                    key={line}
                    className={cn(
                      "text-xs p-2 text-center rounded cursor-pointer transition-colors",
                      selectedLine === line 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                    onClick={() => setSelectedLine(line)}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Component List */}
            <div className="flex-1 flex flex-col min-h-0">
              <h4 className="text-sm font-medium mb-2">
                {language === 'ko' ? '구성요소 목록' : 'Component List'}
              </h4>
              <ScrollArea className="flex-1">
                <div className="space-y-2 pr-2">
                  {equipmentList.map((equipment) => (
                    <div
                      key={equipment.id}
                      className={cn(
                        "flex items-center justify-between p-2 border rounded cursor-pointer transition-colors",
                        selectedEquipment.find(eq => eq.id === equipment.id)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted/50"
                      )}
                      onClick={() => handleEquipmentClick(equipment)}
                    >
                      <div className="flex items-center space-x-2">
                        {equipment.icon}
                        <span className="text-sm">
                          {language === 'ko' ? equipment.nameKo : equipment.name}
                        </span>
                      </div>
                      <Badge variant={getStatusColor(equipment.status)} className="text-xs">
                        {getStatusText(equipment.status, language)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Panel - Flow Chart */}
          <div className="flex-1 border rounded-lg bg-muted/20 dark:bg-gray-800 dark:border-gray-600 relative z-0">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgesReconnectable={true}
              reconnectRadius={5}
              fitView
              attributionPosition="bottom-right"
              style={{ 
                backgroundColor: 'transparent'
              }}
            >
              <Controls className="dark:bg-gray-700 dark:border-gray-600 [&>button]:dark:bg-gray-600 [&>button]:dark:text-white [&>button]:dark:border-gray-500" />
              <Background 
                color="#94a3b8" 
                className="dark:opacity-20"
              />
            </ReactFlow>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};