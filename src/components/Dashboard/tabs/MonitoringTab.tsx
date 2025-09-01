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
  
  // Fetch monitoring data for each station ID
  const stationQueries = stationIds.map(stationId => ({
    objectLogs: useObjectLogs({ station_id: stationId }),
    systemHealth: useSystemHealth({ station_id: stationId }),
    alerts: useAlerts({ station_id: stationId }),
    operationState: useOperationState({ station_id: stationId }),
    machineHealth: useMachineHealth({ station_id: stationId })
  }));

  // Combine data from all stations
  const objectLogsData = stationQueries[0]?.objectLogs.data ? {
    ...stationQueries[0].objectLogs.data,
    data: stationQueries.flatMap(q => q.objectLogs.data?.data || [])
  } : undefined;
  const systemHealthData = stationQueries[0]?.systemHealth.data ? {
    ...stationQueries[0].systemHealth.data,
    data: stationQueries.flatMap(q => q.systemHealth.data?.data || [])
  } : undefined;
  const alertsData = stationQueries[0]?.alerts.data ? {
    ...stationQueries[0].alerts.data,
    data: stationQueries.flatMap(q => q.alerts.data?.data || [])
  } : undefined;
  const operationStateData = stationQueries[0]?.operationState.data ? {
    ...stationQueries[0].operationState.data,
    data: stationQueries.flatMap(q => q.operationState.data?.data || [])
  } : undefined;
  const machineHealthData = stationQueries[0]?.machineHealth.data ? {
    ...stationQueries[0].machineHealth.data,
    data: stationQueries.flatMap(q => q.machineHealth.data?.data || [])
  } : undefined;

  // Check if any query is loading
  const isLoading = stationQueries.some(q => 
    q.objectLogs.isLoading || 
    q.systemHealth.isLoading || 
    q.alerts.isLoading || 
    q.operationState.isLoading || 
    q.machineHealth.isLoading
  );
  
  // Filter data by selected site
  const filteredObjectLogsData = objectLogsData ? {
    ...objectLogsData,
    data: objectLogsData.data?.filter(log => 
      extractSiteFromStationId(log.station_id) === selectedSite
    ) || []
  } : undefined;
  
  const filteredSystemHealthData = systemHealthData ? {
    ...systemHealthData,
    data: systemHealthData.data?.filter(system => 
      extractSiteFromStationId(system.station_id) === selectedSite
    ) || []
  } : undefined;
  
  const filteredAlertsData = alertsData ? {
    ...alertsData,
    data: alertsData.data?.filter(alert => 
      extractSiteFromStationId(alert.station_id) === selectedSite
    ) || []
  } : undefined;
  
  const filteredOperationStateData = operationStateData ? {
    ...operationStateData,
    data: operationStateData.data?.filter(operation => 
      extractSiteFromStationId(operation.station_id) === selectedSite
    ) || []
  } : undefined;
  
  const filteredMachineHealthData = machineHealthData ? {
    ...machineHealthData,
    data: machineHealthData.data?.filter(machine => 
      extractSiteFromStationId(machine.station_id) === selectedSite
    ) || []
  } : undefined;

  // Determine if we have real server data or need to show fallback data (based on filtered data)
  const hasRealData = {
    objectLogs: !!(filteredObjectLogsData?.data?.length),
    systemHealth: !!(filteredSystemHealthData?.data?.length),
    alerts: !!(filteredAlertsData?.data?.length),
    operationState: !!(filteredOperationStateData?.data?.length),
    machineHealth: !!(filteredMachineHealthData?.data?.length)
  };



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