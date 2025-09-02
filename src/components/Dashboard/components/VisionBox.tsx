import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/shared/ui';
import { Camera, Cpu, Thermometer, Activity } from 'lucide-react';
import { useAtom } from 'jotai';
import { languageAtom } from '@/shared/store/dashboardStore';

const sensorData = [
  { 
    name: 'Camera Temperature', 
    value: '42°C', 
    status: 'normal',
    icon: Thermometer,
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
    icon: Thermometer,
    nameKo: 'GPU 온도'
  }
];

export const VisionBox: React.FC = () => {
  const [language] = useAtom(languageAtom);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>{language === 'ko' ? '비전 박스 상세' : 'Vision Box Details'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </CardContent>
    </Card>
  );
};