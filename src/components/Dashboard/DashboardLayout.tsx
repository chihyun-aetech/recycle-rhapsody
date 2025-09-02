import React, { useState, createContext, useContext, useEffect } from 'react';
import { useAtom } from 'jotai';
import { cn } from '@/shared/lib/utils';
import { Navigation } from './Navigation';
import { OverviewTab } from './tabs/OverviewTab';
import { MonitoringTab } from './tabs/MonitoringTab';
import { StatsTab } from './tabs/StatsTab';
import { AdminTab } from './tabs/AdminTab';
import { Sun, Moon, Globe, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Switch, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
import { themeAtom, fontSizeAtom, languageAtom, selectedSiteAtom, Theme, FontSize, Language } from '@/shared/store/dashboardStore';

type Tab = 'overview' | 'monitoring' | 'stats' | 'admin';

interface DashboardContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [language, setLanguage] = useAtom(languageAtom);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedSite, setSelectedSite] = useAtom(selectedSiteAtom);

  useEffect(() => {
    if (user?.level === 'admin') {
      setActiveTab('admin');
    }
  }, [user]);

  const contextValue: DashboardContextType = {
    activeTab,
    setActiveTab,
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
    // Remove existing font size classes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    // Add new font size class
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const fontSizes = [
    { key: 'small' as const, label: 'S' },
    { key: 'medium' as const, label: 'M' },
    { key: 'large' as const, label: 'L' },
  ];

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
          {activeTab === 'admin' && <AdminTab />}
        </main>
        
        {/* Floating Settings Button - visible when navigation controls are hidden */}
        <div className="fixed bottom-6 right-6 z-50 lg:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" className="rounded-full shadow-lg">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <div className="p-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === 'ko' ? '테마' : 'Theme'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Sun className={cn(
                      "w-4 h-4 transition-colors",
                      theme === 'light' ? 'text-orange-500' : 'text-muted-foreground'
                    )} />
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                    <Moon className={cn(
                      "w-4 h-4 transition-colors",
                      theme === 'dark' ? 'text-yellow-400' : 'text-muted-foreground'
                    )} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === 'ko' ? '언어' : 'Language'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="ml-1 text-xs">
                      {language === 'ko' ? '🇰🇷' : '🇺🇸'}
                    </span>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {language === 'ko' ? '글자 크기' : 'Font Size'}
                  </span>
                  <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                    {fontSizes.map((size) => (
                      <Button
                        key={size.key}
                        variant={fontSize === size.key ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFontSize(size.key)}
                        className={cn(
                          'w-6 h-6 text-xs',
                          fontSize === size.key 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground'
                        )}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};