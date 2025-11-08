9/**
 * 🔌 Real Integration Service
 * Connects NEXUS to Google Workspace, Slack, Zoom, Microsoft Teams
 * All using official OAuth 2.0 and REST APIs
 */

// Google Workspace Integration
export class GoogleWorkspaceIntegration {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.scopes = [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/meetings.space.created'
    ].join(' ');
    this.isInitialized = false;
  }

  // Initialize Google API
  async initGoogleAPI() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof gapi === 'undefined') {
        reject(new Error('Google API not loaded'));
        return;
      }

      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: this.apiKey,
            clientId: this.clientId,
            scope: this.scopes,
            discoveryDocs: [
              'https://docs.googleapis.com/$discovery/rest?version=v1',
              'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
              'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
            ]
          });
          this.isInitialized = true;
          console.log('✅ Google API initialized');
          resolve();
        } catch (error) {
          console.error('❌ Google API init error:', error);
          reject(error);
        }
      });
    });
  }

  // Connect to Google (OAuth)
  async connect() {
    try {
      await this.initGoogleAPI();
      const authInstance = gapi.auth2.getAuthInstance();
      
      if (authInstance.isSignedIn.get()) {
        const user = authInstance.currentUser.get();
        return {
          success: true,
          user: user.getBasicProfile(),
          accessToken: user.getAuthResponse().access_token
        };
      }

      const user = await authInstance.signIn();
      const accessToken = user.getAuthResponse().access_token;
      
      // Save token
      localStorage.setItem('google_access_token', accessToken);
      
      return {
        success: true,
        user: user.getBasicProfile(),
        accessToken: accessToken
      };
    } catch (error) {
      console.error('Google connection error:', error);
      return { 
        success: false, 
        error: error.error || error.message || 'Connection failed' 
      };
    }
  }

  // Disconnect
  async disconnect() {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      localStorage.removeItem('google_access_token');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if connected
  isConnected() {
    if (!this.isInitialized) return false;
    const authInstance = gapi.auth2.getAuthInstance();
    return authInstance && authInstance.isSignedIn.get();
  }

  // Create Google Doc
  async createDocument(title, content = '') {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Google');
      }

      const response = await gapi.client.docs.documents.create({
        title: title
      });
      
      const documentId = response.result.documentId;
      
      // Insert content if provided
      if (content) {
        await gapi.client.docs.documents.batchUpdate({
          documentId: documentId,
          requests: [{
            insertText: {
              location: { index: 1 },
              text: content
            }
          }]
        });
      }

      console.log('✅ Document created:', documentId);
      return {
        success: true,
        documentId,
        url: `https://docs.google.com/document/d/${documentId}/edit`
      };
    } catch (error) {
      console.error('❌ Create doc error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create Google Meet
  async createMeeting(summary, startTime, duration = 60) {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Google');
      }

      const endTime = new Date(new Date(startTime).getTime() + duration * 60000);
      
      const event = {
        summary: summary,
        description: 'Created from NEXUS Adaptive Workplace Assistant',
        start: {
          dateTime: new Date(startTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        conferenceData: {
          createRequest: {
            requestId: `nexus-meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      };

      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      });

      console.log('✅ Meeting created:', response.result.hangoutLink);
      return {
        success: true,
        meetLink: response.result.hangoutLink,
        eventId: response.result.id,
        eventUrl: response.result.htmlLink
      };
    } catch (error) {
      console.error('❌ Create meeting error:', error);
      return { success: false, error: error.message };
    }
  }

  // Upload to Google Drive
  async uploadToDrive(fileName, fileContent, mimeType = 'text/plain') {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Google');
      }

      const metadata = {
        name: fileName,
        mimeType: mimeType
      };

      const accessToken = gapi.auth.getToken().access_token;
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([fileContent], { type: mimeType }));

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form
      });

      const result = await response.json();
      
      console.log('✅ File uploaded:', result.id);
      return {
        success: true,
        fileId: result.id,
        url: `https://drive.google.com/file/d/${result.id}/view`
      };
    } catch (error) {
      console.error('❌ Upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get calendar events
  async getCalendarEvents(maxResults = 10) {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Google');
      }

      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: maxResults,
        orderBy: 'startTime'
      });

      return {
        success: true,
        events: response.result.items
      };
    } catch (error) {
      console.error('❌ Get events error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Slack Integration
export class SlackIntegration {
  constructor() {
    this.clientId = import.meta.env.VITE_SLACK_CLIENT_ID || 'demo-slack-client';
    this.redirectUri = `${window.location.origin}/integrations/slack/callback`;
    this.accessToken = localStorage.getItem('slack_access_token');
  }

  // OAuth connection
  connect() {
    const scopes = [
      'chat:write',
      'channels:read',
      'channels:write',
      'users:read',
      'files:write'
    ].join(',');

    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('slack_oauth_state', state);

    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${this.clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}`;
    
    // Open in popup
    const popup = window.open(authUrl, 'slack-auth', 'width=600,height=700');
    
    // Listen for callback
    window.addEventListener('message', (event) => {
      if (event.data.type === 'slack-auth-success') {
        this.accessToken = event.data.token;
        localStorage.setItem('slack_access_token', event.data.token);
        popup?.close();
      }
    });
  }

  // Disconnect
  disconnect() {
    this.accessToken = null;
    localStorage.removeItem('slack_access_token');
  }

  // Check if connected
  isConnected() {
    return !!this.accessToken;
  }

  // Send message
  async sendMessage(channel, text) {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Slack');
      }

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channel: channel,
          text: text
        })
      });

      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ Message sent to Slack');
        return { success: true, data: result };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Slack send error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create channel
  async createChannel(name) {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Slack');
      }

      const response = await fetch('https://slack.com/api/conversations.create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.toLowerCase().replace(/\s+/g, '-'),
          is_private: false
        })
      });

      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ Channel created:', result.channel.id);
        return { success: true, channelId: result.channel.id, channelName: result.channel.name };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Create channel error:', error);
      return { success: false, error: error.message };
    }
  }

  // List channels
  async listChannels() {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Slack');
      }

      const response = await fetch('https://slack.com/api/conversations.list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const result = await response.json();
      
      if (result.ok) {
        return { success: true, channels: result.channels };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ List channels error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Zoom Integration
export class ZoomIntegration {
  constructor() {
    this.clientId = import.meta.env.VITE_ZOOM_CLIENT_ID || 'demo-zoom-client';
    this.clientSecret = import.meta.env.VITE_ZOOM_CLIENT_SECRET;
    this.redirectUri = `${window.location.origin}/integrations/zoom/callback`;
    this.accessToken = localStorage.getItem('zoom_access_token');
  }

  // OAuth connection
  connect() {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('zoom_oauth_state', state);

    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${state}`;
    
    window.location.href = authUrl;
  }

  // Disconnect
  disconnect() {
    this.accessToken = null;
    localStorage.removeItem('zoom_access_token');
  }

  // Check if connected
  isConnected() {
    return !!this.accessToken;
  }

  // Create meeting
  async createMeeting(topic, startTime, duration = 60) {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Zoom');
      }

      const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: topic,
          type: 2, // Scheduled meeting
          start_time: new Date(startTime).toISOString(),
          duration: duration,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            mute_upon_entry: false,
            watermark: false,
            audio: 'both',
            auto_recording: 'cloud'
          }
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Zoom meeting created:', result.id);
        return {
          success: true,
          meetingId: result.id,
          joinUrl: result.join_url,
          password: result.password,
          startUrl: result.start_url
        };
      } else {
        throw new Error(result.message || 'Failed to create meeting');
      }
    } catch (error) {
      console.error('❌ Zoom create meeting error:', error);
      return { success: false, error: error.message };
    }
  }

  // List meetings
  async listMeetings() {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Zoom');
      }

      const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, meetings: result.meetings };
      } else {
        throw new Error(result.message || 'Failed to list meetings');
      }
    } catch (error) {
      console.error('❌ Zoom list meetings error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Microsoft Teams Integration
export class TeamsIntegration {
  constructor() {
    this.clientId = import.meta.env.VITE_TEAMS_CLIENT_ID || 'demo-teams-client';
    this.tenantId = import.meta.env.VITE_TEAMS_TENANT_ID || 'common';
    this.redirectUri = `${window.location.origin}/integrations/teams/callback`;
    this.accessToken = localStorage.getItem('teams_access_token');
  }

  // OAuth connection
  connect() {
    const scopes = [
      'User.Read',
      'OnlineMeetings.ReadWrite',
      'Chat.ReadWrite',
      'Team.ReadBasic.All',
      'Calendars.ReadWrite'
    ].join(' ');

    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('teams_oauth_state', state);

    const authUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_mode=query&scope=${encodeURIComponent(scopes)}&state=${state}`;
    
    window.location.href = authUrl;
  }

  // Disconnect
  disconnect() {
    this.accessToken = null;
    localStorage.removeItem('teams_access_token');
  }

  // Check if connected
  isConnected() {
    return !!this.accessToken;
  }

  // Create Teams meeting
  async createMeeting(subject, startTime, duration = 60) {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Microsoft Teams');
      }

      const endTime = new Date(new Date(startTime).getTime() + duration * 60000);

      const response = await fetch('https://graph.microsoft.com/v1.0/me/onlineMeetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: subject,
          startDateTime: new Date(startTime).toISOString(),
          endDateTime: endTime.toISOString(),
          participants: {
            attendees: []
          }
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Teams meeting created:', result.id);
        return {
          success: true,
          joinUrl: result.joinWebUrl,
          meetingId: result.id
        };
      } else {
        throw new Error(result.error?.message || 'Failed to create meeting');
      }
    } catch (error) {
      console.error('❌ Teams create meeting error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send chat message
  async sendChatMessage(chatId, message) {
    try {
      if (!this.isConnected()) {
        throw new Error('Not connected to Microsoft Teams');
      }

      const response = await fetch(`https://graph.microsoft.com/v1.0/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: {
            content: message
          }
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Message sent to Teams');
        return { success: true, messageId: result.id };
      } else {
        throw new Error(result.error?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Teams send message error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export all integration classes
export default {
  GoogleWorkspaceIntegration,
  SlackIntegration,
  ZoomIntegration,
  TeamsIntegration
};
