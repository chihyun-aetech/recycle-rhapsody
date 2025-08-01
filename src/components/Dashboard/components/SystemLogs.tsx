import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDashboard2 } from '../DashboardLayout2';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  robot_id: string;
  line_id: number;
  cpu_temp: number;
  gpu_temp: number;
  camera_temp: number;
  imu_vibration: number;
  conveyor_speed: number;
  severity: 'info' | 'warning' | 'critical';
  type: string;
  details: string;
}

const logsData: LogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2024-01-31 14:30:25',
    robot_id: 'RBT-001',
    line_id: 3,
    cpu_temp: 75,
    gpu_temp: 82,
    camera_temp: 45,
    imu_vibration: 1.2,
    conveyor_speed: 2.4,
    severity: 'critical',
    type: 'overheat_gpu',
    details: 'GPU temperature exceeded threshold (80°C)',
  },
  {
    id: 'log-002',
    timestamp: '2024-01-31 14:25:10',
    robot_id: 'RBT-002',
    line_id: 1,
    cpu_temp: 68,
    gpu_temp: 72,
    camera_temp: 42,
    imu_vibration: 0.8,
    conveyor_speed: 2.2,
    severity: 'warning',
    type: 'picking_failure_rate_increase',
    details: 'Picking success rate dropped to 92%',
  },
  {
    id: 'log-003',
    timestamp: '2024-01-31 14:20:00',
    robot_id: 'RBT-003',
    line_id: 2,
    cpu_temp: 65,
    gpu_temp: 70,
    camera_temp: 40,
    imu_vibration: 0.6,
    conveyor_speed: 2.5,
    severity: 'info',
    type: 'system_check_complete',
    details: 'Routine system check completed successfully',
  },
  {
    id: 'log-004',
    timestamp: '2024-01-31 14:15:30',
    robot_id: 'RBT-001',
    line_id: 3,
    cpu_temp: 72,
    gpu_temp: 76,
    camera_temp: 43,
    imu_vibration: 0.9,
    conveyor_speed: 2.3,
    severity: 'warning',
    type: 'sensor_error',
    details: 'Camera sensor calibration drift detected',
  },
  {
    id: 'log-005',
    timestamp: '2024-01-31 14:10:15',
    robot_id: 'RBT-004',
    line_id: 4,
    cpu_temp: 66,
    gpu_temp: 71,
    camera_temp: 41,
    imu_vibration: 0.7,
    conveyor_speed: 2.6,
    severity: 'info',
    type: 'maintenance_complete',
    details: 'Scheduled maintenance completed on Line 4',
  },
];

export const SystemLogs: React.FC = () => {
  const { language, focusedLogId, setFocusedLogId } = useDashboard2();

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Focus on a specific log when focusedLogId changes
  useEffect(() => {
    if (focusedLogId) {
      const element = document.getElementById(`log-row-${focusedLogId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Clear focus after a delay
        setTimeout(() => setFocusedLogId(null), 3000);
      }
    }
  }, [focusedLogId, setFocusedLogId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'ko' ? '시스템 로그' : 'System Logs'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'ko' ? '시간' : 'Timestamp'}</TableHead>
                <TableHead>{language === 'ko' ? '로봇 ID' : 'Robot ID'}</TableHead>
                <TableHead>{language === 'ko' ? '라인' : 'Line'}</TableHead>
                <TableHead>CPU (°C)</TableHead>
                <TableHead>GPU (°C)</TableHead>
                <TableHead>{language === 'ko' ? '카메라' : 'Camera'} (°C)</TableHead>
                <TableHead>{language === 'ko' ? '진동' : 'Vibration'} (g)</TableHead>
                <TableHead>{language === 'ko' ? '속도' : 'Speed'} (m/s)</TableHead>
                <TableHead>{language === 'ko' ? '심각도' : 'Severity'}</TableHead>
                <TableHead>{language === 'ko' ? '유형' : 'Type'}</TableHead>
                <TableHead>{language === 'ko' ? '상세' : 'Details'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsData.map((log) => (
                <TableRow
                  key={log.id}
                  id={`log-row-${log.id}`}
                  className={cn(
                    'transition-all duration-500',
                    focusedLogId === log.id && 'bg-primary/10 border-l-4 border-l-primary shadow-md'
                  )}
                >
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell className="font-medium">{log.robot_id}</TableCell>
                  <TableCell>{log.line_id}</TableCell>
                  <TableCell className={log.cpu_temp > 70 ? 'text-red-600 font-medium' : ''}>{log.cpu_temp}</TableCell>
                  <TableCell className={log.gpu_temp > 75 ? 'text-red-600 font-medium' : ''}>{log.gpu_temp}</TableCell>
                  <TableCell className={log.camera_temp > 45 ? 'text-red-600 font-medium' : ''}>{log.camera_temp}</TableCell>
                  <TableCell className={log.imu_vibration > 1.0 ? 'text-red-600 font-medium' : ''}>{log.imu_vibration}</TableCell>
                  <TableCell>{log.conveyor_speed}</TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  <TableCell className="font-mono text-xs">{log.type}</TableCell>
                  <TableCell className="max-w-xs truncate" title={log.details}>
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};