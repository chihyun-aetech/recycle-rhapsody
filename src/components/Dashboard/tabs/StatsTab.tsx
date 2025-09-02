  import React, { useState, useEffect, useMemo } from 'react';
import { useDashboard } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Calendar, Popover, PopoverContent, PopoverTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { 
  useGetPeriodStatistics, 
  useGetDailyReports, 
  useGetHourlyReports, 
  useGetTodaySummary, 
  useGetWeekSummary, 
  useGetMonthSummary 
} from '@/entities/stats/queries';
import { useAtom } from 'jotai';
import { languageAtom, selectedSiteAtom } from '@/shared/store/dashboardStore';

// CSV 데이터 파싱 함수
const parseCSVData = (csvContent: string) => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: any = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim();
    });
    data.push(row);
  }
  return data;
};

// 실제 CSV 파일 데이터를 시뮬레이션하는 함수
const generateRealCSVData = () => {
  const data = [];
  
  // R1, R2, R3 로봇의 오늘 9시-16시 데이터 시뮬레이션
  const stations = ['R1', 'R2', 'R3'];
  const majorCategories = ['Pet', 'Paper', 'Pe', 'Glass', 'Pp', 'Can', 'Ps', 'Other'];
  
  stations.forEach(station => {
    // 각 로봇마다 9시부터 16시까지 (7시간) 데이터 생성
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        // 분당 처리량을 다르게 설정 (R1 > R2 > R3)
        const baseProcessingRate = station === 'R1' ? 65 : station === 'R2' ? 58 : 53;
        const variance = Math.random() * 0.2 - 0.1; // ±10% 변동
        const actualRate = Math.max(1, Math.round(baseProcessingRate * (1 + variance)));
        
        for (let item = 0; item < actualRate; item++) {
          const timestamp = `2025-08-14-${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
          
          // 가중치 기반 카테고리 선택 (Pet이 가장 많고, Other가 가장 적음)
          const rand = Math.random();
          let majorCategory;
          if (rand < 0.32) majorCategory = 'Pet';
          else if (rand < 0.50) majorCategory = 'Paper';
          else if (rand < 0.66) majorCategory = 'Pe';
          else if (rand < 0.78) majorCategory = 'Glass';
          else if (rand < 0.87) majorCategory = 'Pp';
          else if (rand < 0.94) majorCategory = 'Can';
          else if (rand < 0.98) majorCategory = 'Ps';
          else majorCategory = 'Other';
          
          data.push({
            timestamp,
            object_id: `OID-${String(Math.floor(Math.random() * 100000)).padStart(8, '0')}`,
            station_id: station,
            station_seq: station === 'R1' ? '1' : station === 'R2' ? '2' : '3',
            is_picked: 'True',
            major_category: majorCategory,
            sub_category: `${majorCategory}_SubType`,
            width: Math.floor(Math.random() * 200) + 50,
            height: Math.floor(Math.random() * 250) + 50,
            area: Math.floor(Math.random() * 40000) + 10000,
            depth: (Math.random() * 120).toFixed(1)
          });
        }
      }
    }
  });
  
  return data;
};

// CSV 데이터에서 시간별 Depth 평균 계산
const generateDepthByTime = (csvData: any[]) => {
  const timeGroups: { [key: string]: { depths: number[], count: number } } = {};
  
  csvData.forEach(row => {
    if (row.timestamp && row.depth) {
      // timestamp 형식: 2025-08-14-HHMMSS에서 시간 추출
      const timestamp = row.timestamp;
      const hour = timestamp.substring(11, 13); // HH
      const timeLabel = `${hour}:00`;
      
      if (!timeGroups[timeLabel]) {
        timeGroups[timeLabel] = { depths: [], count: 0 };
      }
      
      timeGroups[timeLabel].depths.push(parseFloat(row.depth));
      timeGroups[timeLabel].count++;
    }
  });
  
  // 시간별 평균 depth 계산
  const timeData = Object.entries(timeGroups).map(([time, data]) => ({
    time,
    averageDepth: data.depths.reduce((sum, depth) => sum + depth, 0) / data.depths.length,
    count: data.count,
    minDepth: Math.min(...data.depths),
    maxDepth: Math.max(...data.depths)
  })).sort((a, b) => a.time.localeCompare(b.time));
  
  // 전체 통계
  const allDepths = csvData.map(row => parseFloat(row.depth)).filter(depth => !isNaN(depth));
  
  return {
    timeData,
    overall: {
      average: allDepths.reduce((sum, depth) => sum + depth, 0) / allDepths.length,
      min: Math.min(...allDepths),
      max: Math.max(...allDepths),
      median: allDepths.sort((a, b) => a - b)[Math.floor(allDepths.length / 2)]
    }
  };
};

// CSV 데이터에서 분단위 처리량 계산
const generateProcessingByMinute = (csvData: any[]) => {
  const minuteGroups: { [key: string]: number } = {};
  
  csvData.forEach(row => {
    if (row.timestamp) {
      // timestamp 형식: 2025-08-14-HHMMSS
      const timestamp = row.timestamp;
      const minute = timestamp.substring(0, 16); // 2025-08-14-HHMM (분 단위까지)
      
      minuteGroups[minute] = (minuteGroups[minute] || 0) + 1;
    }
  });
  
  return Object.entries(minuteGroups).map(([minute, count]) => ({
    minute: minute.substring(11, 13) + ':' + minute.substring(13, 15), // HH:MM 형식으로 변환
    fullMinute: minute, // 정렬용
    count
  })).sort((a, b) => a.fullMinute.localeCompare(b.fullMinute));
};

// 선택된 날짜의 10분 단위 처리량 계산
const generateProcessingByTenMinutes = (selectedDate: Date) => {
  const data = [];
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  
  // 9시부터 16시까지 10분 단위로 데이터 생성
  for (let hour = 9; hour <= 16; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const timestamp = `${dateStr}-${hour.toString().padStart(2, '0')}${minute.toString().padStart(2, '0')}`;
      
      // 10분간의 처리량 시뮬레이션 (30-80개 범위)
      const baseProcessing = 50;
      const variance = Math.random() * 30 - 15; // ±15 변동
      const count = Math.max(5, Math.round(baseProcessing + variance));
      
      data.push({
        time: timeStr,
        timestamp,
        count
      });
    }
  }
  
  return data;
};

// CSV 데이터에서 카테고리 분포 계산
const generateCategoryDistribution = (csvData: any[]) => {
  const majorCategories: { [key: string]: number } = {};
  const subCategories: { [key: string]: number } = {};
  
  csvData.forEach(row => {
    if (row.major_category) {
      majorCategories[row.major_category] = (majorCategories[row.major_category] || 0) + 1;
    }
    if (row.sub_category) {
      subCategories[row.sub_category] = (subCategories[row.sub_category] || 0) + 1;
    }
  });
  
  const majorData = Object.entries(majorCategories).map(([name, value]) => ({ name, value }));
  const subData = Object.entries(subCategories).map(([name, value]) => ({ name, value }));
  
  return { majorData, subData };
};

// Area 통계 및 분포 계산
const generateAreaStats = (csvData: any[]) => {
  const areas = csvData.map(row => parseFloat(row.area)).filter(area => !isNaN(area));
  
  // 히스토그램을 위한 구간별 데이터
  const binSize = 5000; // 5000 픽셀 단위로 구간 나누기
  const minArea = Math.min(...areas);
  const maxArea = Math.max(...areas);
  const bins: { [key: string]: number } = {};
  
  // 구간별로 개수 계산 (정규분포 비슷한 패턴으로 조정)
  areas.forEach((area, index) => {
    const binKey = Math.floor(area / binSize) * binSize;
    const binLabel = `${binKey.toLocaleString()}-${(binKey + binSize).toLocaleString()}`;
    
    // 중간 구간에 더 많은 가중치 적용하여 분포 차이 생성
    const midRange = 30000; // 30K 픽셀 근처에 집중
    const distanceFromMid = Math.abs(area - midRange);
    const weight = Math.max(0.2, 1 - (distanceFromMid / 20000)); // 중심에서 멀어질수록 가중치 감소
    
    bins[binLabel] = (bins[binLabel] || 0) + Math.ceil(weight * 1.5);
  });
  
  const distributionData = Object.entries(bins).map(([range, count]) => ({
    range,
    count
  }));
  
  return {
    average: areas.reduce((sum, area) => sum + area, 0) / areas.length,
    min: minArea,
    max: maxArea,
    median: areas.sort((a, b) => a - b)[Math.floor(areas.length / 2)],
    distributionData
  };
};

// 가상 CSV 데이터 생성 (실제 CSV 구조와 동일)
const generateMockCSVData = () => {
  const data = [];
  const majorCategories = ['Pet', 'Paper', 'Pe', 'Glass', 'Pp', 'Can', 'Ps'];
  const subCategories = {
    Pet: ['PET_Bottle_Colorless_NoLabel', 'PET_G', 'PET_Tray', 'PET_Bottle_Discolored', 'PET_Food', 'PET_Bottle_White_Ricewine'],
    Pe: ['PE_Medicine', 'PE_Sauce', 'PE_Else'],
    Pp: ['PP_Delivery_Color', 'PP_Tray', 'PP_Delivery_Translucent', 'PP_Yogurt'],
    Ps: ['PS_Tray', 'PS_Styrofoam', 'PS_Yogurt_d'],
    Glass: ['GLASS_Soju', 'GLASS_Energydrink', 'GLASS_Beer'],
    Can: ['CAN_Beer', 'CAN_Coke'],
    Paper: ['PAPER_Box', 'PAPER_Cup']
  };
  
  // 현재 시간 기준으로 지난 1시간 데이터 생성
  const now = new Date();
  for (let i = 0; i < 3600; i += 10) { // 10초마다 데이터 포인트
    const timestamp = new Date(now.getTime() - (3600 - i) * 1000);
    const timestampStr = timestamp.toISOString().replace(/[-T:]/g, '').substring(0, 13);
    
    if (Math.random() > 0.3) { // 70% 확률로 데이터 생성
      // 가중치 기반 카테고리 선택
      const rand = Math.random();
      let majorCategory;
      if (rand < 0.32) majorCategory = 'Pet';
      else if (rand < 0.50) majorCategory = 'Paper';
      else if (rand < 0.66) majorCategory = 'Pe';
      else if (rand < 0.78) majorCategory = 'Glass';
      else if (rand < 0.87) majorCategory = 'Pp';
      else if (rand < 0.94) majorCategory = 'Can';
      else majorCategory = 'Ps';
      
      const subCategory = subCategories[majorCategory][Math.floor(Math.random() * subCategories[majorCategory].length)];
      
      data.push({
        timestamp: `2025-08-14-${timestampStr}`,
        object_id: `OID-${String(Math.floor(Math.random() * 100000)).padStart(8, '0')}`,
        station_id: 'R2',
        station_seq: '2',
        is_picked: 'True',
        major_category: majorCategory,
        sub_category: subCategory,
        width: Math.floor(Math.random() * 200) + 50,
        height: Math.floor(Math.random() * 250) + 50,
        area: Math.floor(Math.random() * 40000) + 10000,
        depth: (Math.random() * 120).toFixed(1)
      });
    }
  }
  
  return data;
};

// 3단계 로봇 처리 시스템 기반 데이터 생성 함수 (프롬프팅 사양 적용)
const generatePeriodData = (startDate: Date, endDate: Date) => {
  const data = [];
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 로봇 사양 (프롬프팅 기준)
  const robotCapacity = {
    R1: { min: 65, variance: 0.15 },  // 65개/분 ±15%
    R2: { min: 58, variance: 0.10 },  // 58개/분 ±10%
    R3: { min: 53, variance: 0.07 }   // 53개/분 ±7%
  };

  // 실제 CSV 데이터 패턴을 기반으로 한 카테고리별 비율
  const categoryRatios = {
    Pet: 0.32,    // PET 관련 항목들 (가장 많음)
    Paper: 0.18,  // Paper 관련 항목들 (두 번째)
    Pe: 0.16,     // PE 관련 항목들
    Glass: 0.12,  // Glass 관련 항목들
    Pp: 0.09,     // PP 관련 항목들
    Can: 0.07,    // Can 관련 항목들
    Ps: 0.04,     // PS 관련 항목들
    Other: 0.02   // Other, Else 관련 항목들 (가장 적음)
  };

  // 시간대별 처리량 패턴 (오전 9시~오후 4시, 7시간 운영)
  const hourlyPattern = [0.12, 0.15, 0.18, 0.16, 0.14, 0.13, 0.12]; // 7시간 분포

  for (let i = 0; i <= diffDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // 컨베이어 유입량: 시간당 20,000개 ±15% (7시간 운영)
    const dailyInflowBase = 20000 * 7; // 140,000개 기준
    const dailyInflowVariation = dailyInflowBase * 0.15;
    const dailyInflow = Math.floor(dailyInflowBase + (Math.random() - 0.5) * 2 * dailyInflowVariation);

    // 각 로봇의 일일 처리 용량 계산 (분당 용량 × 420분 × 변동률)
    const r1DailyCapacity = Math.floor(robotCapacity.R1.min * 420 * (1 + (Math.random() - 0.5) * robotCapacity.R1.variance));
    const r2DailyCapacity = Math.floor(robotCapacity.R2.min * 420 * (1 + (Math.random() - 0.5) * robotCapacity.R2.variance));
    const r3DailyCapacity = Math.floor(robotCapacity.R3.min * 420 * (1 + (Math.random() - 0.5) * robotCapacity.R3.variance));

    // 3단계 처리 모델 (상류에서 처리되면 하류에서 제외)
    const r1Processed = Math.min(dailyInflow, r1DailyCapacity);
    const r1Remaining = dailyInflow - r1Processed;

    const r2Processed = Math.min(r1Remaining, r2DailyCapacity);
    const r2Remaining = r1Remaining - r2Processed;

    const r3Processed = Math.min(r2Remaining, r3DailyCapacity);
    const r3Remaining = r2Remaining - r3Processed;

    const totalProcessed = r1Processed + r2Processed + r3Processed;

    // 카테고리별 처리량 계산 (전체 처리량에서 비율 적용)
    const wastePET = Math.floor(totalProcessed * categoryRatios.Pet * (0.8 + Math.random() * 0.4));
    const wastePE = Math.floor(totalProcessed * categoryRatios.Pe * (0.8 + Math.random() * 0.4));
    const wastePP = Math.floor(totalProcessed * categoryRatios.Pp * (0.8 + Math.random() * 0.4));
    const wastePS = Math.floor(totalProcessed * categoryRatios.Ps * (0.8 + Math.random() * 0.4));
    const wasteGlass = Math.floor(totalProcessed * categoryRatios.Glass * (0.8 + Math.random() * 0.4));
    const wasteCan = Math.floor(totalProcessed * categoryRatios.Can * (0.8 + Math.random() * 0.4));
    const wastePaper = Math.floor(totalProcessed * categoryRatios.Paper * (0.8 + Math.random() * 0.4));
    const wasteOther = Math.floor(totalProcessed * categoryRatios.Other * (0.8 + Math.random() * 0.4));

    // 분석량 (처리량의 95-100%)
    const analysis = Math.floor(totalProcessed * (0.95 + Math.random() * 0.05));

    // 픽업률 계산 (전체 유입량 대비 처리량)
    const overallPickupRate = totalProcessed / dailyInflow;

    // 수입 계산 (카테고리별 단가 적용)
    const revenue =
      wastePET * 150 +    // PET: 150원/개
      wastePE * 120 +     // PE: 120원/개
      wastePP * 100 +     // PP: 100원/개
      wastePS * 80 +      // PS: 80원/개
      wasteGlass * 200 +  // Glass: 200원/개
      wasteCan * 300 +    // Can: 300원/개
      wastePaper * 50 +   // Paper: 50원/개
      wasteOther * 30;    // Other: 30원/개

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      revenue,
      processing: totalProcessed,
      analysis,
      wastePET,
      wastePE,
      wastePP,
      wastePS,
      wasteGlass,
      wasteCan,
      wastePaper,
      wasteOther,
      // 3단계 로봇 시스템 메트릭
      dailyInflow,
      r1Processed,
      r2Processed,
      r3Processed,
      unprocessed: r3Remaining,
      // 추가 메트릭
      averageArea: Math.floor(Math.random() * 20000) + 25000, // 25000-45000 픽셀
      averageDepth: Math.floor(Math.random() * 50) + 50,     // 50-100mm
      pickupRate: Math.round(overallPickupRate * 10000) / 100, // 픽업률을 백분율로 변환 (소수점 2자리)
      beltSpeed: Math.round((2.0 + Math.random() * 1.0) * 100) / 100, // 벨트속도 소수점 2자리
    });
  }
  return data;
};

export const StatsTab: React.FC = () => {
  const [language] = useAtom(languageAtom);
  const [selectedSite] = useAtom(selectedSiteAtom);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)); // 2 weeks ago
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);
  
  // 분단위 차트용 날짜 선택
  const [selectedMinuteDate, setSelectedMinuteDate] = useState<Date>(new Date());
  const [isMinuteDateCalendarOpen, setIsMinuteDateCalendarOpen] = useState(false);

  // Generate station IDs for selected site (e.g., R&T1, R&T2, R&T3)
  const stationIds = [`${selectedSite}1`, `${selectedSite}2`, `${selectedSite}3`];

  // Server data queries
  const { data: periodStatsData, isLoading: periodLoading, error: periodError } = useGetPeriodStatistics({
    start_date: format(startDate, 'yyyy-MM-dd'),
    end_date: format(endDate, 'yyyy-MM-dd'),
    station_ids: stationIds
  });

  const { data: todayData, isLoading: todayLoading } = useGetTodaySummary({
    station_ids: stationIds
  });

  const { data: weekData, isLoading: weekLoading } = useGetWeekSummary({
    station_ids: stationIds
  });

  const { data: monthData, isLoading: monthLoading } = useGetMonthSummary({
    station_ids: stationIds
  });

  const { data: dailyReportsData, isLoading: dailyLoading } = useGetDailyReports({
    start_date: format(startDate, 'yyyy-MM-dd'),
    end_date: format(endDate, 'yyyy-MM-dd'),
    station_id: `${selectedSite}1` // Use primary station for daily reports
  });

  const { data: hourlyReportsData, isLoading: hourlyLoading } = useGetHourlyReports({
    start_datetime: format(selectedMinuteDate, "yyyy-MM-dd'T'00:00:00"),
    end_datetime: format(selectedMinuteDate, "yyyy-MM-dd'T'23:59:59"),
    station_id: `${selectedSite}1` // Use primary station for hourly reports
  });

  const isLoading = periodLoading || todayLoading || weekLoading || monthLoading || dailyLoading || hourlyLoading;

  // Show error toast notifications for failed queries
  useEffect(() => {
    if (periodError) {
      toast.error(language === 'ko' ? '기간 통계 데이터를 불러올 수 없습니다.' : 'Failed to load period statistics data.');
    }
  }, [periodError, language]);

  // Helper function to extract site from station_id
  const extractSiteFromStationId = (stationId: string): string => {
    return stationId.replace(/\d+$/, '');
  };

  // Filter server data by selected site
  const filteredPeriodData = useMemo(() => {
    if (!periodStatsData?.daily_trends || !Array.isArray(periodStatsData.daily_trends)) return [];
    return periodStatsData.daily_trends.filter(item => 
      !item.station_id || extractSiteFromStationId(item.station_id) === selectedSite
    );
  }, [periodStatsData, selectedSite]);

  const filteredDailyData = useMemo(() => {
    if (!dailyReportsData?.data || !Array.isArray(dailyReportsData.data)) return [];
    return dailyReportsData.data.filter(item =>
      !item.station_id || extractSiteFromStationId(item.station_id) === selectedSite
    );
  }, [dailyReportsData, selectedSite]);

  const filteredHourlyData = useMemo(() => {
    if (!hourlyReportsData?.data || !Array.isArray(hourlyReportsData.data)) return [];
    return hourlyReportsData.data.filter(item =>
      !item.station_id || extractSiteFromStationId(item.station_id) === selectedSite
    );
  }, [hourlyReportsData, selectedSite]);

  // Process server data or fallback to mock data
  const processedPeriodData = useMemo(() => {
    if (filteredPeriodData.length > 0) {
      return filteredPeriodData.map(item => ({
        date: item.date || format(new Date(), 'yyyy-MM-dd'),
        revenue: item.total_revenue || 0,
        processing: item.total_processed || 0,
        analysis: item.total_analyzed || 0,
        wastePET: item.pet_count || 0,
        wastePE: item.pe_count || 0,
        wastePP: item.pp_count || 0,
        wastePS: item.ps_count || 0,
        wasteGlass: item.glass_count || 0,
        wasteCan: item.can_count || 0,
        wastePaper: item.paper_count || 0,
        wasteOther: item.other_count || 0,
        dailyInflow: item.total_inflow || 0,
        r1Processed: item.r1_processed || 0,
        r2Processed: item.r2_processed || 0,
        r3Processed: item.r3_processed || 0,
        unprocessed: item.total_unprocessed || 0,
        averageArea: item.average_area || 0,
        averageDepth: item.average_depth || 0,
        pickupRate: item.pickup_rate || 0,
        beltSpeed: item.belt_speed || 2.4,
      }));
    }
    // Fallback to generated data
    return generatePeriodData(startDate, endDate);
  }, [filteredPeriodData, startDate, endDate]);

  // 기간이 변경될 때 선택된 날짜 조정
  useEffect(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // 오늘이 설정된 기간 내에 있으면 오늘로, 아니면 endDate로 설정
    if (today >= startDate && today <= endDate) {
      setSelectedMinuteDate(today);
    } else {
      setSelectedMinuteDate(endDate);
    }
  }, [startDate, endDate]);
  
  // 실제 CSV 데이터 분석 (기간과 무관하므로 한 번만 계산)
  const realCSVData = useMemo(() => generateRealCSVData(), []);
  const depthByTime = useMemo(() => generateDepthByTime(realCSVData), [realCSVData]);
  const processingByMinute = useMemo(() => generateProcessingByMinute(realCSVData), [realCSVData]);
  const categoryDistribution = useMemo(() => generateCategoryDistribution(realCSVData), [realCSVData]);
  const areaStats = useMemo(() => generateAreaStats(realCSVData), [realCSVData]);
  
  // 선택된 날짜의 10분 단위 처리량 데이터 (선택된 날짜가 변경될 때만 재계산)
  const processingByTenMinutes = useMemo(() => generateProcessingByTenMinutes(selectedMinuteDate), [selectedMinuteDate]);
  
  // 차트 색상
  const COLORS = ['#00A788', '#3b82f6', '#22c55e', '#9333ea', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const exportToExcel = () => {
    const exportData = (processedPeriodData || []).map(item => ({
      [language === 'ko' ? '날짜' : 'Date']: item?.date || '',
      [language === 'ko' ? '컨베이어 유입량' : 'Conveyor Inflow']: item?.dailyInflow || 0,
      [language === 'ko' ? 'R1 처리량' : 'R1 Processed']: item?.r1Processed || 0,
      [language === 'ko' ? 'R2 처리량' : 'R2 Processed']: item?.r2Processed || 0,
      [language === 'ko' ? 'R3 처리량' : 'R3 Processed']: item?.r3Processed || 0,
      [language === 'ko' ? '총 처리량' : 'Total Processing']: item?.processing || 0,
      [language === 'ko' ? '미처리량' : 'Unprocessed']: item?.unprocessed || 0,
      [language === 'ko' ? '총 수입 (원)' : 'Total Revenue (KRW)']: item?.revenue || 0,
      [language === 'ko' ? '분석량 (건)' : 'Analysis (Cases)']: item?.analysis || 0,
      [language === 'ko' ? 'PET 처리량' : 'PET Processing']: item?.wastePET || 0,
      [language === 'ko' ? 'PE 처리량' : 'PE Processing']: item?.wastePE || 0,
      [language === 'ko' ? 'PP 처리량' : 'PP Processing']: item?.wastePP || 0,
      [language === 'ko' ? 'PS 처리량' : 'PS Processing']: item?.wastePS || 0,
      [language === 'ko' ? 'Glass 처리량' : 'Glass Processing']: item?.wasteGlass || 0,
      [language === 'ko' ? 'Can 처리량' : 'Can Processing']: item?.wasteCan || 0,
      [language === 'ko' ? 'Paper 처리량' : 'Paper Processing']: item?.wastePaper || 0,
      [language === 'ko' ? 'Other 처리량' : 'Other Processing']: item?.wasteOther || 0,
      [language === 'ko' ? '평균 면적 (픽셀)' : 'Average Area (pixels)']: item?.averageArea || 0,
      [language === 'ko' ? '평균 깊이 (mm)' : 'Average Depth (mm)']: item?.averageDepth || 0,
      [language === 'ko' ? '벨트 속도 (m/s)' : 'Belt Speed (m/s)']: (item?.beltSpeed || 2.4).toFixed(2),
      [language === 'ko' ? '픽업률 (%)' : 'Pickup Rate (%)']: (item?.pickupRate || 0).toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, language === 'ko' ? '통계 데이터' : 'Statistics Data');

    const filename = `statistics_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const totalRevenue = processedPeriodData?.reduce((sum, item) => sum + (item?.revenue || 0), 0) || 0;
  const totalInflow = processedPeriodData?.reduce((sum, item) => sum + (item?.dailyInflow || 0), 0) || 0;
  const totalProcessing = processedPeriodData?.reduce((sum, item) => sum + (item?.processing || 0), 0) || 0;
  const totalAnalysis = processedPeriodData?.reduce((sum, item) => sum + (item?.analysis || 0), 0) || 0;
  const totalUnprocessed = processedPeriodData?.reduce((sum, item) => sum + (item?.unprocessed || 0), 0) || 0;
  const averagePickupRate = processedPeriodData?.length > 0 
    ? processedPeriodData.reduce((sum, item) => sum + (item?.pickupRate || 0), 0) / processedPeriodData.length 
    : 0;
  const averageObjectArea = processedPeriodData?.length > 0 
    ? processedPeriodData.reduce((sum, item) => sum + (item?.averageArea || 0), 0) / processedPeriodData.length 
    : 0;
  const averageBeltSpeed = processedPeriodData?.length > 0 
    ? processedPeriodData.reduce((sum, item) => sum + (item?.beltSpeed || 0), 0) / processedPeriodData.length 
    : 2.4;

  // 로봇별 처리량 합계
  const totalR1 = processedPeriodData?.reduce((sum, item) => sum + (item?.r1Processed || 0), 0) || 0;
  const totalR2 = processedPeriodData?.reduce((sum, item) => sum + (item?.r2Processed || 0), 0) || 0;
  const totalR3 = processedPeriodData?.reduce((sum, item) => sum + (item?.r3Processed || 0), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {language === 'ko' ? '통계' : 'Statistics'}
        </h1>
        <div className="text-right">
          <div className="text-lg font-semibold text-foreground">
            {format(startDate, 'yyyy-MM-dd')} ~ {format(endDate, 'yyyy-MM-dd')}
          </div>
          <div className="text-sm text-muted-foreground">
            {language === 'ko' ? '기간별 상세 분석' : 'Period Analysis'}
          </div>
          <div className="flex items-center justify-end mt-1 space-x-2">
            <div className={`w-2 h-2 rounded-full ${filteredPeriodData.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs text-muted-foreground">
              {filteredPeriodData.length > 0 
                ? (language === 'ko' ? '서버 데이터' : 'Server Data')
                : (language === 'ko' ? '기본 데이터' : 'Fallback Data')
              }
            </span>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-muted-foreground">{language === 'ko' ? '데이터를 불러오는 중...' : 'Loading data...'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {periodError && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-red-600 mb-2">⚠️</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ko' ? '서버 데이터를 불러올 수 없어 기본 데이터를 표시합니다.' : 'Unable to load server data, showing fallback data.'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          
                          if (date > today) {
                            toast.error(language === 'ko' ? '시작일은 오늘 이후로 설정할 수 없습니다.' : 'Start date cannot be set after today.');
                            return;
                          }
                          
                          if (date > endDate) {
                            toast.error(language === 'ko' ? '시작일은 종료일보다 늦을 수 없습니다.' : 'Start date cannot be after end date.');
                            return;
                          }
                          
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
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          
                          if (date > today) {
                            toast.error(language === 'ko' ? '종료일은 오늘 이후로 설정할 수 없습니다.' : 'End date cannot be set after today.');
                            return;
                          }
                          
                          if (date < startDate) {
                            toast.error(language === 'ko' ? '종료일은 시작일보다 앞설 수 없습니다.' : 'End date cannot be before start date.');
                            return;
                          }
                          
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

      {/* System Overview Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {language === 'ko' ? '시스템 전체 현황' : 'System Overview'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{language === 'ko' ? '컨베이어 유입량' : 'Conveyor Inflow'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(totalInflow / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'ko' ? `일평균 ${Math.round(totalInflow / Math.max(processedPeriodData?.length || 1, 1) / 1000)}K개` : `Avg ${Math.round(totalInflow / Math.max(processedPeriodData?.length || 1, 1) / 1000)}K/day`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{language === 'ko' ? '총 처리량' : 'Total Processing'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(totalProcessing / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'ko' ? `처리율 ${averagePickupRate.toFixed(2)}%` : `${averagePickupRate.toFixed(2)}% processed`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{language === 'ko' ? '총 수입' : 'Total Revenue'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                ₩{Math.round(totalRevenue / 1000000)}M
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'ko' ? '선택된 기간' : 'Selected Period'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{language === 'ko' ? '평균 벨트 속도' : 'Avg Belt Speed'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {averageBeltSpeed.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'ko' ? 'm/s' : 'm/s'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Robot Processing Breakdown */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {language === 'ko' ? '로봇별 처리 현황 (R1 → R2 → R3)' : 'Robot Processing Breakdown (R1 → R2 → R3)'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                R1 {language === 'ko' ? '처리량' : 'Processing'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(totalR1 / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'ko' ? '65/분 용량' : '65/min capacity'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                R2 {language === 'ko' ? '처리량' : 'Processing'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(totalR2 / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'ko' ? '58/분 용량' : '58/min capacity'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                R3 {language === 'ko' ? '처리량' : 'Processing'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(totalR3 / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'ko' ? '53/분 용량' : '53/min capacity'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                {language === 'ko' ? '미처리량' : 'Unprocessed'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(totalUnprocessed / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'ko' ? '시스템 한계 초과' : 'System overflow'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ko' ? '수입 추이' : 'Revenue Trend'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedPeriodData || []}>
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
            <CardTitle>{language === 'ko' ? '로봇별 처리량 추이' : 'Robot Processing Trends'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedPeriodData || []}>
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
                  dataKey="r1Processed"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="R1"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="r2Processed"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="R2"
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="r3Processed"
                  stroke="#9333ea"
                  strokeWidth={2}
                  name="R3"
                  dot={{ fill: '#9333ea', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'ko' ? '유입량 vs 처리량' : 'Inflow vs Processing'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedPeriodData || []}>
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
                  dataKey="dailyInflow"
                  stroke="#64748b"
                  strokeWidth={2}
                  name={language === 'ko' ? '유입량' : 'Inflow'}
                  dot={{ fill: '#64748b', strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="processing"
                  stroke="#00A788"
                  strokeWidth={2}
                  name={language === 'ko' ? '처리량' : 'Processed'}
                  dot={{ fill: '#00A788', strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="unprocessed"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name={language === 'ko' ? '미처리' : 'Unprocessed'}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>{language === 'ko' ? '시간별 Depth 평균 변화' : 'Hourly Average Depth Trend'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-foreground">
                  {depthByTime.overall.average.toFixed(1)}mm
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '전체 평균' : 'Overall Avg'}
                </p>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {depthByTime.overall.min.toFixed(1)}mm
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '최소' : 'Min'}
                </p>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {depthByTime.overall.max.toFixed(1)}mm
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '최대' : 'Max'}
                </p>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {depthByTime.overall.median.toFixed(1)}mm
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '중앙값' : 'Median'}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={depthByTime.timeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="fill-muted-foreground" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="fill-muted-foreground" 
                  tick={{ fontSize: 12 }}
                  domain={[0, 120]}
                  label={{ value: language === 'ko' ? 'Depth (mm)' : 'Depth (mm)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}mm`, language === 'ko' ? '평균 깊이' : 'Avg Depth']}
                  labelFormatter={(label) => `${language === 'ko' ? '시간' : 'Time'}: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="averageDepth"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  name={language === 'ko' ? '평균 깊이' : 'Average Depth'}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{language === 'ko' ? 'Category 분포' : 'Category Distribution'}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {format(startDate, 'MM/dd')} ~ {format(endDate, 'MM/dd')}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Major Category */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-center">
                  {language === 'ko' ? 'Major Category' : 'Major Category'}
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution.majorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}\n${value}개\n${(percent * 100).toFixed(0)}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.majorData.map((entry, index) => (
                        <Cell key={`major-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [value, language === 'ko' ? '처리량' : 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Sub Category */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-center">
                  {language === 'ko' ? 'Sub Category (Top 8)' : 'Sub Category (Top 8)'}
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution.subData.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name.split('_')[0]}\n${value}개\n${(percent * 100).toFixed(0)}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.subData.slice(0, 8).map((entry, index) => (
                        <Cell key={`sub-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [value, language === 'ko' ? '처리량' : 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{language === 'ko' ? '10분단위 처리량 트렌드' : '10-Minute Processing Trend'}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {language === 'ko' ? '날짜:' : 'Date:'}
                </span>
                <Popover open={isMinuteDateCalendarOpen} onOpenChange={setIsMinuteDateCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-32 justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedMinuteDate, 'MM-dd')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedMinuteDate}
                      onSelect={(date) => {
                        if (date) {
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          
                          if (date > today) {
                            toast.error(language === 'ko' ? '오늘 이후 날짜는 선택할 수 없습니다.' : 'Cannot select future dates.');
                            return;
                          }
                          
                          if (date < startDate || date > endDate) {
                            toast.error(language === 'ko' ? '설정된 기간 내의 날짜를 선택해주세요.' : 'Please select a date within the set period.');
                            return;
                          }
                          
                          setSelectedMinuteDate(date);
                          setIsMinuteDateCalendarOpen(false);
                        }
                      }}
                      locale={language === 'ko' ? ko : undefined}
                      className="pointer-events-auto"
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(23, 59, 59, 999);
                        return date > today || date < startDate || date > endDate;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processingByTenMinutes} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="fill-muted-foreground" 
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  className="fill-muted-foreground" 
                  tick={{ fontSize: 12 }}
                  label={{ value: language === 'ko' ? '처리량' : 'Count', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, language === 'ko' ? '처리량' : 'Processed']}
                  labelFormatter={(label) => `${language === 'ko' ? '시간' : 'Time'}: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.6}
                  strokeWidth={2}
                  name={language === 'ko' ? '처리량' : 'Processed'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'ko' ? 'Area 분포 히스토그램' : 'Area Distribution Histogram'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-foreground">
                  {Math.round(areaStats.average).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '평균' : 'Avg'}
                </p>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {Math.round(areaStats.min).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '최소' : 'Min'}
                </p>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {Math.round(areaStats.max).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '최대' : 'Max'}
                </p>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {Math.round(areaStats.median).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '중앙' : 'Med'}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={areaStats.distributionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="range" 
                  className="fill-muted-foreground" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis className="fill-muted-foreground" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, language === 'ko' ? '개수' : 'Count']}
                />
                <Bar
                  dataKey="count"
                  fill="#06b6d4"
                  radius={[2, 2, 0, 0]}
                  name={language === 'ko' ? '개수' : 'Count'}
                />
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
                  <TableHead>{language === 'ko' ? '유입량' : 'Inflow'}</TableHead>
                  <TableHead className="text-blue-600">R1</TableHead>
                  <TableHead className="text-green-600">R2</TableHead>
                  <TableHead className="text-purple-600">R3</TableHead>
                  <TableHead>{language === 'ko' ? '총 처리' : 'Total'}</TableHead>
                  <TableHead className="text-red-600">{language === 'ko' ? '미처리' : 'Missed'}</TableHead>
                  <TableHead>{language === 'ko' ? '수입 (원)' : 'Revenue'}</TableHead>
                  <TableHead>{language === 'ko' ? '픽업률' : 'Rate'}</TableHead>
                  <TableHead>{language === 'ko' ? '벨트속도' : 'Speed'}</TableHead>
                  <TableHead>PET</TableHead>
                  <TableHead>PE</TableHead>
                  <TableHead>PP</TableHead>
                  <TableHead>PS</TableHead>
                  <TableHead>Glass</TableHead>
                  <TableHead>Can</TableHead>
                  <TableHead>Paper</TableHead>
                  <TableHead>Other</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(processedPeriodData || []).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item?.date || ''}</TableCell>
                    <TableCell>{(item?.dailyInflow || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-blue-600 font-semibold">{(item?.r1Processed || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-green-600 font-semibold">{(item?.r2Processed || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-purple-600 font-semibold">{(item?.r3Processed || 0).toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">{(item?.processing || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">{(item?.unprocessed || 0).toLocaleString()}</TableCell>
                    <TableCell>₩{Math.round((item?.revenue || 0) / 1000)}K</TableCell>
                    <TableCell>{(item?.pickupRate || 0).toFixed(2)}%</TableCell>
                    <TableCell>{(item?.beltSpeed || 2.4).toFixed(2)} m/s</TableCell>
                    <TableCell>{(item?.wastePET || 0).toLocaleString()}</TableCell>
                    <TableCell>{(item?.wastePE || 0).toLocaleString()}</TableCell>
                    <TableCell>{(item?.wastePP || 0).toLocaleString()}</TableCell>
                    <TableCell>{(item?.wastePS || 0).toLocaleString()}</TableCell>
                    <TableCell>{(item?.wasteGlass || 0).toLocaleString()}</TableCell>
                    <TableCell>{(item?.wasteCan || 0).toLocaleString()}</TableCell>
                    <TableCell>{(item?.wastePaper || 0).toLocaleString()}</TableCell>
                    <TableCell>{(item?.wasteOther || 0).toLocaleString()}</TableCell>
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