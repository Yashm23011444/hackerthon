import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Video, 
  Calendar, 
  MessageSquare, 
  Users,
  Check,
  Loader,
  ExternalLink,
  X,
  Plus,
  Send,
  Upload,
  Clock
} from 'lucide-react';
import {
  GoogleWorkspaceIntegration,
  SlackIntegration,
  ZoomIntegration,
  TeamsIntegration
} from '../services/integrationService';

const IntegrationManager = () => {
  const [connections, setConnections] = useState({
    google: false,
    slack: false,
    zoom: false,
    teams: false
  });
  const [loading, setLoading] = useState({});
  const [showActionModal, setShowActionModal] = useState(null);
  const [actionData, setActionData] = useState({});
  const [results, setResults] = useState({});

  // Initialize services
  const [googleService] = useState(() => new GoogleWorkspaceIntegration());
  const [slackService] = useState(() => new SlackIntegration());
  const [zoomService] = useState(() => new ZoomIntegration());
  const [teamsService] = useState(() => new TeamsIntegration());

  // Check existing connections on mount
  useEffect(() => {
    setConnections({
      google: googleService.isConnected(),
      slack: slackService.isConnected(),
      zoom: zoomService.isConnected(),
      teams: teamsService.isConnected()
    });
  }, [googleService, slackService, zoomService, teamsService]);

  // Connect to Google Workspace
  const handleGoogleConnect = async () => {
    setLoading({ ...loading, google: true });
    const result = await googleService.connect();
    
    if (result.success) {
      setConnections({ ...connections, google: true });
      setResults({ ...results, google: { type: 'success', message: '✅ Connected to Google Workspace!' } });
    } else {
      setResults({ ...results, google: { type: 'error', message: '❌ ' + (result.error || 'Setup required: Add VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY to .env file') } });
    }
    setLoading({ ...loading, google: false });
  };

  // Create Google Doc
  const handleCreateDoc = async () => {
    if (!actionData.docTitle) {
      alert('Please enter a document title');
      return;
    }

    setLoading({ ...loading, createDoc: true });
    const result = await googleService.createDocument(
      actionData.docTitle,
      actionData.docContent || 'Created from NEXUS Adaptive Workplace Assistant\n\n'
    );
    
    if (result.success) {
      setResults({ ...results, doc: result });
      setShowActionModal(null);
      setActionData({});
      window.open(result.url, '_blank');
    } else {
      alert('Error: ' + result.error);
    }
    setLoading({ ...loading, createDoc: false });
  };

  // Create Google Meet
  const handleCreateMeet = async () => {
    if (!actionData.meetTitle || !actionData.meetTime) {
      alert('Please enter meeting title and time');
      return;
    }

    setLoading({ ...loading, createMeet: true });
    const result = await googleService.createMeeting(
      actionData.meetTitle,
      actionData.meetTime,
      parseInt(actionData.meetDuration) || 60
    );
    
    if (result.success) {
      setResults({ ...results, meet: result });
      setShowActionModal(null);
      setActionData({});
      window.open(result.meetLink, '_blank');
    } else {
      alert('Error: ' + result.error);
    }
    setLoading({ ...loading, createMeet: false });
  };

  // Upload to Drive
  const handleUploadDrive = async () => {
    if (!actionData.fileName || !actionData.fileContent) {
      alert('Please enter file name and content');
      return;
    }

    setLoading({ ...loading, uploadDrive: true });
    const result = await googleService.uploadToDrive(
      actionData.fileName,
      actionData.fileContent,
      'text/plain'
    );
    
    if (result.success) {
      setResults({ ...results, drive: result });
      setShowActionModal(null);
      setActionData({});
      window.open(result.url, '_blank');
    } else {
      alert('Error: ' + result.error);
    }
    setLoading({ ...loading, uploadDrive: false });
  };

  // Send Slack Message
  const handleSlackMessage = async () => {
    if (!actionData.slackChannel || !actionData.slackMessage) {
      alert('Please enter channel and message');
      return;
    }

    setLoading({ ...loading, slackMessage: true });
    const result = await slackService.sendMessage(
      actionData.slackChannel,
      actionData.slackMessage
    );
    
    if (result.success) {
      setResults({ ...results, slack: { type: 'success', message: 'Message sent!' } });
      setShowActionModal(null);
      setActionData({});
    } else {
      alert('Error: ' + result.error);
    }
    setLoading({ ...loading, slackMessage: false });
  };

  // Create Zoom Meeting
  const handleZoomMeeting = async () => {
    if (!actionData.zoomTopic || !actionData.zoomTime) {
      alert('Please enter meeting topic and time');
      return;
    }

    setLoading({ ...loading, zoomMeeting: true });
    const result = await zoomService.createMeeting(
      actionData.zoomTopic,
      actionData.zoomTime,
      parseInt(actionData.zoomDuration) || 60
    );
    
    if (result.success) {
      setResults({ ...results, zoom: result });
      setShowActionModal(null);
      setActionData({});
      window.open(result.joinUrl, '_blank');
    } else {
      alert('Error: ' + result.error);
    }
    setLoading({ ...loading, zoomMeeting: false });
  };

  // Create Teams Meeting
  const handleTeamsMeeting = async () => {
    if (!actionData.teamsSubject || !actionData.teamsTime) {
      alert('Please enter meeting subject and time');
      return;
    }

    setLoading({ ...loading, teamsMeeting: true });
    const result = await teamsService.createMeeting(
      actionData.teamsSubject,
      actionData.teamsTime,
      parseInt(actionData.teamsDuration) || 60
    );
    
    if (result.success) {
      setResults({ ...results, teams: result });
      setShowActionModal(null);
      setActionData({});
      window.open(result.joinUrl, '_blank');
    } else {
      alert('Error: ' + result.error);
    }
    setLoading({ ...loading, teamsMeeting: false });
  };

  const integrations = [
    {
      id: 'google',
      name: 'Google Workspace',
      icon: '🔵',
      color: 'from-blue-500 to-blue-600',
      description: 'Create Docs, Meet links, manage Calendar',
      connected: connections.google,
      actions: [
        {
          id: 'createDoc',
          label: 'Create Document',
          icon: <FileText className="w-4 h-4" />,
          onClick: () => setShowActionModal('createDoc')
        },
        {
          id: 'createMeet',
          label: 'Schedule Meet',
          icon: <Video className="w-4 h-4" />,
          onClick: () => setShowActionModal('createMeet')
        },
        {
          id: 'uploadDrive',
          label: 'Upload to Drive',
          icon: <Upload className="w-4 h-4" />,
          onClick: () => setShowActionModal('uploadDrive')
        }
      ],
      onConnect: handleGoogleConnect
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      color: 'from-purple-500 to-purple-600',
      description: 'Send messages, create channels',
      connected: connections.slack,
      actions: [
        {
          id: 'slackMessage',
          label: 'Send Message',
          icon: <MessageSquare className="w-4 h-4" />,
          onClick: () => setShowActionModal('slackMessage')
        }
      ],
      onConnect: () => slackService.connect()
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: '📹',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Schedule meetings, join calls',
      connected: connections.zoom,
      actions: [
        {
          id: 'zoomMeeting',
          label: 'Create Meeting',
          icon: <Video className="w-4 h-4" />,
          onClick: () => setShowActionModal('zoomMeeting')
        }
      ],
      onConnect: () => zoomService.connect()
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: '👥',
      color: 'from-pink-500 to-pink-600',
      description: 'Create meetings, send messages',
      connected: connections.teams,
      actions: [
        {
          id: 'teamsMeeting',
          label: 'Create Meeting',
          icon: <Users className="w-4 h-4" />,
          onClick: () => setShowActionModal('teamsMeeting')
        }
      ],
      onConnect: () => teamsService.connect()
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
                <span className="text-4xl">{integration.icon}</span>
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

      {/* Action Modals */}
      <AnimatePresence>
        {showActionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowActionModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {showActionModal === 'createDoc' && 'Create Google Doc'}
                  {showActionModal === 'createMeet' && 'Schedule Google Meet'}
                  {showActionModal === 'uploadDrive' && 'Upload to Drive'}
                  {showActionModal === 'slackMessage' && 'Send Slack Message'}
                  {showActionModal === 'zoomMeeting' && 'Create Zoom Meeting'}
                  {showActionModal === 'teamsMeeting' && 'Create Teams Meeting'}
                </h3>
                <button
                  onClick={() => setShowActionModal(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Create Doc Form */}
                {showActionModal === 'createDoc' && (
                  <>
                    <input
                      type="text"
                      placeholder="Document Title"
                      value={actionData.docTitle || ''}
                      onChange={(e) => setActionData({ ...actionData, docTitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <textarea
                      placeholder="Content (optional)"
                      value={actionData.docContent || ''}
                      onChange={(e) => setActionData({ ...actionData, docContent: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateDoc}
                      disabled={loading.createDoc}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold"
                    >
                      {loading.createDoc ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Create Document'}
                    </motion.button>
                  </>
                )}

                {/* Create Meet Form */}
                {showActionModal === 'createMeet' && (
                  <>
                    <input
                      type="text"
                      placeholder="Meeting Title"
                      value={actionData.meetTitle || ''}
                      onChange={(e) => setActionData({ ...actionData, meetTitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <input
                      type="datetime-local"
                      value={actionData.meetTime || getDefaultTime()}
                      onChange={(e) => setActionData({ ...actionData, meetTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={actionData.meetDuration || '60'}
                      onChange={(e) => setActionData({ ...actionData, meetDuration: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateMeet}
                      disabled={loading.createMeet}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold"
                    >
                      {loading.createMeet ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Schedule Meeting'}
                    </motion.button>
                  </>
                )}

                {/* Upload Drive Form */}
                {showActionModal === 'uploadDrive' && (
                  <>
                    <input
                      type="text"
                      placeholder="File Name (e.g., resume.txt)"
                      value={actionData.fileName || ''}
                      onChange={(e) => setActionData({ ...actionData, fileName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <textarea
                      placeholder="File Content"
                      value={actionData.fileContent || ''}
                      onChange={(e) => setActionData({ ...actionData, fileContent: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUploadDrive}
                      disabled={loading.uploadDrive}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold"
                    >
                      {loading.uploadDrive ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Upload File'}
                    </motion.button>
                  </>
                )}

                {/* Slack Message Form */}
                {showActionModal === 'slackMessage' && (
                  <>
                    <input
                      type="text"
                      placeholder="Channel (e.g., #general)"
                      value={actionData.slackChannel || ''}
                      onChange={(e) => setActionData({ ...actionData, slackChannel: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <textarea
                      placeholder="Your message"
                      value={actionData.slackMessage || ''}
                      onChange={(e) => setActionData({ ...actionData, slackMessage: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSlackMessage}
                      disabled={loading.slackMessage}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold"
                    >
                      {loading.slackMessage ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Send Message'}
                    </motion.button>
                  </>
                )}

                {/* Zoom Meeting Form */}
                {showActionModal === 'zoomMeeting' && (
                  <>
                    <input
                      type="text"
                      placeholder="Meeting Topic"
                      value={actionData.zoomTopic || ''}
                      onChange={(e) => setActionData({ ...actionData, zoomTopic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <input
                      type="datetime-local"
                      value={actionData.zoomTime || getDefaultTime()}
                      onChange={(e) => setActionData({ ...actionData, zoomTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={actionData.zoomDuration || '60'}
                      onChange={(e) => setActionData({ ...actionData, zoomDuration: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleZoomMeeting}
                      disabled={loading.zoomMeeting}
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-bold"
                    >
                      {loading.zoomMeeting ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Create Meeting'}
                    </motion.button>
                  </>
                )}

                {/* Teams Meeting Form */}
                {showActionModal === 'teamsMeeting' && (
                  <>
                    <input
                      type="text"
                      placeholder="Meeting Subject"
                      value={actionData.teamsSubject || ''}
                      onChange={(e) => setActionData({ ...actionData, teamsSubject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <input
                      type="datetime-local"
                      value={actionData.teamsTime || getDefaultTime()}
                      onChange={(e) => setActionData({ ...actionData, teamsTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={actionData.teamsDuration || '60'}
                      onChange={(e) => setActionData({ ...actionData, teamsDuration: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTeamsMeeting}
                      disabled={loading.teamsMeeting}
                      className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-bold"
                    >
                      {loading.teamsMeeting ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Create Meeting'}
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegrationManager;
