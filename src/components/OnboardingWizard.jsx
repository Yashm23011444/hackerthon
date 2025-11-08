import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Ear,
  Hand,
  Brain,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Volume2,
  Type,
  Palette,
  Gauge,
  Moon,
  Sun,
  Keyboard,
} from 'lucide-react';

const OnboardingWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [settings, setSettings] = useState({
    fontSize: 16,
    voiceSpeed: 1.0,
    highContrast: false,
    darkMode: false,
    reducedMotion: false,
    colorBlindMode: 'none',
    keyboardShortcuts: true,
  });

  const needsCategories = [
    {
      id: 'visual',
      name: 'Visual',
      description: 'Assistance with seeing and reading.',
      icon: <Eye className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      presets: {
        fontSize: 20,
        highContrast: true,
        voiceSpeed: 0.9,
      },
    },
    {
      id: 'auditory',
      name: 'Auditory',
      description: 'Support for hearing and audio.',
      icon: <Ear className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-500',
      presets: {
        fontSize: 18,
        highContrast: false,
      },
    },
    {
      id: 'motor',
      name: 'Motor',
      description: 'Help with physical interaction.',
      icon: <Hand className="w-8 h-8" />,
      gradient: 'from-orange-500 to-red-500',
      presets: {
        fontSize: 18,
        reducedMotion: true,
        keyboardShortcuts: true,
      },
    },
    {
      id: 'cognitive',
      name: 'Cognitive',
      description: 'Aids for focus and processing.',
      icon: <Brain className="w-8 h-8" />,
      gradient: 'from-green-500 to-emerald-500',
      presets: {
        fontSize: 18,
        reducedMotion: true,
      },
    },
  ];

  const steps = [
    {
      title: 'Welcome to NEXUS',
      subtitle: "Let's personalize your workspace for a more inclusive and productive experience.",
      component: 'welcome',
    },
    {
      title: 'Tell us about your needs',
      subtitle: 'Select a category that best describes your needs.',
      component: 'needs',
    },
    {
      title: 'Customize Your Settings',
      subtitle: 'Fine-tune your experience with these options.',
      component: 'settings',
    },
    {
      title: "You're All Set!",
      subtitle: 'Your personalized workspace is ready.',
      component: 'complete',
    },
  ];

  const toggleNeed = (needId) => {
    if (selectedNeeds.includes(needId)) {
      setSelectedNeeds(selectedNeeds.filter((id) => id !== needId));
    } else {
      setSelectedNeeds([...selectedNeeds, needId]);
      // Apply preset settings
      const category = needsCategories.find((cat) => cat.id === needId);
      if (category) {
        setSettings((prev) => ({ ...prev, ...category.presets }));
      }
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const finalSettings = {
        ...settings,
        selectedNeeds,
        onboardingCompleted: true,
      };
      localStorage.setItem('nexus-settings', JSON.stringify(finalSettings));
      onComplete(finalSettings);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    const defaultSettings = {
      ...settings,
      onboardingCompleted: true,
    };
    localStorage.setItem('nexus-settings', JSON.stringify(defaultSettings));
    onComplete(defaultSettings);
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.component) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We believe everyone deserves an inclusive workplace. Let's set up your
              personalized experience in just a few steps.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: <Volume2 />, label: 'Voice Assistant' },
                { icon: <Type />, label: 'Custom Text Size' },
                { icon: <Palette />, label: 'Color Modes' },
                { icon: <Keyboard />, label: 'Keyboard Nav' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 flex flex-col items-center space-y-2"
                >
                  <div className="text-blue-600">{feature.icon}</div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'needs':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {needsCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => toggleNeed(category.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-8 rounded-2xl border-3 transition-all text-left ${
                    selectedNeeds.includes(category.id)
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {selectedNeeds.includes(category.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white mb-4`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </motion.button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              You can select multiple categories
            </p>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-8 max-w-3xl mx-auto"
          >
            <div className="space-y-6">
              {/* Text Size */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Type className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Text Size</h4>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  value={settings.fontSize}
                  onChange={(e) =>
                    setSettings({ ...settings, fontSize: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-blue-200 rounded-lg"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Small (12px)</span>
                  <span className="font-semibold text-blue-600">
                    {settings.fontSize}px
                  </span>
                  <span>Large (28px)</span>
                </div>
                <div
                  className="mt-4 p-4 bg-gray-50 rounded-xl"
                  style={{ fontSize: `${settings.fontSize}px` }}
                >
                  Sample text preview
                </div>
              </div>

              {/* Voice Speed */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Gauge className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Voice Speed</h4>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voiceSpeed}
                  onChange={(e) =>
                    setSettings({ ...settings, voiceSpeed: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-purple-200 rounded-lg"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Slow (0.5x)</span>
                  <span className="font-semibold text-purple-600">
                    {settings.voiceSpeed}x
                  </span>
                  <span>Fast (2x)</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Additional Options</h4>
                <div className="space-y-3">
                  {[
                    { key: 'highContrast', label: 'High Contrast Mode', icon: <Sun /> },
                    { key: 'darkMode', label: 'Dark Mode', icon: <Moon /> },
                    { key: 'reducedMotion', label: 'Reduced Motion', icon: <Gauge /> },
                    {
                      key: 'keyboardShortcuts',
                      label: 'Keyboard Shortcuts',
                      icon: <Keyboard />,
                    },
                  ].map((toggle) => (
                    <label
                      key={toggle.key}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-600">{toggle.icon}</div>
                        <span className="font-medium text-gray-900">{toggle.label}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings[toggle.key]}
                          onChange={(e) =>
                            setSettings({ ...settings, [toggle.key]: e.target.checked })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-14 h-7 rounded-full transition-colors ${
                            settings[toggle.key] ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-1 ${
                              settings[toggle.key] ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-block mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <Check className="w-20 h-20 text-white" />
              </div>
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Your Workspace is Ready!
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We've personalized NEXUS based on your preferences. You can always
              change these settings later.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-600">
                  {selectedNeeds.length}
                </p>
                <p className="text-sm text-gray-600">Needs Selected</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-600">
                  {settings.fontSize}px
                </p>
                <p className="text-sm text-gray-600">Text Size</p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NEXUS
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-lg text-gray-600">{steps[currentStep].subtitle}</p>
                </div>
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white border-t border-gray-200 py-6 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
