import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Settings, Package, Cpu, Zap, Wrench } from 'lucide-react';
import { useDashboard } from '../DashboardLayout';
import { cn } from '@/lib/utils';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface Equipment {
  id: string;
  name: string;
  nameKo: string;
  icon: React.ReactNode;
  status: 'online' | 'warning' | 'offline';
  type: 'input' | 'camera' | 'atron' | 'output';
}

const equipmentList: Equipment[] = [
  { id: 'vision-box-1', name: 'Vision Box #1', nameKo: 'Vision Box #1', icon: <Camera className="w-4 h-4" />, status: 'online', type: 'camera' },
  { id: 'vision-box-2', name: 'Vision Box #2', nameKo: 'Vision Box #2', icon: <Camera className="w-4 h-4" />, status: 'warning', type: 'camera' },
  { id: 'vision-box-3', name: 'Vision Box #3', nameKo: 'Vision Box #3', icon: <Camera className="w-4 h-4" />, status: 'offline', type: 'camera' },
  { id: 'conveyor-1', name: 'Conveyor Board #1', nameKo: '컨베이어 보드 #1', icon: <Settings className="w-4 h-4" />, status: 'online', type: 'input' },
  { id: 'component-1', name: 'Component #1', nameKo: '부품 #1', icon: <Cpu className="w-4 h-4" />, status: 'online', type: 'atron' },
  { id: 'torque-1', name: 'Torque Ball #1', nameKo: '토크 볼 #1', icon: <Zap className="w-4 h-4" />, status: 'offline', type: 'output' },
  { id: 'input-1', name: 'Input #1', nameKo: 'Input #1', icon: <Package className="w-4 h-4" />, status: 'online', type: 'input' },
  { id: 'atron-1', name: 'Atron H/W #1', nameKo: 'Atron H/W #1', icon: <Wrench className="w-4 h-4" />, status: 'online', type: 'atron' },
];

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
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedLine, setSelectedLine] = useState<string>('Line1');

  // Initial nodes for the flow
  const initialNodes: Node[] = selectedEquipment.map((eq, index) => ({
    id: eq.id,
    type: 'default',
    position: { x: index * 200, y: 100 },
    data: { 
      label: (
        <div className="flex items-center space-x-2">
          {eq.icon}
          <span className="text-xs">{language === 'ko' ? eq.nameKo : eq.name}</span>
        </div>
      ) 
    },
    style: {
      background: eq.status === 'online' ? '#dcfce7' : eq.status === 'warning' ? '#fef3c7' : '#fee2e2',
      border: eq.status === 'online' ? '1px solid #16a34a' : eq.status === 'warning' ? '1px solid #d97706' : '1px solid #dc2626',
    }
  }));

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

  // Update nodes when selected equipment changes
  React.useEffect(() => {
    const newNodes = selectedEquipment.map((eq, index) => ({
      id: eq.id,
      type: 'default',
      position: { x: index * 200, y: 100 },
      data: { 
        label: (
          <div className="flex items-center space-x-2">
            {eq.icon}
            <span className="text-xs">{language === 'ko' ? eq.nameKo : eq.name}</span>
          </div>
        ) 
      },
      style: {
        background: eq.status === 'online' ? '#dcfce7' : eq.status === 'warning' ? '#fef3c7' : '#fee2e2',
        border: eq.status === 'online' ? '1px solid #16a34a' : eq.status === 'warning' ? '1px solid #d97706' : '1px solid #dc2626',
      }
    }));

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
  }, [selectedEquipment, language, setNodes, setEdges]);

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
          <div className="w-80 border rounded-lg p-4 bg-muted/20">
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

            {/* Equipment List */}
            <div>
              <h4 className="text-sm font-medium mb-2">
                {language === 'ko' ? '장비 목록' : 'Equipment List'}
              </h4>
              <ScrollArea className="h-64">
                <div className="space-y-2">
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
          <div className="flex-1 border rounded-lg bg-muted/20">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              attributionPosition="top-right"
            >
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};