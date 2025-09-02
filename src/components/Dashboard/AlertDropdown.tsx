import React from 'react';
import { Bell, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Button,
  Badge
} from '@/shared/ui';
import { useAtom } from 'jotai';
import { languageAtom } from '@/shared/store/dashboardStore';

const alertData = [
  {
    id: 1,
    type: 'critical',
    message: '라인 3 온도 임계값 초과',
    timestamp: '2024-01-31 14:30:25',
    severity: 'critical'
  },
  {
    id: 2,
    type: 'warning',
    message: '라인 1 처리량 감소',
    timestamp: '2024-01-31 14:25:10',
    severity: 'warning'
  },
  {
    id: 3,
    type: 'info',
    message: '시스템 점검 완료',
    timestamp: '2024-01-31 14:20:00',
    severity: 'info'
  },
];

export const AlertDropdown: React.FC = () => {
  const [language] = useAtom(languageAtom);
  
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="relative w-9 h-9">
          <Bell className="w-4 h-4" />
          {alertData.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {alertData.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" sideOffset={12} alignOffset={-10}>
        <div className="px-3 py-2 border-b">
          <h3 className="font-semibold">
            {language === 'ko' ? '알림' : 'Alerts'}
          </h3>
        </div>
        {alertData.map((alert, index) => (
          <div key={alert.id}>
            <DropdownMenuItem className="p-3 cursor-pointer">
              <div className="flex items-start space-x-3 w-full">
                {getAlertIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp}
                  </p>
                </div>
                <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                  {alert.severity}
                </Badge>
              </div>
            </DropdownMenuItem>
            {index < alertData.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-3 text-center">
          <span className="text-sm text-muted-foreground w-full">
            {language === 'ko' ? '모든 알림 보기' : 'View all alerts'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};