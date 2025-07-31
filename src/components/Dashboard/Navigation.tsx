import React from 'react';
import { Bell, Sun, Moon, Globe, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDashboard } from './DashboardLayout';
import { AlertDropdown } from './AlertDropdown';

export const Navigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    fontSize, 
    setFontSize, 
    theme, 
    setTheme, 
    language, 
    setLanguage 
  } = useDashboard();

  const tabs = [
    { key: 'overview' as const, label: language === 'ko' ? '개요' : 'Overview' },
    { key: 'monitoring' as const, label: language === 'ko' ? '모니터링' : 'Monitoring' },
    { key: 'stats' as const, label: language === 'ko' ? '통계' : 'Stats' },
  ];

  const fontSizes = [
    { key: 'small' as const, label: 'S' },
    { key: 'medium' as const, label: 'M' },
    { key: 'large' as const, label: 'L' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl text-foreground">
            {language === 'ko' ? '폐기물 처리 시스템' : 'Waste Processing System'}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'transition-all duration-200',
                activeTab === tab.key && 'bg-primary text-primary-foreground shadow-sm'
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Alert Dropdown */}
          <AlertDropdown />
          
          {/* Theme Toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="w-9 h-9"
          >
            {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Language Toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className="w-9 h-9"
          >
            <Globe className="w-4 h-4" />
          </Button>

          {/* Font Size */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {fontSizes.map((size) => (
              <Button
                key={size.key}
                variant={fontSize === size.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFontSize(size.key)}
                className={cn(
                  'w-7 h-7 text-xs',
                  fontSize === size.key && 'bg-primary text-primary-foreground'
                )}
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};