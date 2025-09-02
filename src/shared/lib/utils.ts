import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IpAccess } from "@/entities/ip-access/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateIpAddress(ipAddress: string): boolean {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ipAddress)) return false;
  
  // Validate each octet is between 0 and 255
  const octets = ipAddress.split('.');
  return octets.every(octet => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

// IP Access utility functions
export function calculateLocationStats(logs: IpAccess[]) {
  return logs.reduce((acc, log) => {
    if (log.location) {
      acc[log.location] = (acc[log.location] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
}

export function calculateDeviceStats(logs: IpAccess[]) {
  return logs.reduce((acc, log) => {
    if (log.device) {
      acc[log.device] = (acc[log.device] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
}

export function getTopItems<T extends { count: number }>(items: T[], limit: number): T[] {
  return items.sort((a, b) => b.count - a.count).slice(0, limit);
}

export function checkLocationSuspicion(logs: IpAccess[], ipAddress?: string): { suspicious: boolean; reason?: string } {
  if (!ipAddress) return { suspicious: false };
  
  const locations = new Set(logs.map(log => log.location).filter(Boolean));
  if (locations.size > 3) {
    return {
      suspicious: true,
      reason: `Multiple locations (${locations.size}) from same IP`,
    };
  }
  
  return { suspicious: false };
}

export function checkRapidAccessSuspicion(logs: IpAccess[]): { suspicious: boolean; reason?: string } {
  const recentLogs = logs.slice(0, 5);
  if (recentLogs.length >= 5) {
    const timeRange = new Date(recentLogs[0].last_accessed_at || recentLogs[0].created_at).getTime() - 
                     new Date(recentLogs[4].last_accessed_at || recentLogs[4].created_at).getTime();
    if (timeRange < 60000) { // Less than 1 minute
      return {
        suspicious: true,
        reason: 'Rapid access attempts within short time frame',
      };
    }
  }
  
  return { suspicious: false };
}