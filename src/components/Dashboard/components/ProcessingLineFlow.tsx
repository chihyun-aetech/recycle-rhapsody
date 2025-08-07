import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, ArrowRight, Settings, Package } from 'lucide-react';
import { useDashboard } from '../DashboardLayout';
import { cn } from '@/lib/utils';

interface ProcessingStage {
  id: string;
  name: string;
  nameKo: string;
  icon: React.ReactNode;
  status: 'successful' | 'watch' | 'danger' | 'inactive';
}

interface ProcessingLine {
  id: number;
  name: string;
  nameKo: string;
  isActive: boolean;
  stages: ProcessingStage[];
}

const processingLines: ProcessingLine[] = [
  {
    id: 1,
    name: 'Line 1',
    nameKo: 'Line 1',
    isActive: true,
    stages: [
      { id: 'input', name: 'Input', nameKo: 'Input', icon: <Package className="w-6 h-6" />, status: 'successful' },
      { id: 'camera', name: 'Camera (Vision Box)', nameKo: 'Camera (Vision Box)', icon: <Camera className="w-6 h-6" />, status: 'successful' },
      { id: 'atron', name: 'Atron (H/W)', nameKo: 'Atron (H/W)', icon: <Settings className="w-6 h-6" />, status: 'watch' },
      { id: 'output', name: 'Output', nameKo: 'Output', icon: <Package className="w-6 h-6" />, status: 'successful' },
    ]
  },
  {
    id: 2,
    name: 'Line 2',
    nameKo: 'Line 2',
    isActive: true,
    stages: [
      { id: 'input', name: 'Input', nameKo: 'Input', icon: <Package className="w-6 h-6" />, status: 'successful' },
      { id: 'camera', name: 'Camera (Vision Box)', nameKo: 'Camera (Vision Box)', icon: <Camera className="w-6 h-6" />, status: 'successful' },
      { id: 'atron', name: 'Atron (H/W)', nameKo: 'Atron (H/W)', icon: <Settings className="w-6 h-6" />, status: 'successful' },
      { id: 'output', name: 'Output', nameKo: 'Output', icon: <Package className="w-6 h-6" />, status: 'successful' },
    ]
  },
  {
    id: 3,
    name: 'Line 3',
    nameKo: 'Line 3',
    isActive: false,
    stages: [
      { id: 'input', name: 'Input', nameKo: 'Input', icon: <Package className="w-6 h-6" />, status: 'inactive' },
      { id: 'camera', name: 'Camera (Vision Box)', nameKo: 'Camera (Vision Box)', icon: <Camera className="w-6 h-6" />, status: 'inactive' },
      { id: 'atron', name: 'Atron (H/W)', nameKo: 'Atron (H/W)', icon: <Settings className="w-6 h-6" />, status: 'inactive' },
      { id: 'output', name: 'Output', nameKo: 'Output', icon: <Package className="w-6 h-6" />, status: 'inactive' },
    ]
  },
  {
    id: 4,
    name: 'Line 4',
    nameKo: 'Line 4',
    isActive: true,
    stages: [
      { id: 'input', name: 'Input', nameKo: 'Input', icon: <Package className="w-6 h-6" />, status: 'successful' },
      { id: 'camera', name: 'Camera (Vision Box)', nameKo: 'Camera (Vision Box)', icon: <Camera className="w-6 h-6" />, status: 'danger' },
      { id: 'atron', name: 'Atron (H/W)', nameKo: 'Atron (H/W)', icon: <Settings className="w-6 h-6" />, status: 'danger' },
      { id: 'output', name: 'Output', nameKo: 'Output', icon: <Package className="w-6 h-6" />, status: 'inactive' },
    ]
  },
];

const getStatusColor = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'successful': return 'default';
    case 'watch': return 'secondary';
    case 'danger': return 'destructive';
    case 'inactive': return 'outline';
    default: return 'outline';
  }
};

const getStatusBgColor = (status: string): string => {
  switch (status) {
    case 'successful': return 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800';
    case 'watch': return 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'danger': return 'bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    case 'inactive': return 'bg-gray-100 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    default: return 'bg-gray-100 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
  }
};

export const ProcessingLineFlow: React.FC = () => {
  const { language } = useDashboard();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'ko' ? 'Site1 현황' : 'Site1 Status'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-6">
            {processingLines.map((line) => (
              <div key={line.id} className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {language === 'ko' ? line.nameKo : line.name}
                  </h3>
                  <Badge variant={line.isActive ? 'default' : 'outline'}>
                    {line.isActive 
                      ? (language === 'ko' ? '활성' : 'Active')
                      : (language === 'ko' ? '비활성' : 'Inactive')
                    }
                  </Badge>
                </div>
                
                {/* Processing Flow */}
                <div className="flex items-center justify-between space-x-4">
                  {line.stages.map((stage, index) => (
                    <React.Fragment key={stage.id}>
                      {/* Stage */}
                      <div className="flex flex-col items-center space-y-2 flex-1">
                        <div className={cn(
                          "w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-colors",
                          getStatusBgColor(stage.status)
                        )}>
                          <div className={cn(
                            "text-foreground",
                            stage.status === 'inactive' && "text-muted-foreground opacity-50"
                          )}>
                            {stage.icon}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">
                            {language === 'ko' ? stage.nameKo : stage.name}
                          </div>
                          <Badge 
                            variant={getStatusColor(stage.status)}
                            className="text-xs mt-1"
                          >
                            {stage.status === 'successful' && (language === 'ko' ? '정상' : 'OK')}
                            {stage.status === 'watch' && (language === 'ko' ? '주의' : 'Watch')}
                            {stage.status === 'danger' && (language === 'ko' ? '위험' : 'Danger')}
                            {stage.status === 'inactive' && (language === 'ko' ? '비활성' : 'Inactive')}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      {index < line.stages.length - 1 && (
                        <ArrowRight className={cn(
                          "w-6 h-6 text-muted-foreground transition-colors",
                          line.isActive ? "text-primary" : "text-muted-foreground opacity-50"
                        )} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};