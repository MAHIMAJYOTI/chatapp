import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import VideoCall from './VideoCall';
import '../styles/components/MeetingRoom.css';

function MeetingRoom() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (meetingId) {
      loadMeeting();
    }
  }, [meetingId]);

  const loadMeeting = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Loading meeting with ID:', meetingId);
      console.log('API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/meetings/${meetingId}`);
      console.log('Meeting fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Meeting fetch response data:', data);
        
        if (data.success && data.meeting) {
          console.log('Meeting loaded successfully:', data.meeting);
          setMeeting(data.meeting);
          setParticipants(data.meeting.participants || []);
        } else {
          console.error('Meeting data format error:', data);
          setError('Meeting not found or access denied');
        }
      } else {
        console.error('Meeting fetch failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Create a mock meeting for testing when backend is not available
        console.log('Creating mock meeting for testing...');
        const mockMeeting = {
          meetingId: meetingId,
          title: 'Test Video Call Meeting',
          description: 'This is a test meeting for video call demonstration. Click "Join Video Call" to start the meeting!',
          organizer: 'Test Organizer',
          participants: ['Participant 1', 'Participant 2', 'Participant 3'],
          scheduledTime: new Date().toISOString(),
          duration: 60,
          status: 'active',
          settings: {
            allowScreenShare: true,
            allowChat: true,
            requirePassword: false,
            maxParticipants: 50
          }
        };
        
        console.log('Using mock meeting:', mockMeeting);
        setMeeting(mockMeeting);
        setParticipants(mockMeeting.participants);
      }
    } catch (err) {
      console.error('Error loading meeting:', err);
      
      // Create a mock meeting for testing when there's a connection error
      console.log('Creating mock meeting due to connection error...');
      const mockMeeting = {
        meetingId: meetingId,
        title: 'Test Video Call Meeting',
        description: 'This is a test meeting for video call demonstration. Click "Join Video Call" to start the meeting!',
        organizer: 'Test Organizer',
        participants: ['Participant 1', 'Participant 2', 'Participant 3'],
        scheduledTime: new Date().toISOString(),
        duration: 60,
        status: 'active',
        settings: {
          allowScreenShare: true,
          allowChat: true,
          requirePassword: false,
          maxParticipants: 50
        }
      };
      
      console.log('Using mock meeting:', mockMeeting);
      setMeeting(mockMeeting);
      setParticipants(mockMeeting.participants);
    } finally {
      setLoading(false);
    }
  };

  const joinMeeting = () => {
    console.log('Join meeting clicked - Direct join without authentication');
    console.log('Meeting:', meeting);
    
    if (!meeting) {
      setError('Meeting not found. Please try again.');
      return;
    }

    // Direct join without authentication checks
    console.log('Joining meeting directly...');
    setIsJoined(true);
    sendMeetingNotification();
  };

  const sendMeetingNotification = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://awsproject-backend-qqst.onrender.com';
      
      // Send notification to room participants
      await fetch(`${apiUrl}/api/meetings/${meetingId}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'meeting_started',
          organizer: authUser?.email || authUser?.username,
          meetingId: meetingId,
          message: `${authUser?.email || authUser?.username} has started a video call`
        })
      });
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const leaveMeeting = () => {
    setIsJoined(false);
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="meeting-room-container">
        <div className="meeting-loading">
          <div className="loading-spinner"></div>
          <p>Loading meeting...</p>
        </div>
      </div>
    );
  }

    if (error) {
      return (
        <div className="meeting-room-container">
          <div className="meeting-error">
            <h2>Meeting Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="back-button">
              🔄 Retry
            </button>
            <button onClick={() => navigate(-1)} className="back-button">
              ← Go Back
            </button>
          </div>
        </div>
      );
    }

  if (!meeting) {
    return (
      <div className="meeting-room-container">
        <div className="meeting-error">
          <h2>Meeting Not Found</h2>
          <p>The meeting you're looking for doesn't exist or has been deleted.</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="meeting-room-container">
      <div className="meeting-header">
        <div className="meeting-info">
          <h1>{meeting.title}</h1>
          <p>Meeting ID: {meetingId}</p>
          <p>Organized by: {meeting.organizer}</p>
          {meeting.description && <p>{meeting.description}</p>}
        </div>
        <div className="meeting-actions">
          {!isJoined ? (
            <button onClick={joinMeeting} className="join-meeting-btn">
              <span className="btn-icon">🎥</span>
              <span className="btn-text">Join Video Call</span>
              <span className="btn-subtitle">No login required - Start now!</span>
            </button>
          ) : (
            <button onClick={leaveMeeting} className="leave-meeting-btn">
              <span className="btn-icon">📞</span>
              <span className="btn-text">Leave Meeting</span>
            </button>
          )}
        </div>
      </div>

      {isJoined ? (
        <VideoCall 
          meeting={meeting} 
          onLeave={leaveMeeting}
        />
      ) : (
        <div className="meeting-preview">
          <div className="meeting-details">
            <h3>🎥 {meeting.title}</h3>
            <p className="meeting-description">{meeting.description}</p>
            
            <div className="meeting-info-grid">
              <div className="info-item">
                <span className="info-label">📅 Status:</span>
                <span className={`status-badge ${meeting.status}`}>{meeting.status}</span>
              </div>
              <div className="info-item">
                <span className="info-label">⏰ Time:</span>
                <span>{new Date(meeting.scheduledTime).toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">⏱️ Duration:</span>
                <span>{meeting.duration} minutes</span>
              </div>
              <div className="info-item">
                <span className="info-label">👥 Participants:</span>
                <span>{participants.length + 1} (including you)</span>
              </div>
            </div>

            {meeting.settings?.requirePassword && (
              <div className="password-notice">
                🔒 This meeting is password protected
              </div>
            )}

            <div className="meeting-features">
              <h4>Meeting Features:</h4>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">📹</span>
                  <span>Video Call</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎤</span>
                  <span>Audio Chat</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📺</span>
                  <span>Screen Sharing</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💬</span>
                  <span>Text Chat</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h4>Quick Actions:</h4>
              <div className="action-buttons">
                <button 
                  onClick={joinMeeting} 
                  className="quick-action-btn primary"
                >
                  🎥 Start Video Call (No Login)
                </button>
                <button 
                  onClick={() => {
                    // Simulate joining without video
                    console.log('Audio only button clicked');
                    setIsJoined(true);
                  }} 
                  className="quick-action-btn secondary"
                >
                  🎤 Audio Only
                </button>
              </div>
            </div>
          </div>

          <div className="participants-section">
            <h4>👥 Participants ({participants.length + 1})</h4>
            <div className="participants-list">
              <div className="participant-item you">
                <span className="participant-avatar">You</span>
                <span className="participant-name">You (Host)</span>
              </div>
              {participants.map((participant, index) => (
                <div key={index} className="participant-item">
                  <span className="participant-avatar">{participant.charAt(0).toUpperCase()}</span>
                  <span className="participant-name">{participant}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingRoom;
