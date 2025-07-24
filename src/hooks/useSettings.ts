import { useState, useEffect, useCallback } from 'react';
import { lightTheme, darkTheme, compactSpacing, Theme } from '../styles/theme';

export interface AppSettings {
  // Appearance
  darkMode: boolean;
  compactView: boolean;
  
  // Notifications
  expenseAlerts: boolean;
  billReminders: boolean;
  budgetWarnings: boolean;
  emailNotifications: boolean;
  
  // Financial
  currency: string;
  budgetPeriod: string;
  monthlyBudget: string;
  
  // Privacy
  autoBackup: boolean;
  dataEncryption: boolean;
  
  // Family Settings
  familyMembers: string;
  sharedAccess: boolean;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  compactView: false,
  expenseAlerts: true,
  billReminders: true,
  budgetWarnings: true,
  emailNotifications: false,
  currency: 'USD',
  budgetPeriod: 'monthly',
  monthlyBudget: '5000',
  autoBackup: true,
  dataEncryption: true,
  familyMembers: '4',
  sharedAccess: false
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('prewittbook-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
    return defaultSettings;
  });

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('prewittbook-settings', JSON.stringify(updated));
        console.log('Settings saved successfully:', Object.keys(newSettings));
      } catch (error) {
        console.error('Failed to save settings:', error);
        // Try to clear space and retry
        try {
          localStorage.removeItem('temp-settings');
          localStorage.setItem('prewittbook-settings', JSON.stringify(updated));
          console.log('Settings saved on retry');
        } catch (retryError) {
          console.error('Critical: Unable to save settings to local storage', retryError);
          // Settings will still work in memory for this session
        }
      }
      return updated;
    });
  }, []);

  const getTheme = useCallback((): Theme => {
    const baseTheme = settings.darkMode ? darkTheme : lightTheme;
    
    if (settings.compactView) {
      return {
        ...baseTheme,
        spacing: compactSpacing
      };
    }
    
    return baseTheme;
  }, [settings.darkMode, settings.compactView]);

  const applySettings = useCallback(() => {
    // Force a re-render by updating a state value
    console.log('Applying settings:', settings);
  }, [settings]);

  useEffect(() => {
    applySettings();
  }, [applySettings]);

  return {
    settings,
    updateSettings,
    applySettings,
    theme: getTheme()
  };
};