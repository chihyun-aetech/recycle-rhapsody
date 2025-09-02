import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui';
import { useDashboard } from '../DashboardLayout';
import { cn } from '@/shared/lib/utils';
import { useAtom } from 'jotai';
import { languageAtom } from '@/shared/store/dashboardStore';


interface SystemLogsProps {
  objectLogsData?: any;
  alertsData?: any;
  machineHealthData?: any;
  hasRealData: {
    objectLogs: boolean;
    alerts: boolean;
    machineHealth: boolean;
    [key: string]: boolean;
  };
  selectedSite: string;
}

export const SystemLogs: React.FC<SystemLogsProps> = ({ 
  objectLogsData, 
  alertsData,
  machineHealthData,
  hasRealData,
  selectedSite
}) => {
  const [language] = useAtom(languageAtom);
  const [focusedLogId, setFocusedLogId] = React.useState<string | null>(null);

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
                <TableHead>{language === 'ko' ? '속도' : 'Speed'} (m/s)</TableHead>
                <TableHead>{language === 'ko' ? '심각도' : 'Severity'}</TableHead>
                <TableHead>{language === 'ko' ? '유형' : 'Type'}</TableHead>
                <TableHead>{language === 'ko' ? '상세' : 'Details'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Show fallback data when no real server data */}
              {(!hasRealData.objectLogs && !hasRealData.alerts && !hasRealData.machineHealth) ? (
                // Mock data when server data is not available
                [
                  {
                    id: 'log-001',
                    timestamp: new Date().toISOString(),
                    station_id: `${selectedSite}1`,
                    cpu_temp: 68,
                    gpu_temp: 72,
                    camera_temp: 42,
                    conveyor_speed: 2.4,
                    severity: 'info' as const,
                    type: 'object_processed',
                    details: 'Pet bottle processed successfully (Area: 25000px, Depth: 75mm)'
                  },
                  {
                    id: 'log-002',
                    timestamp: new Date(Date.now() - 300000).toISOString(),
                    station_id: `${selectedSite}2`,
                    cpu_temp: 72,
                    gpu_temp: 78,
                    camera_temp: 45,
                    conveyor_speed: 2.2,
                    severity: 'warning' as const,
                    type: 'high_temperature',
                    details: 'GPU temperature approaching threshold (78°C)'
                  },
                  {
                    id: 'log-003',
                    timestamp: new Date(Date.now() - 600000).toISOString(),
                    station_id: `${selectedSite}3`,
                    cpu_temp: 75,
                    gpu_temp: 82,
                    camera_temp: 48,
                    conveyor_speed: 2.1,
                    severity: 'critical' as const,
                    type: 'overheat_gpu',
                    details: 'GPU temperature exceeded threshold (82°C) - automatic shutdown initiated'
                  },
                  {
                    id: 'log-004',
                    timestamp: new Date(Date.now() - 900000).toISOString(),
                    station_id: `${selectedSite}1`,
                    cpu_temp: 65,
                    gpu_temp: 70,
                    camera_temp: 40,
                    conveyor_speed: 2.5,
                    severity: 'info' as const,
                    type: 'system_check',
                    details: 'Routine system health check completed successfully'
                  },
                  {
                    id: 'log-005',
                    timestamp: new Date(Date.now() - 1200000).toISOString(),
                    station_id: `${selectedSite}2`,
                    cpu_temp: 69,
                    gpu_temp: 73,
                    camera_temp: 43,
                    conveyor_speed: 2.3,
                    severity: 'info' as const,
                    type: 'object_processed',
                    details: 'Plastic container processed (Area: 18000px, Depth: 45mm)'
                  }
                ].map((log) => (
                  <TableRow
                    key={log.id}
                    id={`log-row-${log.id}`}
                    className={cn(
                      'transition-all duration-500 bg-muted/20',
                      focusedLogId === log.id && 'bg-primary/10 border-l-4 border-l-primary shadow-md'
                    )}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-muted-foreground">{log.station_id}</TableCell>
                    <TableCell className="text-muted-foreground">-</TableCell>
                    <TableCell className={cn(
                      "text-muted-foreground",
                      log.cpu_temp > 70 ? 'text-red-600 font-medium' : ''
                    )}>{log.cpu_temp}</TableCell>
                    <TableCell className={cn(
                      "text-muted-foreground",
                      log.gpu_temp > 75 ? 'text-red-600 font-medium' : ''
                    )}>{log.gpu_temp}</TableCell>
                    <TableCell className={cn(
                      "text-muted-foreground",
                      log.camera_temp > 45 ? 'text-red-600 font-medium' : ''
                    )}>{log.camera_temp}</TableCell>
                    <TableCell className="text-muted-foreground">{log.conveyor_speed}</TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.type}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground" title={log.details}>
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Real server data available - normal styling
                <>
                  {/* Object Logs - Real Data */}
                  {hasRealData.objectLogs && objectLogsData?.results?.slice(0, 5).map((log) => (
                    <TableRow
                      key={log.id || log.timestamp}
                      id={`log-row-${log.id || log.timestamp}`}
                      className={cn(
                        'transition-all duration-500',
                        focusedLogId === log.id && 'bg-primary/10 border-l-4 border-l-primary shadow-md'
                      )}
                    >
                      <TableCell className="font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{log.station_id}</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell>{getSeverityBadge('info')}</TableCell>
                      <TableCell className="font-mono text-xs">object_processed</TableCell>
                      <TableCell className="max-w-xs truncate" title={`${log.major_category} processed (Area: ${log.area}px, Depth: ${log.depth}mm)`}>
                        {log.major_category} processed (Area: {log.area}px, Depth: {log.depth}mm)
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Alerts - Real Data */}
                  {hasRealData.alerts && alertsData?.results?.slice(0, 10).map((alert) => {
                    const severity = alert.severity === 'critical' ? 'critical' : alert.severity === 'warning' ? 'warning' : 'info';
                    return (
                      <TableRow
                        key={alert.id || alert.timestamp}
                        id={`log-row-${alert.id || alert.timestamp}`}
                        className={cn(
                          'transition-all duration-500',
                          focusedLogId === alert.id && 'bg-primary/10 border-l-4 border-l-primary shadow-md'
                        )}
                      >
                        <TableCell className="font-mono text-xs">{new Date(alert.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{alert.station_id}</TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell>{getSeverityBadge(severity)}</TableCell>
                        <TableCell className="font-mono text-xs">{alert.alert_type}</TableCell>
                        <TableCell className="max-w-xs truncate" title={alert.message}>
                          {alert.message}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {/* Machine Health - Real Data */}
                  {hasRealData.machineHealth && machineHealthData?.results?.slice(0, 5).map((machine) => {
                    // Determine severity based on temperature thresholds
                    const cpuTemp = machine.cpu_temperature || 0;
                    const gpuTemp = machine.gpu_temperature || 0;
                    const cameraTemp = machine.camera_temperature || 0;
                    
                    let severity = 'info';
                    let alertType = 'health_check';
                    let message = 'System health normal';
                    
                    if (cpuTemp > 80 || gpuTemp > 85) {
                      severity = 'critical';
                      alertType = 'overheat';
                      message = `Critical temperature: CPU ${cpuTemp}°C, GPU ${gpuTemp}°C`;
                    } else if (cpuTemp > 70 || gpuTemp > 75) {
                      severity = 'warning';
                      alertType = 'high_temperature';
                      message = `High temperature: CPU ${cpuTemp}°C, GPU ${gpuTemp}°C`;
                    }
                    
                    return (
                      <TableRow
                        key={`machine-${machine.station_id}-${machine.timestamp}`}
                        id={`log-row-machine-${machine.station_id}-${machine.timestamp}`}
                        className={cn(
                          'transition-all duration-500',
                          focusedLogId === `machine-${machine.station_id}` && 'bg-primary/10 border-l-4 border-l-primary shadow-md'
                        )}
                      >
                        <TableCell className="font-mono text-xs">{new Date(machine.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{machine.station_id}</TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell className={cn(
                          cpuTemp > 70 ? 'text-red-600 font-medium' : 'text-foreground'
                        )}>{cpuTemp}</TableCell>
                        <TableCell className={cn(
                          gpuTemp > 75 ? 'text-red-600 font-medium' : 'text-foreground'
                        )}>{gpuTemp}</TableCell>
                        <TableCell className={cn(
                          cameraTemp > 45 ? 'text-red-600 font-medium' : 'text-foreground'
                        )}>{cameraTemp || '-'}</TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                        <TableCell>{getSeverityBadge(severity)}</TableCell>
                        <TableCell className="font-mono text-xs">{alertType}</TableCell>
                        <TableCell className="max-w-xs truncate" title={message}>
                          {message}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};