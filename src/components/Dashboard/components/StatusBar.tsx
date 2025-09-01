import React, { useState } from 'react';
import { Card, CardContent, Badge, Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui';
import { Cpu, Camera, Gauge } from 'lucide-react';
import { useDashboard } from '../DashboardLayout';
import { cn } from '@/shared/lib/utils';


const CircularProgress: React.FC<{
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}> = ({ value, size = 120, strokeWidth = 8, color = 'hsl(var(--primary))' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{value}%</span>
        <span className="text-xs text-muted-foreground">Usage</span>
      </div>
    </div>
  );
};

interface StatusBarProps {
  systemHealthData?: any;
  machineHealthData?: any;
  hasRealData: {
    systemHealth: boolean;
    machineHealth: boolean;
    [key: string]: boolean;
  };
  selectedSite: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  systemHealthData,
  machineHealthData,
  hasRealData,
  selectedSite
}) => {
  const { language } = useDashboard();
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
      case 'normal':
        return 'secondary';
      case 'warning':
        return 'destructive';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderDetailDialog = () => {
    if (!selectedDetail || !machineHealthData?.results) return null;

    const machineData = machineHealthData.results.find(machine => machine.station_id === selectedDetail);
    if (!machineData) return null;

    return (
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Cpu className="w-5 h-5" />
            <span>{language === 'ko' ? `${machineData.station_id} 상세` : `${machineData.station_id} Details`}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 p-6">
          <div className="flex flex-col items-center space-y-2">
            <CircularProgress value={machineData.cpu_usage || 0} size={100} />
            <div className="text-center">
              <div className="text-sm font-medium">CPU</div>
              <div className="text-xs text-muted-foreground">{machineData.cpu_temperature}°C</div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <CircularProgress value={machineData.gpu_usage || 0} size={100} />
            <div className="text-center">
              <div className="text-sm font-medium">GPU</div>
              <div className="text-xs text-muted-foreground">{machineData.gpu_temperature}°C</div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <CircularProgress value={machineData.memory_usage || 0} size={100} />
            <div className="text-center">
              <div className="text-sm font-medium">RAM</div>
              <div className="text-xs text-muted-foreground">Memory</div>
            </div>
          </div>
        </div>
      </DialogContent>
    );
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Machine Health Data */}
            {hasRealData.machineHealth && machineHealthData?.results?.length > 0 ? (
              // Real server data - normal styling
              machineHealthData.results.map((machine) => (
                <Button
                  key={machine.station_id}
                  variant="ghost"
                  className="group flex items-center space-x-2 h-auto p-2"
                  onClick={() => setSelectedDetail(machine.station_id)}
                >
                  <Cpu className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs font-medium">{machine.station_id}</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="group-hover:font-bold group-hover:text-black dark:group-hover:text-white">CPU: {machine.cpu_usage || 0}%</span>{" "}
                      <span className="group-hover:font-bold group-hover:text-black dark:group-hover:text-white">GPU: {machine.gpu_usage || 0}%</span>
                    </div>
                  </div>
                </Button>
              ))
            ) : (
              // Fallback/dummy data - gray styling (based on selected site)
              [1, 2, 3].map((index) => {
                const stationId = `${selectedSite}${index}`; // "R&T1", "SUNGNAM2" format
                return (
                  <Button
                    key={stationId}
                    variant="ghost"
                    className="group flex items-center space-x-2 h-auto p-2 bg-muted/30 hover:bg-muted/50"
                    onClick={() => setSelectedDetail(stationId)}
                  >
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                    <div className="text-left">
                      <div className="text-xs font-medium text-muted-foreground">{stationId}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="group-hover:font-bold">CPU: {Math.round(50 + Math.random() * 30)}%</span>{" "}
                        <span className="group-hover:font-bold">GPU: {Math.round(60 + Math.random() * 25)}%</span>
                      </div>
                    </div>
                  </Button>
                );
              })
            )}

            {/* Sensor Data */}
            {hasRealData.systemHealth && systemHealthData?.results?.length > 0 ? (
              // Real server data - normal styling
              systemHealthData.results.slice(0, 2).map((system, index) => (
                <div key={`${system.station_id}-${index}`} className="flex items-center space-x-2 px-2">
                  <Camera className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs font-medium">{system.station_id} Health</div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'ko' ? '정상' : 'Normal'}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {language === 'ko' ? '온라인' : 'Online'}
                  </Badge>
                </div>
              ))
            ) : (
              // Fallback/dummy sensor data - gray styling
              [
                { name: 'Camera Temp', nameKo: '카메라 온도', value: '42°C', icon: Camera, status: 'Normal' }
              ].map((sensor, index) => {
                const Icon = sensor.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 px-2 py-1 bg-muted/30 rounded">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <div className="text-left">
                      <div className="text-xs font-medium text-muted-foreground">{language === 'ko' ? sensor.nameKo : sensor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {sensor.value}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-muted/50">
                      {language === 'ko' ? '정상' : sensor.status}
                    </Badge>
                  </div>
                );
              })
            )}

            {/* Conveyor Speed - Always fallback data (no server endpoint) */}
            <div className={cn(
              "flex items-center space-x-2 px-2 py-1 rounded",
              "bg-muted/30" // Always gray since this is always fallback data
            )}>
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <div className="text-left">
                <div className="text-xs font-medium text-muted-foreground">
                  {language === 'ko' ? '컨베이어 속도' : 'Conveyor Speed'}
                </div>
                <div className="text-xs text-muted-foreground">
                  2.4 m/s
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-muted/50">
                {language === 'ko' ? '정상' : 'Normal'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDetail} onOpenChange={() => setSelectedDetail(null)}>
        {renderDetailDialog()}
      </Dialog>
    </>
  );
};