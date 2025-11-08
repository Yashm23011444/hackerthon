import React from 'react';
import {
  X,
  Type,
  Gauge,
  Moon,
  Sun,
  Maximize2,
  Eye,
  Palette,
  Keyboard,
  Zap,
} from 'lucide-react';

const AccessibilitySettingsPanel = ({ isOpen, onClose, settings, updateSettings }) => {
  if (!isOpen) return null;

  const colorBlindModes = [
    { 
      value: 'none', 
      label: 'Normal Vision', 
      color: 'bg-gray-200',
      description: 'Default color display'
    },
    { 
      value: 'protanopia', 
      label: 'Protanopia', 
      color: 'bg-red-200',
      description: 'Red-blind (1% of males)'
    },
    { 
      value: 'deuteranopia', 
      label: 'Deuteranopia', 
      color: 'bg-green-200',
      description: 'Green-blind (most common)'
    },
    { 
      value: 'tritanopia', 
      label: 'Tritanopia', 
      color: 'bg-blue-200',
      description: 'Blue-blind (very rare)'
    },
  ];

  const toggles = [
    { 
      key: 'darkMode', 
      label: 'Dark Mode', 
      icon: Moon, 
      description: 'Reduce eye strain in low light'
    },
    { 
      key: 'highContrast', 
      label: 'High Contrast', 
      icon: Eye, 
      description: 'Better visibility for low vision'
    },
    { 
      key: 'reducedMotion', 
      label: 'Reduced Motion', 
      icon: Zap, 
      description: 'Stop animations (helps with vestibular disorders)'
    },
    { 
      key: 'screenReader', 
      label: 'Screen Reader Mode', 
      icon: Eye, 
      description: 'Optimize for NVDA, JAWS, VoiceOver'
    },
    { 
      key: 'keyboardShortcuts', 
      label: 'Keyboard Shortcuts', 
      icon: Keyboard, 
      description: 'Enable hotkeys (Press ? to view)'
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Accessibility Settings</h2>
            <p className="text-blue-100 text-sm mt-1">Customize your experience</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Font Size */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Type className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Text Size</h3>
            </div>
            <div className="space-y-3">
              <input
                type="range"
                min="12"
                max="32"
                value={settings.fontSize}
                onChange={(e) =>
                  updateSettings({ fontSize: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">12px</span>
                <span className="text-lg font-bold text-blue-600">
                  {settings.fontSize}px
                </span>
                <span className="text-sm text-gray-600">32px</span>
              </div>
              <p
                className="text-gray-700 p-3 bg-gray-50 rounded-lg"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                Sample text preview
              </p>
            </div>
          </div>

          {/* Voice Speed */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Gauge className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Voice Speed</h3>
            </div>
            <div className="space-y-3">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) =>
                  updateSettings({ voiceSpeed: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">0.5x</span>
                <span className="text-lg font-bold text-purple-600">
                  {settings.voiceSpeed}x
                </span>
                <span className="text-sm text-gray-600">2x</span>
              </div>
              <p className="text-xs text-gray-500">
                Adjust text-to-speech reading speed
              </p>
            </div>
          </div>

          {/* Color Blind Mode */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Color Blind Mode</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Adjust colors to simulate or compensate for color vision deficiencies
            </p>
            <div className="grid grid-cols-1 gap-3">
              {colorBlindModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() =>
                    updateSettings({ colorBlindMode: mode.value })
                  }
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    settings.colorBlindMode === mode.value
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${mode.color} flex-shrink-0`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {mode.label}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {mode.description}
                      </p>
                    </div>
                    {settings.colorBlindMode === mode.value && (
                      <div className="text-green-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Color Blindness Information */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                ℹ️ About Color Vision Deficiencies
              </h4>
              <div className="text-xs text-blue-800 space-y-2">
                <p>
                  <strong>Not diseases!</strong> These are genetic vision traits affecting how cone cells in the eye perceive colors.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Protanopia:</strong> Red-blind (1% of males) - Reds appear brown/gray</li>
                  <li><strong>Deuteranopia:</strong> Green-blind (5% of males) - Most common type</li>
                  <li><strong>Tritanopia:</strong> Blue-blind (Very rare) - Blues appear greenish</li>
                </ul>
                <p className="text-blue-700 mt-2">
                  💡 Activate a mode to see how people with these conditions perceive colors.
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Maximize2 className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
            </div>
            <div className="space-y-3">
              {toggles.map((toggle) => {
                const Icon = toggle.icon;
                return (
                  <div
                    key={toggle.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{toggle.label}</p>
                        <p className="text-xs text-gray-500">{toggle.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        updateSettings({ [toggle.key]: !settings[toggle.key] })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[toggle.key] ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Toggle ${toggle.label}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[toggle.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  updateSettings({
                    fontSize: 16,
                    voiceSpeed: 1,
                    colorBlindMode: 'none',
                    darkMode: false,
                    highContrast: false,
                    reducedMotion: false,
                  })
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Reset All
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Keyboard className="w-4 h-4 mr-2" />
              Keyboard Shortcuts
            </h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p><kbd className="px-2 py-1 bg-white rounded">A</kbd> Open this panel</p>
              <p><kbd className="px-2 py-1 bg-white rounded">T</kbd> Increase text size</p>
              <p><kbd className="px-2 py-1 bg-white rounded">H</kbd> Toggle high contrast</p>
              <p><kbd className="px-2 py-1 bg-white rounded">M</kbd> Toggle dark mode</p>
              <p><kbd className="px-2 py-1 bg-white rounded">?</kbd> Show all shortcuts</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilitySettingsPanel;
