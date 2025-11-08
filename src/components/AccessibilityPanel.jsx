import React, { useState } from 'react';
import {
  Settings,
  Eye,
  Ear,
  Hand,
  Brain,
  Type,
  Palette,
  Gauge,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const AccessibilityPanel = ({ settings, setSettings }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateSetting = (key, value) => {
    // Call the parent's setSettings to update global accessibility settings
    setSettings({ [key]: value });
  };

  const accessibilityProfiles = [
    {
      name: 'Visual Impairment',
      icon: <Eye className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Screen Reader', 'High Contrast', 'Large Text'],
      preset: {
        fontSize: 20,
        highContrast: true,
        screenReader: true,
        voiceSpeed: 0.8,
      },
    },
    {
      name: 'Hearing Impairment',
      icon: <Ear className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500',
      features: ['Visual Alerts', 'Captions', 'Sign Language'],
      preset: {
        fontSize: 16,
        highContrast: false,
        screenReader: false,
      },
    },
    {
      name: 'Motor Disability',
      icon: <Hand className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500',
      features: ['Voice Control', 'Keyboard Nav', 'Large Buttons'],
      preset: {
        fontSize: 18,
        reducedMotion: true,
      },
    },
    {
      name: 'Cognitive Disability',
      icon: <Brain className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-500',
      features: ['Simple Language', 'Reduced Motion', 'Clear Layout'],
      preset: {
        fontSize: 18,
        reducedMotion: true,
      },
    },
  ];

  const colorBlindModes = [
    { value: 'none', label: 'None', color: 'bg-gray-200' },
    { value: 'protanopia', label: 'Protanopia', color: 'bg-red-300' },
    { value: 'deuteranopia', label: 'Deuteranopia', color: 'bg-green-300' },
    { value: 'tritanopia', label: 'Tritanopia', color: 'bg-blue-300' },
  ];

  return (
    <section id="accessibility" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full mb-6">
            <Settings className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Personalized Accessibility
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Customize Your Experience
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered accessibility settings that adapt to your unique needs
            and preferences.
          </p>
        </div>

        {/* Quick Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {accessibilityProfiles.map((profile, index) => (
            <div
              key={index}
              onClick={() => setSettings(profile.preset)}
              className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${profile.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                {profile.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {profile.name}
              </h3>
              <ul className="space-y-1">
                {profile.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Detailed Settings Panel */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Advanced Settings
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              {isExpanded ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Text Size Control */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <Type className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Text Size</h4>
              </div>
              <div className="space-y-4">
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Small</span>
                  <span className="font-semibold text-blue-600">
                    {settings.fontSize}px
                  </span>
                  <span>Large</span>
                </div>
                <div
                  className="p-4 bg-gray-50 rounded-xl"
                  style={{ fontSize: `${settings.fontSize}px` }}
                >
                  Sample text preview
                </div>
              </div>
            </div>

            {/* Voice Speed Control */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <Gauge className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">Voice Speed</h4>
              </div>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voiceSpeed}
                  onChange={(e) => updateSetting('voiceSpeed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Slow</span>
                  <span className="font-semibold text-purple-600">
                    {settings.voiceSpeed}x
                  </span>
                  <span>Fast</span>
                </div>
              </div>
            </div>

            {/* Color Blind Mode */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-5 h-5 text-pink-600" />
                <h4 className="font-semibold text-gray-900">Color Blind Mode</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {colorBlindModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => updateSetting('colorBlindMode', mode.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      settings.colorBlindMode === mode.value
                        ? 'border-pink-600 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 ${mode.color} rounded-lg mb-2`}></div>
                    <span className="text-sm font-medium">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-4">Quick Toggles</h4>
              <div className="space-y-3">
                {[
                  { key: 'highContrast', label: 'High Contrast', icon: <Sun className="w-4 h-4" /> },
                  { key: 'screenReader', label: 'Screen Reader', icon: <Eye className="w-4 h-4" /> },
                  { key: 'reducedMotion', label: 'Reduced Motion', icon: <Minimize2 className="w-4 h-4" /> },
                ].map((toggle) => (
                  <label
                    key={toggle.key}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600">{toggle.icon}</div>
                      <span className="font-medium text-gray-900">{toggle.label}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings[toggle.key]}
                        onChange={(e) => updateSetting(toggle.key, e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-14 h-7 rounded-full transition-colors ${
                          settings[toggle.key] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            settings[toggle.key] ? 'translate-x-8' : 'translate-x-1'
                          } mt-1`}
                        ></div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button className="button-primary">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessibilityPanel;
