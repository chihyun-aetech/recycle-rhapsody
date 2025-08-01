import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboard2 } from '../DashboardLayout2';
import { Cpu, HardDrive, MemoryStick, Camera, Activity, Gauge } from 'lucide-react';

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

export const HardwareMonitoring: React.FC = () => {
  const { language } = useDashboard2();

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

  return (
    <div className="space-y-6">
      {/* Computers Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {language === 'ko' ? '컴퓨터 시스템' : 'Computer Systems'}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hardwareData.computers.map((computer) => (
            <Card key={computer.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5" />
                  <span>{computer.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {/* CPU */}
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={computer.cpu.usage} size={80} />
                    <div className="text-center">
                      <div className="text-sm font-medium">CPU</div>
                      <div className="text-xs text-muted-foreground">{computer.cpu.temp}°C</div>
                    </div>
                  </div>
                  
                  {/* GPU */}
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={computer.gpu.usage} size={80} />
                    <div className="text-center">
                      <div className="text-sm font-medium">GPU</div>
                      <div className="text-xs text-muted-foreground">{computer.gpu.temp}°C</div>
                    </div>
                  </div>
                  
                  {/* RAM */}
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={computer.ram.usage} size={80} />
                    <div className="text-center">
                      <div className="text-sm font-medium">RAM</div>
                      <div className="text-xs text-muted-foreground">Memory</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sensors & Conveyor Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sensors */}
        {hardwareData.sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <Card key={sensor.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{sensor.name}</span>
                  </div>
                  <Badge variant={getStatusColor(sensor.status) as any}>
                    {sensor.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {sensor.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {sensor.unit}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Conveyor Speed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4" />
                <span className="text-sm">
                  {language === 'ko' ? '컨베이어 속도' : 'Conveyor Speed'}
                </span>
              </div>
              <Badge variant={getStatusColor(hardwareData.conveyor.status) as any}>
                {hardwareData.conveyor.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {hardwareData.conveyor.speed}
              </div>
              <div className="text-sm text-muted-foreground">
                {hardwareData.conveyor.unit}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};