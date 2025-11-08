import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Slack,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Video,
  Zap,
  CheckCircle,
  ExternalLink,
  X,
  Info,
} from 'lucide-react';

const Integration = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [connectedApps, setConnectedApps] = useState([]);

  // Load connected apps from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('connectedApps');
    if (saved) {
      try {
        setConnectedApps(JSON.parse(saved));
      } catch (e) {
      }
    }
  }, []);

  const integrations = [
    {
      name: 'Slack',
      icon: <Slack className="w-8 h-8" />,
      description: 'Team communication with voice commands',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Voice-to-text', 'Auto-translate', 'Screen reader'],
      url: 'https://slack.com',
      setupSteps: [
        'Click "Connect" to authorize Slack',
        'Grant permissions for voice commands',
        'Configure your accessibility preferences',
        'Start using voice-to-text in Slack channels'
      ],
    },
    {
      name: 'Microsoft Teams',
      icon: <Video className="w-8 h-8" />,
      description: 'Video meetings with live captions',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Live captions', 'Sign language', 'Voice control'],
      url: 'https://teams.microsoft.com',
      setupSteps: [
        'Authenticate with your Microsoft account',
        'Enable live captions for meetings',
        'Configure voice control settings',
        'Test accessibility features in a meeting'
      ],
    },
    {
      name: 'Google Workspace',
      icon: <Mail className="w-8 h-8" />,
      description: 'Email and docs with accessibility',
      gradient: 'from-orange-500 to-red-500',
      features: ['Voice dictation', 'Smart compose', 'Read aloud'],
      url: 'https://workspace.google.com',
      setupSteps: [
        'Sign in with your Google account',
        'Allow access to Gmail and Docs',
        'Enable voice dictation in settings',
        'Start composing emails with voice'
      ],
    },
    {
      name: 'Zoom',
      icon: <MessageSquare className="w-8 h-8" />,
      description: 'Accessible video conferencing',
      gradient: 'from-indigo-500 to-blue-500',
      features: ['Captions', 'Keyboard shortcuts', 'Focus mode'],
      url: 'https://zoom.us',
      setupSteps: [
        'Connect your Zoom account',
        'Enable automated captions',
        'Configure keyboard shortcuts',
        'Join meetings with accessibility features'
      ],
    },
    {
      name: 'Jira',
      icon: <FileText className="w-8 h-8" />,
      description: 'Project management made accessible',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Voice navigation', 'Custom views', 'Shortcuts'],
      url: 'https://www.atlassian.com/software/jira',
      setupSteps: [
        'Link your Jira workspace',
        'Set up voice navigation commands',
        'Customize accessible board views',
        'Create tasks using voice commands'
      ],
    },
    {
      name: 'Calendar',
      icon: <Calendar className="w-8 h-8" />,
      description: 'Schedule with voice assistance',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Voice scheduling', 'Smart reminders', 'Time zones'],
      url: 'https://calendar.google.com',
      setupSteps: [
        'Connect your calendar account',
        'Grant scheduling permissions',
        'Set up voice commands for events',
        'Schedule meetings with voice assistant'
      ],
    },
  ];

  const benefits = [
    {
      title: 'One-Click Setup',
      description: 'Connect your favorite tools in seconds with pre-built integrations',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'Seamless Sync',
      description: 'Real-time data synchronization across all your workplace tools',
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: 'Universal Accessibility',
      description: 'Consistent accessibility features across all integrated platforms',
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: 'Custom Workflows',
      description: 'Build personalized workflows that adapt to your needs',
      icon: <CheckCircle className="w-6 h-6" />,
    },
  ];

  const handleConnect = (integration) => {
    setSelectedIntegration(integration);
    setShowModal(true);
  };

  const handleConfirmConnect = () => {
    if (selectedIntegration && !connectedApps.includes(selectedIntegration.name)) {
      const updated = [...connectedApps, selectedIntegration.name];
      setConnectedApps(updated);
      localStorage.setItem('connectedApps', JSON.stringify(updated));
    }
    setShowModal(false);
  };

  const handleViewAll = () => {
    const integrationSection = document.getElementById('integration');
    if (integrationSection) {
      integrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="integration" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Seamless Integration
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works With Your Tools
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with popular workplace tools and enhance them with powerful
            accessibility features.
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${integration.gradient}`}></div>
              <div className="p-6">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${integration.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {integration.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {integration.name}
                </h3>
                <p className="text-gray-600 mb-4">{integration.description}</p>
                
                <div className="space-y-2 mb-4">
                  {integration.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleConnect(integration)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    connectedApps.includes(integration.name)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {connectedApps.includes(integration.name) ? (
                    <span className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Connected</span>
                    </span>
                  ) : (
                    'Connect'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose Our Integrations?
            </span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-white rounded-xl p-6 shadow-md"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={handleViewAll}
              className="button-primary"
            >
              View All Integrations
            </button>
          </div>
        </div>

        {/* Connection Modal */}
        <AnimatePresence>
          {showModal && selectedIntegration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${selectedIntegration.gradient} p-6 text-white relative`}>
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {selectedIntegration.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedIntegration.name}</h3>
                      <p className="text-white/90 text-sm">{selectedIntegration.description}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Info Banner */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        This will redirect you to <strong>{selectedIntegration.name}</strong> to authorize access. 
                        Your accessibility settings will be applied automatically.
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features you'll get:</h4>
                    <div className="space-y-2">
                      {selectedIntegration.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Setup Steps */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick setup (4 steps):</h4>
                    <div className="space-y-3">
                      {selectedIntegration.setupSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 pt-0.5">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmConnect}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 bg-gradient-to-r ${selectedIntegration.gradient} text-white hover:opacity-90`}
                    >
                      <span>{connectedApps.includes(selectedIntegration.name) ? 'Connected' : 'Connect Now'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Demo Note */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                    💡 Demo mode: Connection will be saved locally
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Integration;
