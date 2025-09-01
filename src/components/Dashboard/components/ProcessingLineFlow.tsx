import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, ScrollArea } from '@/shared/ui';
import { Camera, Package, Cpu, Zap } from 'lucide-react';
import { useDashboard } from '../DashboardLayout';
import { cn } from '@/shared/lib/utils';
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
  stationId?: string; // R&T1, SUNGNAM2 등 매핑용
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


const equipmentList: Equipment[] = [
  { id: 'vision-box-1', name: 'Vision Box #1', nameKo: 'Vision Box #1', icon: <Camera className="w-4 h-4" />, status: 'online', type: 'camera', stationId: null },
  { id: 'vision-box-2', name: 'Vision Box #2', nameKo: 'Vision Box #2', icon: <Camera className="w-4 h-4" />, status: 'warning', type: 'camera', stationId: null },
  { id: 'vision-box-3', name: 'Vision Box #3', nameKo: 'Vision Box #3', icon: <Camera className="w-4 h-4" />, status: 'offline', type: 'camera', stationId: null },
  { id: 'atron-1', name: 'Atron H/W #1', nameKo: 'Atron H/W #1', icon: <Cpu className="w-4 h-4" />, status: 'online', type: 'atron', stationId: null },
  { id: 'atron-2', name: 'Atron H/W #2', nameKo: 'Atron H/W #2', icon: <Cpu className="w-4 h-4" />, status: 'online', type: 'atron', stationId: null },
  { id: 'atron-3', name: 'Atron H/W #3', nameKo: 'Atron H/W #3', icon: <Cpu className="w-4 h-4" />, status: 'online', type: 'atron', stationId: null },
  { id: 'input-1', name: 'Input', nameKo: 'Input', icon: <Package className="w-4 h-4" />, status: 'online', type: 'input', stationId: null },
  { id: 'output-1', name: 'Output', nameKo: 'Output', icon: <Zap className="w-4 h-4" />, status: 'online', type: 'output', stationId: null },
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
          <div className={cn(
            "text-xs mt-1",
            !data.isServerData ? "text-muted-foreground bg-muted/30 px-1 rounded" : "text-muted-foreground"
          )}>
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

interface ProcessingLineFlowProps {
  objectLogsData?: any;
  operationStateData?: any;
  alertsData?: any;
  machineHealthData?: any;
  hasRealData: {
    objectLogs: boolean;
    operationState: boolean;
    alerts: boolean;
    machineHealth: boolean;
    [key: string]: boolean;
  };
  selectedSite: string;
}

export const ProcessingLineFlow: React.FC<ProcessingLineFlowProps> = ({ 
  objectLogsData, 
  operationStateData,
  alertsData,
  machineHealthData,
  hasRealData,
  selectedSite
}) => {
  const { language } = useDashboard();
  
  // Helper function to extract H/W index from station_id
  const extractHwIndexFromStationId = (stationId: string): number => {
    // Extract last digit(s): "R&T1" -> 1, "SUNGNAM12" -> 12
    const match = stationId.match(/\d+$/);
    return match ? parseInt(match[0]) : 1;
  };
  
  // Helper function to determine equipment status from server data
  const getEquipmentStatus = (stationId: string): 'online' | 'warning' | 'offline' => {
    // Check alerts first for critical/warning states
    if (hasRealData.alerts && alertsData?.results?.length > 0) {
      const stationAlerts = alertsData.results.filter(alert => alert.station_id === stationId);
      if (stationAlerts.length > 0) {
        const criticalAlerts = stationAlerts.filter(alert => alert.severity === 'critical');
        const warningAlerts = stationAlerts.filter(alert => alert.severity === 'warning');
        
        if (criticalAlerts.length > 0) return 'offline';
        if (warningAlerts.length > 0) return 'warning';
      }
    }
    
    // Check operation state for online/offline
    if (hasRealData.operationState && operationStateData?.results?.length > 0) {
      const stationOperation = operationStateData.results.find(op => op.station_id === stationId);
      if (stationOperation) {
        return stationOperation.state ? 'online' : 'offline';
      }
    }
    
    // Check machine health as fallback
    if (hasRealData.machineHealth && machineHealthData?.results?.length > 0) {
      const stationMachine = machineHealthData.results.find(machine => machine.station_id === stationId);
      if (stationMachine) {
        // Check for high temperatures or other issues
        const cpuTemp = stationMachine.cpu_temperature || 0;
        const gpuTemp = stationMachine.gpu_temperature || 0;
        
        if (cpuTemp > 80 || gpuTemp > 85) return 'offline';
        if (cpuTemp > 70 || gpuTemp > 75) return 'warning';
        return 'online';
      }
    }
    
    return 'online'; // Default to online if no data
  };
  
  // Generate dynamic equipment list based on available station_ids from server data
  const generateEquipmentFromStations = (): Equipment[] => {
    const equipment: Equipment[] = [];
    const allStationIds = new Set<string>();
    
    // Collect all station_ids from all server data sources
    if (hasRealData.operationState && operationStateData?.results?.length > 0) {
      operationStateData.results.forEach(op => allStationIds.add(op.station_id));
    }
    if (hasRealData.alerts && alertsData?.results?.length > 0) {
      alertsData.results.forEach(alert => allStationIds.add(alert.station_id));
    }
    if (hasRealData.machineHealth && machineHealthData?.results?.length > 0) {
      machineHealthData.results.forEach(machine => allStationIds.add(machine.station_id));
    }
    if (hasRealData.objectLogs && objectLogsData?.results?.length > 0) {
      objectLogsData.results.forEach(log => allStationIds.add(log.station_id));
    }
    
    // Always add Input and Output
    equipment.push(equipmentList.find(eq => eq.id === 'input-1')!);
    
    // Add equipment based on available station_ids from server data
    if (allStationIds.size > 0) {
      const stationIds = Array.from(allStationIds).sort();
      
      stationIds.forEach(stationId => {
        const hwIndex = extractHwIndexFromStationId(stationId);
        const visionBox = equipmentList.find(eq => eq.id === `vision-box-${hwIndex}`);
        const atron = equipmentList.find(eq => eq.id === `atron-${hwIndex}`);
        
        // stationId의 끝자리 번호와 일치하는 장비만 추가
        if (visionBox && !equipment.find(eq => eq.id === visionBox.id) && stationId.endsWith(hwIndex.toString())) {
          const status = getEquipmentStatus(stationId);
          equipment.push({ ...visionBox, stationId, status });
        }
        if (atron && !equipment.find(eq => eq.id === atron.id) && stationId.endsWith(hwIndex.toString())) {
          const status = getEquipmentStatus(stationId);
          equipment.push({ ...atron, stationId, status });
        }
      });
    } else {
      // Fallback equipment for selected site
      [1, 2, 3].forEach(index => {
        const stationId = `${selectedSite}${index}`; // "R&T1", "SUNGNAM2" format
        const visionBox = equipmentList.find(eq => eq.id === `vision-box-${index}`);
        const atron = equipmentList.find(eq => eq.id === `atron-${index}`);
        
        // stationId의 끝자리 번호와 일치하는 장비만 추가
        if (visionBox && stationId.endsWith(index.toString())) {
          equipment.push({ ...visionBox, stationId });
        }
        if (atron && stationId.endsWith(index.toString())) {
          equipment.push({ ...atron, stationId });
        }
      });
    }
    
    equipment.push(equipmentList.find(eq => eq.id === 'output-1')!);
    
    return equipment;
  };
  
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedLine, setSelectedLine] = useState<string>('Line1');
  const [processingData, setProcessingData] = useState<{ [key: string]: ProcessingStats }>({});
  
  // Update equipment when site changes or data loads
  React.useEffect(() => {
    const newEquipment = generateEquipmentFromStations();
    setSelectedEquipment(newEquipment);
  }, [selectedSite, operationStateData, alertsData, machineHealthData, objectLogsData, hasRealData]);

  // Generate fallback processing statistics
  const generateFallbackProcessingData = (): { [key: string]: ProcessingStats } => {
    const now = new Date();
    const baseRates = [65, 58, 53]; // 분당 처리량 기본값
    
    const categories = ['Pet', 'Pe', 'Pp', 'Ps', 'Glass', 'Can', 'Paper', 'Other', 'PP', 'Else'];
    const result: { [key: string]: ProcessingStats } = {};
    
    // Generate data for 3 H/W units for the selected site
    [1, 2, 3].forEach(hwIndex => {
      const stationId = `${selectedSite}${hwIndex}`; // "R&T1", "SUNGNAM2" format
      const baseRate = baseRates[hwIndex - 1];
      const variance = 0.1 + Math.random() * 0.2;
      const currentRate = Math.round(baseRate * (1 + (Math.random() - 0.5) * variance));
      const hourlyTotal = Math.round(baseRate * 60 * (0.8 + Math.random() * 0.4));
      
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
        totalProcessed: Math.round(baseRate * 60 * 7),
        processingRate: currentRate,
        currentHourProcessed: hourlyTotal,
        averageArea: Math.round(25000 + Math.random() * 20000),
        averageDepth: Math.round(50 + Math.random() * 50),
        categoryDistribution: categoryDist,
        lastProcessedTime: new Date(now.getTime() - Math.random() * 30000).toISOString()
      };
    });
    
    return result;
  };

  // Process data to calculate processing statistics
  useEffect(() => {
    if (hasRealData.objectLogs && objectLogsData?.results?.length > 0) {
      // Real server data processing
      const stats: { [key: string]: ProcessingStats } = {};
      
      const groupedData: { [key: string]: any[] } = objectLogsData.results.reduce((acc, log) => {
        if (!acc[log.station_id]) acc[log.station_id] = [];
        acc[log.station_id].push(log);
        return acc;
      }, {} as { [key: string]: any[] });
      
      Object.entries(groupedData).forEach(([stationId, logs]) => {
        const recentLogs = logs.slice(-60);
        const categoryDist = logs.reduce((acc, log) => {
          acc[log.major_category] = (acc[log.major_category] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
        
        const avgArea = Math.round(logs.reduce((sum, log) => sum + (log.area || 0), 0) / logs.length);
        const avgDepth = Math.round(logs.reduce((sum, log) => sum + (log.depth || 0), 0) / logs.length);
        
        stats[stationId] = {
          stationId,
          totalProcessed: logs.length,
          processingRate: Math.round(recentLogs.length * (60 / Math.max(1, recentLogs.length))),
          currentHourProcessed: recentLogs.length,
          averageArea: avgArea,
          averageDepth: avgDepth,
          categoryDistribution: categoryDist,
          lastProcessedTime: logs[logs.length - 1]?.timestamp || new Date().toISOString()
        };
      });
      
      setProcessingData(stats);
    } else {
      // Use fallback data when no real server data
      setProcessingData(generateFallbackProcessingData());
    }
    
    // Update every 30 seconds for fallback data
    const interval = setInterval(() => {
      if (!hasRealData.objectLogs) {
        setProcessingData(generateFallbackProcessingData());
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [objectLogsData, hasRealData.objectLogs]);
  
  const nodeTypes = {
    custom: CustomNode,
  };

  // Helper function to create nodes with processing data
  const createNodesWithData = (equipment: Equipment[]) => {
    return equipment.map((eq, index) => {
      // Update equipment status based on server data
      let updatedStatus = eq.status;
      const hasServerDataForStatus = eq.stationId && (hasRealData.alerts || hasRealData.operationState || hasRealData.machineHealth);
      if (hasServerDataForStatus) {
        updatedStatus = getEquipmentStatus(eq.stationId);
      }
      
      // Determine if we have any server data for this equipment (for styling)
      const hasAnyServerData = hasRealData.objectLogs || hasRealData.alerts || hasRealData.operationState || hasRealData.machineHealth;
      
      return {
        id: eq.id,
        type: 'custom',
        position: { x: index * 250, y: 100 },
        data: { 
          label: (
            <div className={cn(
              "flex items-center space-x-2",
              !hasAnyServerData && "text-muted-foreground"
            )}>
              {eq.icon}
              <span className="text-xs">{language === 'ko' ? eq.nameKo : eq.name}</span>
            </div>
          ),
          processingStats: eq.stationId ? processingData[eq.stationId] : null,
          language,
          isServerData: hasRealData.objectLogs
        },
        style: {
          background: !hasAnyServerData
            ? (updatedStatus === 'online' ? '#f1f5f9' : updatedStatus === 'warning' ? '#f8fafc' : '#f1f5f9')
            : (updatedStatus === 'online' ? '#dcfce7' : updatedStatus === 'warning' ? '#fef3c7' : '#fee2e2'),
          border: !hasAnyServerData
            ? '1px solid #cbd5e1'
            : (updatedStatus === 'online' ? '1px solid #16a34a' : updatedStatus === 'warning' ? '1px solid #d97706' : '1px solid #dc2626'),
          opacity: !hasAnyServerData ? 0.7 : 1
        }
      };
    });
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
          {language === 'ko' ? `${selectedSite} 현황` : `${selectedSite} Status`}
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
                  {selectedEquipment.map((equipment) => {
                    // Update equipment status based on server data
                    let updatedStatus = equipment.status;
                    const hasServerDataForStatus = equipment.stationId && (hasRealData.alerts || hasRealData.operationState || hasRealData.machineHealth);
                    if (hasServerDataForStatus) {
                      updatedStatus = getEquipmentStatus(equipment.stationId);
                    }
                    
                    // Determine if we have any server data for this equipment
                    const hasAnyServerData = hasRealData.objectLogs || hasRealData.alerts || hasRealData.operationState || hasRealData.machineHealth;
                    
                    return (
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
                        <Badge variant={getStatusColor(updatedStatus)} className={cn(
                          "text-xs",
                          !hasAnyServerData && "bg-muted/50"
                        )}>
                          {getStatusText(updatedStatus, language)}
                        </Badge>
                      </div>
                    );
                  })}
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