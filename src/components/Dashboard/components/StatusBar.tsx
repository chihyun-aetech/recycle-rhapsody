import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cpu, Camera, Activity, Gauge, HardDrive, MemoryStick } from 'lucide-react';
import { useDashboard } from '../DashboardLayout';

const hardwareData = {
  computers: [
    {
      id: 'pc-001',
      name: 'Production PC 1',
      cpu: { usage: 52.75, temp: 68 },
      gpu: { usage: 71, temp: 72 },
      ram: { usage: 64.2 },
    },
    {
      id: 'pc-002', 
      name: 'Production PC 2',
      cpu: { usage: 48.3, temp: 65 },
      gpu: { usage: 83, temp: 76 },
      ram: { usage: 58.7 },
    },
  ],
  sensors: [
    {
      id: 'cam-001',
      name: 'Camera Temperature',
      value: 42,
      unit: '°C',
      status: 'Good',
      icon: Camera,
    },
    {
      id: 'imu-001', 
      name: 'IMU Vibration',
      value: 0.8,
      unit: 'g',
      status: 'Normal',
      icon: Activity,
    },
  ],
  conveyor: {
    speed: 2.4,
    unit: 'm/s',
    status: 'Normal',
  },
};

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

export const StatusBar: React.FC = () => {
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
    if (!selectedDetail) return null;

    if (selectedDetail.startsWith('pc-')) {
      const computer = hardwareData.computers.find(pc => pc.id === selectedDetail);
      if (!computer) return null;

      return (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Cpu className="w-5 h-5" />
              <span>{computer.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-6 p-6">
            <div className="flex flex-col items-center space-y-2">
              <CircularProgress value={computer.cpu.usage} size={100} />
              <div className="text-center">
                <div className="text-sm font-medium">CPU</div>
                <div className="text-xs text-muted-foreground">{computer.cpu.temp}°C</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <CircularProgress value={computer.gpu.usage} size={100} />
              <div className="text-center">
                <div className="text-sm font-medium">GPU</div>
                <div className="text-xs text-muted-foreground">{computer.gpu.temp}°C</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <CircularProgress value={computer.ram.usage} size={100} />
              <div className="text-center">
                <div className="text-sm font-medium">RAM</div>
                <div className="text-xs text-muted-foreground">Memory</div>
              </div>
            </div>
          </div>
        </DialogContent>
      );
    }

    if (selectedDetail === 'vision-box') {
      const sensorData = [
        { 
          name: 'Camera Temperature', 
          value: '42°C', 
          status: 'normal',
          icon: Camera,
          nameKo: '카메라 온도'
        },
        { 
          name: 'IMU Vibration', 
          value: '0.2G', 
          status: 'normal',
          icon: Activity,
          nameKo: 'IMU 진동'
        },
        { 
          name: 'CPU Usage', 
          value: '68%', 
          status: 'normal',
          icon: Cpu,
          nameKo: 'CPU 사용률'
        },
        { 
          name: 'GPU Temperature', 
          value: '71°C', 
          status: 'warning',
          icon: Camera,
          nameKo: 'GPU 온도'
        }
      ];

      return (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>{language === 'ko' ? '비전 박스 상세' : 'Vision Box Details'}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 p-6">
            {sensorData.map((sensor, index) => {
              const Icon = sensor.icon;
              return (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <Badge variant={getStatusColor(sensor.status) as any}>
                      {sensor.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ko' ? sensor.nameKo : sensor.name}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {sensor.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      );
    }

    return null;
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Production PCs */}
            {hardwareData.computers.map((computer) => (
              <Button
                key={computer.id}
                variant="ghost"
                className="flex items-center space-x-2 h-auto p-2"
                onClick={() => setSelectedDetail(computer.id)}
              >
                <Cpu className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs font-medium">{computer.name}</div>
                  <div className="text-xs text-muted-foreground">
                    CPU: {computer.cpu.usage}% GPU: {computer.gpu.usage}%
                  </div>
                </div>
              </Button>
            ))}

            {/* Sensors */}
            {hardwareData.sensors.map((sensor) => {
              const Icon = sensor.icon;
              return (
                <div key={sensor.id} className="flex items-center space-x-2 px-2">
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs font-medium">{sensor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {sensor.value} {sensor.unit}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(sensor.status) as any} className="text-xs">
                    {sensor.status}
                  </Badge>
                </div>
              );
            })}

            {/* Conveyor Speed */}
            <div className="flex items-center space-x-2 px-2">
              <Gauge className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs font-medium">
                  {language === 'ko' ? '컨베이어 속도' : 'Conveyor Speed'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {hardwareData.conveyor.speed} {hardwareData.conveyor.unit}
                </div>
              </div>
              <Badge variant={getStatusColor(hardwareData.conveyor.status) as any} className="text-xs">
                {hardwareData.conveyor.status}
              </Badge>
            </div>

            {/* Vision Box */}
            <Button
              variant="ghost"
              className="flex items-center space-x-2 h-auto p-2"
              onClick={() => setSelectedDetail('vision-box')}
            >
              <Camera className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs font-medium">
                  {language === 'ko' ? '비전 박스' : 'Vision Box'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'ko' ? '상세 보기' : 'View Details'}
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDetail} onOpenChange={() => setSelectedDetail(null)}>
        {renderDetailDialog()}
      </Dialog>
    </>
  );
};