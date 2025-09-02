import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Bell, Sun, Moon, Globe, Type, Settings, ChevronDown, MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button, Switch, Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
import { useDashboard } from './DashboardLayout';
import { AlertDropdown } from './AlertDropdown';
import { UserDropdown } from './UserDropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { themeAtom, fontSizeAtom, languageAtom, selectedSiteAtom } from '@/shared/store/dashboardStore';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use global jotai atoms directly
  const [theme, setTheme] = useAtom(themeAtom);
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [language, setLanguage] = useAtom(languageAtom);
  const [selectedSite, setSelectedSite] = useAtom(selectedSiteAtom);
  
  // Try to use Dashboard context for activeTab
  let dashboardContext;
  try {
    dashboardContext = useDashboard();
  } catch {
    dashboardContext = null;
  }

  // Local state for activeTab when no dashboard context
  const [localActiveTab, setLocalActiveTab] = useState<'overview' | 'monitoring' | 'stats' | 'admin'>('overview');
  const activeTab = dashboardContext?.activeTab || localActiveTab;
  const setActiveTab = dashboardContext?.setActiveTab || setLocalActiveTab;


  const handleTitleClick = () => {
    navigate('/');
  };
  
  const tabs = [
    { key: 'overview' as const, label: language === 'ko' ? '개요' : 'Overview' },
    { key: 'monitoring' as const, label: language === 'ko' ? '모니터링' : 'Monitoring' },
    { key: 'stats' as const, label: language === 'ko' ? '통계' : 'Stats' },
    ...(user?.level === 'admin' ? [{ key: 'admin' as const, label: language === 'ko' ? '관리자' : 'Admin' }] : []),
  ];

  const fontSizes = [
    { key: 'small' as const, label: 'S' },
    { key: 'medium' as const, label: 'M' },
    { key: 'large' as const, label: 'L' },
  ];

  // Available sites - based on real data
  const availableSites = ['R&T', 'SUNGNAM'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 relative">
        {/* Logo with Site Selector */}
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-8 h-8 bg-gradient-blue rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 
            className="font-bold text-lg lg:text-xl text-foreground truncate cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleTitleClick}
          >
            Atronet
          </h1>
          
          {/* Site Selector - only show when dashboard context is available */}
          {dashboardContext && (
            <div className="hidden sm:block">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-3 h-8 px-2 text-xs bg-muted/50 hover:font-bold hover:bg-muted hover:text-black"
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedSite}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start" side="bottom" sideOffset={4}>
                  <div className="flex flex-col space-y-1">
                    {availableSites.map((site) => (
                      <Button
                        key={site}
                        variant={selectedSite === site ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedSite(site)}
                        className="justify-start w-full text-xs"
                      >
                        <MapPin className="w-3 h-3 mr-2" />
                        {site}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-muted rounded-lg p-1 absolute left-1/2 -translate-x-1/2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-sm hover:text-white' 
                  : 'text-muted-foreground hover:text-primary-foreground'
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
          {/* Alert Dropdown - only show when dashboard context is available */}
          {dashboardContext ? (
            <AlertDropdown />
          ) : (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          )}
          
          {/* User Dropdown */}
          <UserDropdown language={language} />
          
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
          <div className="hidden lg:block">
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
          </div>

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

    </nav>
  );
};