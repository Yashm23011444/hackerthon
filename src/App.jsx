import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import VoiceAssistant from './components/VoiceAssistant';
import AccessibilityPanel from './components/AccessibilityPanel';
import AccessibilitySettingsPanel from './components/AccessibilitySettingsPanel';
import JobMatching from './components/JobMatching';
import Integration from './components/Integration';
import IntegrationManager from './components/IntegrationManager';
import Footer from './components/Footer';
import OnboardingWizard from './components/OnboardingWizard';
import KeyboardShortcutsOverlay from './components/KeyboardShortcutsOverlay';
import { useAccessibility } from './hooks/useAccessibility';
import { Settings } from 'lucide-react';

function App() {
  const { settings, updateSettings, completeOnboarding, isLoaded } = useAccessibility();
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const jobMatchingRef = useRef(null);

  // Handler for Get Started button - opens profile form
  const handleGetStarted = () => {
    if (jobMatchingRef.current) {
      jobMatchingRef.current.openProfileForm();
      // Scroll to jobs section
      setTimeout(() => {
        const jobsSection = document.getElementById('jobs');
        if (jobsSection) {
          jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!settings.keyboardShortcuts) return;

    const handleKeyPress = (e) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Show keyboard shortcuts overlay
      if (e.key === '?') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }

      // Toggle accessibility panel
      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setShowAccessibilityPanel((prev) => !prev);
      }

      // Close modals
      if (e.key === 'Escape') {
        setShowAccessibilityPanel(false);
        setShowKeyboardShortcuts(false);
      }

      // Text size controls
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        if (e.shiftKey) {
          // Decrease
          updateSettings({
            fontSize: Math.max(12, settings.fontSize - 2),
          });
        } else {
          // Increase
          updateSettings({
            fontSize: Math.min(32, settings.fontSize + 2),
          });
        }
      }

      // Toggle high contrast
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        updateSettings({ highContrast: !settings.highContrast });
      }

      // Toggle dark mode
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        updateSettings({ darkMode: !settings.darkMode });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settings, updateSettings]);

  // Show onboarding if not completed
  if (isLoaded && !settings.onboardingCompleted) {
    return <OnboardingWizard onComplete={completeOnboarding} />;
  }

  // Don't render until settings are loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar onGetStartedClick={handleGetStarted} />
      <Hero />
      <Features />
      <VoiceAssistant accessibilitySettings={settings} />
      <AccessibilityPanel settings={settings} setSettings={updateSettings} />
      <JobMatching ref={jobMatchingRef} />
      <Integration />
      <section id="integrations" className="py-20 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <IntegrationManager />
      </section>
      <Footer />

      {/* Floating Accessibility Button */}
      <button
        onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-40"
        aria-label="Toggle accessibility panel"
        title="Accessibility Settings (Press 'A')"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Keyboard Shortcuts Help Button */}
      <button
        onClick={() => setShowKeyboardShortcuts(true)}
        className="fixed bottom-6 right-24 w-14 h-14 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 border-2 border-gray-200"
        aria-label="Show keyboard shortcuts"
        title="Keyboard Shortcuts (Press '?')"
      >
        <span className="text-xl font-bold">?</span>
      </button>

      {/* Modals */}
      <AccessibilitySettingsPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
        settings={settings}
        updateSettings={updateSettings}
      />
      
      <KeyboardShortcutsOverlay
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
}

export default App;
