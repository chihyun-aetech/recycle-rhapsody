import React from 'react';
import { useDashboard2 } from '../DashboardLayout2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Zap, AlertTriangle, CheckCircle, DollarSign, BarChart3, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const metricsData = [
  {
    id: 'revenue',
    title: { ko: '총 수입', en: 'Total Revenue' },
    value: '₩1,247M',
    unit: '',
    change: '+15.2%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    id: 'processing',
    title: { ko: '총 처리량', en: 'Total Processing' },
    value: '12,847',
    unit: { ko: '개', en: 'items' },
    change: '+12.5%',
    trend: 'up',
    icon: Activity,
  },
  {
    id: 'analysis',
    title: { ko: '총 분석량', en: 'Total Analysis' },
    value: '8,934',
    unit: { ko: '건', en: 'cases' },
    change: '+18.7%',
    trend: 'up',
    icon: BarChart3,
  },
  {
    id: 'uptime',
    title: { ko: '총 가동시간', en: 'Total Uptime' },
    value: '99.7',
    unit: '%',
    change: '+0.1%',
    trend: 'up',
    icon: Clock,
  },
];

const chartData = {
  revenue: [
    { time: '00:00', value: 45000 },
    { time: '04:00', value: 52000 },
    { time: '08:00', value: 67000 },
    { time: '12:00', value: 89000 },
    { time: '16:00', value: 94000 },
    { time: '20:00', value: 87000 },
  ],
  processing: [
    { time: '00:00', value: 850 },
    { time: '04:00', value: 920 },
    { time: '08:00', value: 1150 },
    { time: '12:00', value: 1340 },
    { time: '16:00', value: 1280 },
    { time: '20:00', value: 1100 },
  ],
  analysis: [
    { time: '00:00', value: 620 },
    { time: '04:00', value: 745 },
    { time: '08:00', value: 890 },
    { time: '12:00', value: 950 },
    { time: '16:00', value: 1020 },
    { time: '20:00', value: 880 },
  ],
  uptime: [
    { time: '00:00', value: 99.5 },
    { time: '04:00', value: 99.8 },
    { time: '08:00', value: 99.9 },
    { time: '12:00', value: 99.7 },
    { time: '16:00', value: 99.6 },
    { time: '20:00', value: 99.8 },
  ],
};

const statusData = [
  { line: 1, status: 'normal', throughput: '3,245' },
  { line: 2, status: 'normal', throughput: '3,128' },
  { line: 3, status: 'warning', throughput: '2,891' },
  { line: 4, status: 'normal', throughput: '3,583' },
];

export const OverviewTab2: React.FC = () => {
  const { language, expandedCard, setExpandedCard } = useDashboard2();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">정상</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">주의</Badge>;
      case 'critical':
        return <Badge variant="destructive">위험</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '개요 (Design 2)' : 'Overview (Design 2)'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '시스템 전체 현황' : 'Overall System Status'}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Metrics Cards */}
        <div className="xl:col-span-1 space-y-4">
          {metricsData.map((metric, index) => {
            const Icon = metric.icon;
            const isExpanded = expandedCard === metric.id;
            return (
              <Card 
                key={index} 
                className={`relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isExpanded ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setExpandedCard(isExpanded ? null : metric.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {language === 'ko' ? metric.title.ko : metric.title.en}
                    </CardTitle>
                    <Icon className={`w-5 h-5 ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-foreground">
                      {metric.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {typeof metric.unit === 'string' ? metric.unit : language === 'ko' ? metric.unit.ko : metric.unit.en}
                    </span>
                  </div>
                  <div className="flex items-center mt-3">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                    )}
                    <span className="text-sm text-green-600 font-medium">
                      {metric.change}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {language === 'ko' ? '지난 주 대비' : 'vs last week'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart Section */}
        <div className="xl:col-span-2">
          {expandedCard ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {language === 'ko' 
                    ? `${metricsData.find(m => m.id === expandedCard)?.title.ko} 추이` 
                    : `${metricsData.find(m => m.id === expandedCard)?.title.en} Trend`
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData[expandedCard as keyof typeof chartData]}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      className="fill-muted-foreground" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="fill-muted-foreground" 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#00A788" 
                      strokeWidth={3}
                      dot={{ fill: '#00A788', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, stroke: '#00A788', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <div className="text-muted-foreground">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">
                    {language === 'ko' ? '메트릭 카드를 클릭하여 차트를 확인하세요' : 'Click a metric card to view the chart'}
                  </p>
                  <p className="text-sm mt-2">
                    {language === 'ko' ? '실시간 데이터 추이를 확인할 수 있습니다' : 'View real-time data trends'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Production Lines Status */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ko' ? '생산 라인 현황' : 'Production Lines Status'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusData.map((line, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="font-medium">
                    {language === 'ko' ? `라인 ${line.line}` : `Line ${line.line}`}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">{line.throughput} {language === 'ko' ? '개/시간' : 'items/hr'}</span>
                  {getStatusBadge(line.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};