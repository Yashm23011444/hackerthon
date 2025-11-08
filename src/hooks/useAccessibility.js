import { useState, useEffect } from 'react';

const defaultSettings = {
  fontSize: 16,
  voiceSpeed: 1.0,
  highContrast: false,
  darkMode: false,
  reducedMotion: false,
  colorBlindMode: 'none',
  keyboardShortcuts: true,
  screenReader: false,
  selectedNeeds: [],
  onboardingCompleted: false,
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('nexus-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nexus-settings', JSON.stringify(settings));
      applySettings(settings);
    }
  }, [settings, isLoaded]);

  // Apply settings to DOM
  const applySettings = (settings) => {
    const root = document.documentElement;

    // Font size
    root.style.setProperty('--base-font-size', `${settings.fontSize}px`);

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Color blind modes
    root.classList.remove(
      'colorblind-protanopia',
      'colorblind-deuteranopia',
      'colorblind-tritanopia'
    );
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${settings.colorBlindMode}`);
    }
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('nexus-settings');
  };

  const completeOnboarding = (onboardingSettings) => {
    setSettings({
      ...settings,
      ...onboardingSettings,
      onboardingCompleted: true,
    });
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    completeOnboarding,
    isLoaded,
  };
};
