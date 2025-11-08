import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, Loader, AlertCircle, ExternalLink } from 'lucide-react';

const SimpleGoogleIntegration = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meetLink, setMeetLink] = useState(null);
  const [gapiReady, setGapiReady] = useState(false);

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  useEffect(() => {
    // Load Google API
    const initGoogleAPI = () => {
      if (window.gapi) {
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: SCOPES
          }).then(() => {
            setGapiReady(true);
            const authInstance = window.gapi.auth2.getAuthInstance();
            setIsSignedIn(authInstance.isSignedIn.get());
            authInstance.isSignedIn.listen(setIsSignedIn);
            console.log('✅ Google Calendar API ready!');
          }).catch((err) => {
            console.error('❌ Google API init error:', err);
            setError('Failed to initialize Google API');
          });
        });
      } else {
        setTimeout(initGoogleAPI, 500);
      }
    };

    initGoogleAPI();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await window.gapi.auth2.getAuthInstance().signIn();
      setIsSignedIn(true);
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    window.gapi.auth2.getAuthInstance().signOut();
    setIsSignedIn(false);
    setMeetLink(null);
  };

  const createMeeting = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create event 1 hour from now
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 60);

      const event = {
        summary: '🎯 NEXUS Interview Preparation Session',
        description: 'Job interview prep session scheduled via NEXUS Adaptive Workplace Assistant.\n\nPrepared for candidates with disabilities to excel in interviews!',
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        conferenceData: {
          createRequest: {
            requestId: 'nexus-' + Math.random().toString(36).substring(7),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        attendees: [
          { email: window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail() }
        ]
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      });

      const meetingLink = response.result.hangoutLink;
      setMeetLink(meetingLink);
      
      // Auto-open the meet link
      window.open(meetingLink, '_blank');
      
    } catch (err) {
      console.error('Create meeting error:', err);
      setError('Failed to create meeting. Make sure Calendar API is enabled in Google Cloud Console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Google Meet Integration
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Schedule interview prep sessions with Google Meet
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        {/* Google Logo */}
        <div className="flex items-center gap-4 mb-6">
          <svg className="w-16 h-16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Google Calendar</h3>
            <p className="text-gray-600 dark:text-gray-400">Schedule Google Meet interviews</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {!gapiReady && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3">
            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-blue-700 dark:text-blue-300">Loading Google Calendar API...</p>
          </div>
        )}

        {/* Not Signed In */}
        {gapiReady && !isSignedIn && (
          <div className="text-center">
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Sign in with Google to schedule meetings
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignIn}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 48 48">
                    <path fill="#FFF" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Signed In */}
        {isSignedIn && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Connected to Google Calendar
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Sign out
              </button>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createMeeting}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    Creating Meeting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-6 h-6" />
                    Schedule Interview Prep Meeting
                  </>
                )}
              </motion.button>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Creates a Google Meet session starting 1 hour from now
              </p>
            </div>

            {/* Success Message */}
            {meetLink && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                      Meeting Created Successfully! 🎉
                    </h4>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      Your Google Meet interview prep session has been scheduled and added to your calendar.
                    </p>
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Open Google Meet
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2">✨ What this does:</h4>
        <ul className="space-y-2 text-purple-800 dark:text-purple-300">
          <li>• Creates a real Google Calendar event</li>
          <li>• Generates a Google Meet video link</li>
          <li>• Automatically adds it to your calendar</li>
          <li>• Perfect for interview preparation sessions!</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleGoogleIntegration;
