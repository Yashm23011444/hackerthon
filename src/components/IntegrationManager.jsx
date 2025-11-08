import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Video, 
  MessageSquare, 
  Users,
  Check,
  Loader,
  X,
  Plus
} from 'lucide-react';
import {
  SlackIntegration,
  ZoomIntegration,
  TeamsIntegration
} from '../services/integrationService';

const IntegrationManager = () => {
  const [connections, setConnections] = useState({
    teams: false,
    slack: false,
    zoom: false
  });
  const [loading, setLoading] = useState({});
  const [showActionModal, setShowActionModal] = useState(null);
  const [actionData, setActionData] = useState({});
  const [results, setResults] = useState({});

  // Initialize services
  const [slackService] = useState(() => new SlackIntegration());
  const [zoomService] = useState(() => new ZoomIntegration());
  const [teamsService] = useState(() => new TeamsIntegration());

  // Check existing connections on mount
  useEffect(() => {
    setConnections({
      slack: slackService.isConnected(),
      zoom: zoomService.isConnected(),
      teams: teamsService.isConnected()
    });
  }, [slackService, zoomService, teamsService]);

  const integrations = [
    {
      id: 'teams',
      name: 'Microsoft Teams',
      logo: (
        <svg className="w-16 h-16" viewBox="0 0 48 48">
          <path fill="#5059C9" d="M44,18v16c0,2.2-1.8,4-4,4H28V18H44z"/>
          <path fill="#7B83EB" d="M28,18v20H12c-2.2,0-4-1.8-4-4V18H28z"/>
          <circle fill="#FFF" cx="28" cy="28" r="10"/>
          <path fill="#5059C9" d="M31,25h-6v-2h6V25z M31,27h-6v2h6V27z M31,31h-6v2h6V31z"/>
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      description: 'Create meetings, send messages, collaborate',
      connected: connections.teams,
      actions: [],
      onConnect: () => teamsService.connect()
    },
    {
      id: 'slack',
      name: 'Slack',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 48 48">
          <path fill="#33d375" d="M33,8c0-2.209-1.791-4-4-4s-4,1.791-4,4c0,2.209,1.791,4,4,4h4V8z"/>
          <path fill="#33d375" d="M35,8c0,2.209,1.791,4,4,4s4-1.791,4-4s-1.791-4-4-4v4H35z"/>
          <path fill="#40c4ff" d="M40,23c2.209,0,4-1.791,4-4s-1.791-4-4-4s-4,1.791-4,4v4H40z"/>
          <path fill="#40c4ff" d="M40,25c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4h-4V25z"/>
          <path fill="#e91e63" d="M15,40c0,2.209,1.791,4,4,4s4-1.791,4-4s-1.791-4-4-4h-4V40z"/>
          <path fill="#e91e63" d="M13,40c0-2.209-1.791-4-4-4s-4,1.791-4,4s1.791,4,4,4V40H13z"/>
          <path fill="#ffc107" d="M8,25c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4v-4H8z"/>
          <path fill="#ffc107" d="M8,23c2.209,0,4-1.791,4-4s-1.791-4-4-4s-4,1.791-4,4H8V23z"/>
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      description: 'Send messages, create channels',
      connected: connections.slack,
      actions: [],
      onConnect: () => slackService.connect()
    },
    {
      id: 'zoom',
      name: 'Zoom',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 48 48">
          <path fill="#2196F3" d="M41,42H13c-2.761,0-5-2.239-5-5V11c0-2.761,2.239-5,5-5h28c2.761,0,5,2.239,5,5v26C46,39.761,43.761,42,41,42z"/>
          <path fill="#FFF" d="M16 20h14v8H16zM35 20l-5 4 5 4z"/>
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-600',
      description: 'Schedule meetings, join calls',
      connected: connections.zoom,
      actions: [],
      onConnect: () => zoomService.connect()
    }
  ];

  const getDefaultTime = () => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Integration Hub
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Connect NEXUS to your favorite productivity tools
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {integration.logo}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {integration.description}
                  </p>
                </div>
              </div>
              {integration.connected && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    Connected
                  </span>
                </div>
              )}
            </div>

            {!integration.connected ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={integration.onConnect}
                disabled={loading[integration.id]}
                className={`w-full py-3 bg-gradient-to-r ${integration.color} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
              >
                {loading[integration.id] ? (
                  <Loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Connect
                  </span>
                )}
              </motion.button>
            ) : (
              <div className="space-y-2">
                {integration.actions.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className="w-full py-2 px-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {action.icon}
                    {action.label}
                  </motion.button>
                ))}
              </div>
            )}

            {results[integration.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <p className="text-sm text-green-700 dark:text-green-400">
                  {results[integration.id].message || 'Action completed!'}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default IntegrationManager;
