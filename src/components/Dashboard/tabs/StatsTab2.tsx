import React, { useState } from 'react';
import { useDashboard2 } from '../DashboardLayout2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import * as XLSX from 'xlsx';

// 기간별 데이터 생성 함수
const generatePeriodData = (startDate: Date, endDate: Date) => {
  const data = [];
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= diffDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      revenue: Math.floor(Math.random() * 50000) + 80000,
      processing: Math.floor(Math.random() * 500) + 800,
      analysis: Math.floor(Math.random() * 300) + 600,
    });
  }
  return data;
};

export const StatsTab2: React.FC = () => {
  const { language } = useDashboard2();
  const [startDate, setStartDate] = useState<Date>(new Date(2024, 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);

  const periodData = generatePeriodData(startDate, endDate);

  const exportToExcel = () => {
    const exportData = periodData.map(item => ({
      [language === 'ko' ? '날짜' : 'Date']: item.date,
      [language === 'ko' ? '총 수입 (원)' : 'Total Revenue (KRW)']: item.revenue,
      [language === 'ko' ? '처리량 (개)' : 'Processing (Items)']: item.processing,
      [language === 'ko' ? '분석량 (건)' : 'Analysis (Cases)']: item.analysis,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, language === 'ko' ? '통계 데이터' : 'Statistics Data');
    
    const filename = `statistics_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const totalRevenue = periodData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProcessing = periodData.reduce((sum, item) => sum + item.processing, 0);
  const totalAnalysis = periodData.reduce((sum, item) => sum + item.analysis, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '통계 (Design 2)' : 'Statistics (Design 2)'}
        </h1>
        <div className="text-sm text-muted-foreground">
          {language === 'ko' ? '기간별 상세 분석' : 'Period Analysis'}
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ko' ? '기간 설정' : 'Date Range'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ko' ? '시작일:' : 'Start Date:'}
                </label>
                <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-40 justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, 'yyyy-MM-dd')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          setIsStartCalendarOpen(false);
                        }
                      }}
                      locale={language === 'ko' ? ko : undefined}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ko' ? '종료일:' : 'End Date:'}
                </label>
                <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-40 justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, 'yyyy-MM-dd')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          setEndDate(date);
                          setIsEndCalendarOpen(false);
                        }
                      }}
                      locale={language === 'ko' ? ko : undefined}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={exportToExcel} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              {language === 'ko' ? 'Excel 내보내기' : 'Export Excel'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{language === 'ko' ? '총 수입' : 'Total Revenue'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ₩{totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'ko' ? '선택된 기간' : 'Selected Period'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{language === 'ko' ? '총 처리량' : 'Total Processing'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalProcessing.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'ko' ? '개' : 'items'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{language === 'ko' ? '총 분석량' : 'Total Analysis'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalAnalysis.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'ko' ? '건' : 'cases'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ko' ? '수입 추이' : 'Revenue Trend'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={periodData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="fill-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="fill-muted-foreground" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00A788" 
                  strokeWidth={3}
                  dot={{ fill: '#00A788', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'ko' ? '처리량 vs 분석량' : 'Processing vs Analysis'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={periodData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="fill-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="fill-muted-foreground" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="processing" fill="#00A788" radius={[2, 2, 0, 0]} />
                <Bar dataKey="analysis" fill="#00A788AA" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ko' ? '상세 데이터' : 'Detailed Data'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ko' ? '날짜' : 'Date'}</TableHead>
                  <TableHead>{language === 'ko' ? '수입 (원)' : 'Revenue (KRW)'}</TableHead>
                  <TableHead>{language === 'ko' ? '처리량' : 'Processing'}</TableHead>
                  <TableHead>{language === 'ko' ? '분석량' : 'Analysis'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>₩{item.revenue.toLocaleString()}</TableCell>
                    <TableCell>{item.processing.toLocaleString()}</TableCell>
                    <TableCell>{item.analysis.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};