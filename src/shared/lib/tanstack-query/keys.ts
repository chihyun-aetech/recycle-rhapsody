export const QUERY_KEYS = {
  MONITORING: {
    OBJECT_LOGS: ['monitoring', 'object-logs'],
    SYSTEM_HEALTH: ['monitoring', 'system-health'],
    ALERTS: ['monitoring', 'alerts'],
    OPERATION_STATE: ['monitoring', 'operation-state'],
    MACHINE_HEALTH: ['monitoring', 'machine-health'],
  },
  SYSTEM: {
    ROOT: ['system', 'root'],
    HEALTH: ['system', 'health'],
  },
} as const;