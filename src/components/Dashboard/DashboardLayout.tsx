import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { OverviewTab } from './tabs/OverviewTab';
import { MonitoringTab } from './tabs/MonitoringTab';
import { StatsTab } from './tabs/StatsTab';

type Tab = 'overview' | 'monitoring' | 'stats';
type FontSize = 'small' | 'medium' | 'large';
type Theme = 'light' | 'dark';
type Language = 'ko' | 'en';

interface DashboardContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  expandedCard: string | null;
  setExpandedCard: (cardId: string | null) => void;
  selectedLine: number | null;
  setSelectedLine: (lineId: number | null) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [fontSize, setFontSize] = useState<FontSize>('small');
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ko');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const contextValue: DashboardContextType = {
    activeTab,
    setActiveTab,
    fontSize,
    setFontSize,
    theme,
    setTheme,
    language,
    setLanguage,
    expandedCard,
    setExpandedCard,
    selectedLine,
    setSelectedLine,
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-multiplier', fontSize === 'small' ? '1' : fontSize === 'medium' ? '1.125' : '1.25');
  }, [fontSize]);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className={cn(
        'min-h-screen bg-background transition-all duration-300',
        theme === 'dark' && 'dark',
        fontSizeClasses[fontSize]
      )}>
        <Navigation />
        <main className="pt-16 dashboard-content">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'monitoring' && <MonitoringTab />}
          {activeTab === 'stats' && <StatsTab />}
        </main>
      </div>
    </DashboardContext.Provider>
  );
};