import React from 'react';
import { Bell, Sun, Moon, Globe, Type, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDashboard2 } from './DashboardLayout2';
import { AlertDropdown2 } from './AlertDropdown2';

export const Navigation2: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    fontSize, 
    setFontSize, 
    theme, 
    setTheme, 
    language, 
    setLanguage 
  } = useDashboard2();

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
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-8 h-8 bg-gradient-blue rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-lg lg:text-xl text-foreground truncate">
            {language === 'ko' ? '폐기물 처리 시스템 (Design 2)' : 'Waste Processing System (Design 2)'}
          </span>
        </div>

        {/* Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'transition-all duration-200',
                activeTab === tab.key 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground'
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Mobile Tab Dropdown */}
        <div className="flex md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                {tabs.find(tab => tab.key === activeTab)?.label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="center">
              <div className="flex flex-col space-y-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab.key)}
                    className="justify-start w-full"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* Alert Dropdown */}
          <AlertDropdown2 />
          
          {/* Theme Toggle */}
          <div className="hidden sm:flex items-center space-x-2 bg-muted rounded-lg p-2">
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

          {/* Language Toggle */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="w-9 h-9"
              >
                <Globe className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end" side="bottom" sideOffset={8}>
              <div className="flex flex-col space-y-1">
                <Button
                  variant={language === 'ko' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('ko')}
                  className="justify-start w-full"
                >
                  <span className="text-lg mr-2">🇰🇷</span>
                  한국어
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className="justify-start w-full"
                >
                  <span className="text-lg mr-2">🇺🇸</span>
                  English
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Font Size */}
          <div className="hidden lg:flex items-center space-x-1 bg-muted rounded-lg p-1">
            {fontSizes.map((size) => (
              <Button
                key={size.key}
                variant={fontSize === size.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFontSize(size.key)}
                className={cn(
                  'w-7 h-7 text-xs',
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

      {/* Floating Settings Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" className="rounded-full shadow-lg">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48">
            <div className="p-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
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
                <span className="text-sm font-medium">Language</span>
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
                <span className="text-sm font-medium">Font Size</span>
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
    </nav>
  );
};