import React from 'react';
import { useDashboard } from '../DashboardLayout';
import { StatusBar } from '../components/StatusBar';
import { ProcessingLineFlow } from '../components/ProcessingLineFlow';
import { SystemLogs } from '../components/SystemLogs';
import { 
  useObjectLogs, 
  useSystemHealth, 
  useAlerts, 
  useOperationState, 
  useMachineHealth 
} from '@/entities/monitoring/queries';

export const MonitoringTab: React.FC = () => {
  const { language, selectedSite } = useDashboard();
  
  // Helper function to extract site from station_id
  const extractSiteFromStationId = (stationId: string): string => {
    // Remove last digit(s) from station_id: "R&T1" -> "R&T", "SUNGNAM2" -> "SUNGNAM"
    return stationId.replace(/\d+$/, '');
  };
  
  // Generate station IDs for selected site (e.g., R&T1, R&T2, R&T3)
  const stationIds = [`${selectedSite}1`, `${selectedSite}2`, `${selectedSite}3`];
  
  // Fetch all monitoring data with specific station_ids
  const { data: objectLogsData, isLoading: objectLogsLoading } = useObjectLogs({ station_ids: stationIds });
  const { data: systemHealthData, isLoading: systemHealthLoading } = useSystemHealth({ station_ids: stationIds });
  const { data: alertsData, isLoading: alertsLoading } = useAlerts({ station_ids: stationIds });
  const { data: operationStateData, isLoading: operationStateLoading } = useOperationState({ station_ids: stationIds });
  const { data: machineHealthData, isLoading: machineHealthLoading } = useMachineHealth({ station_ids: stationIds });
  
  // Filter data by selected site
  const filteredObjectLogsData = objectLogsData ? {
    ...objectLogsData,
    results: objectLogsData.results?.filter(log => 
      extractSiteFromStationId(log.station_id) === selectedSite
    ) || []
  } : undefined;
  
  const filteredSystemHealthData = systemHealthData ? {
    ...systemHealthData,
    results: systemHealthData.results?.filter(system => 
      extractSiteFromStationId(system.station_id) === selectedSite
    ) || []
  } : undefined;
  
  const filteredAlertsData = alertsData ? {
    ...alertsData,
    results: alertsData.results?.filter(alert => 
      extractSiteFromStationId(alert.station_id) === selectedSite
    ) || []
  } : undefined;
  
  const filteredOperationStateData = operationStateData ? {
    ...operationStateData,
    results: operationStateData.results?.filter(operation => 
      extractSiteFromStationId(operation.station_id) === selectedSite
    ) || []
  } : undefined;
  
  const filteredMachineHealthData = machineHealthData ? {
    ...machineHealthData,
    results: machineHealthData.results?.filter(machine => 
      extractSiteFromStationId(machine.station_id) === selectedSite
    ) || []
  } : undefined;

  // Determine if we have real server data or need to show fallback data (based on filtered data)
  const hasRealData = {
    objectLogs: !!(filteredObjectLogsData?.results?.length),
    systemHealth: !!(filteredSystemHealthData?.results?.length),
    alerts: !!(filteredAlertsData?.results?.length),
    operationState: !!(filteredOperationStateData?.results?.length),
    machineHealth: !!(filteredMachineHealthData?.results?.length)
  };

  const isLoading = objectLogsLoading || systemHealthLoading || alertsLoading || operationStateLoading || machineHealthLoading;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '모니터링' : 'Monitoring'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '실시간 하드웨어 모니터링' : 'Real-time Hardware Monitoring'}
          {isLoading && <span className="ml-2">Loading...</span>}
        </div>
      </div>

      {/* Status Bar - Pass filtered server data and hasRealData flags */}
      <StatusBar 
        systemHealthData={filteredSystemHealthData}
        machineHealthData={filteredMachineHealthData}
        hasRealData={hasRealData}
        selectedSite={selectedSite}
      />

      {/* Processing Line Flow - Pass filtered server data and hasRealData flags */}
      <ProcessingLineFlow 
        objectLogsData={filteredObjectLogsData}
        operationStateData={filteredOperationStateData}
        alertsData={filteredAlertsData}
        machineHealthData={filteredMachineHealthData}
        hasRealData={hasRealData}
        selectedSite={selectedSite}
      />

      {/* System Logs - Pass filtered server data and hasRealData flags */}
      <SystemLogs 
        objectLogsData={filteredObjectLogsData}
        alertsData={filteredAlertsData}
        machineHealthData={filteredMachineHealthData}
        hasRealData={hasRealData}
        selectedSite={selectedSite}
      />
    </div>
  );
};