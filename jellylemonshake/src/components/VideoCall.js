import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/VideoCall.css';

function VideoCall({ meeting, onLeave }) {
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    initializeVideoCall();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const initializeVideoCall = async () => {
    try {
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate other participants joining
      const mockParticipants = [
        { id: '1', name: 'John Doe', isVideoOn: true, isAudioOn: true },
        { id: '2', name: 'Jane Smith', isVideoOn: false, isAudioOn: true },
        { id: '3', name: 'Mike Johnson', isVideoOn: true, isAudioOn: false }
      ];
      
      setParticipants(mockParticipants);

      // Add welcome message
      setChatMessages([
        {
          id: 1,
          sender: 'System',
          message: 'Welcome to the video call!',
          timestamp: new Date(),
          isSystem: true
        }
      ]);

    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      // Fallback: create a mock stream for demonstration
      createMockStream();
    }
  };

  const createMockStream = () => {
    // Create a canvas-based mock video stream
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple pattern
    const drawFrame = () => {
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Your Camera', canvas.width / 2, canvas.height / 2);
      ctx.fillText('(Simulated)', canvas.width / 2, canvas.height / 2 + 30);
    };
    
    drawFrame();
    const stream = canvas.captureStream(30);
    setLocalStream(stream);
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  };

  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    } else {
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = async () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    } else {
      setIsAudioOn(!isAudioOn);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track with screen share
        if (localStream) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = localStream.getVideoTracks()[0];
          if (sender) {
            localStream.removeTrack(sender);
            localStream.addTrack(videoTrack);
          }
        }
        
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing and return to camera
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.stop();
          }
        }
        setIsScreenSharing(false);
        // Reinitialize camera
        initializeVideoCall();
      }
    } catch (error) {
      console.error('Error with screen sharing:', error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'You',
        message: newMessage.trim(),
        timestamp: new Date(),
        isOwn: true
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="video-call-container">
      <div className="video-grid">
        {/* Local video */}
        <div className="video-participant local-video">
          <div className="video-container">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`video-element ${!isVideoOn ? 'video-off' : ''}`}
            />
            {!isVideoOn && (
              <div className="video-off-overlay">
                <div className="video-off-icon">📹</div>
                <p>Camera Off</p>
              </div>
            )}
            <div className="participant-info">
              <span className="participant-name">You</span>
              <div className="participant-status">
                {!isAudioOn && <span className="muted-indicator">🔇</span>}
                {isScreenSharing && <span className="screen-share-indicator">📺</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Remote participants */}
        {participants.map((participant, index) => (
          <div key={participant.id} className="video-participant">
            <div className="video-container">
              <div className={`video-placeholder ${!participant.isVideoOn ? 'video-off' : ''}`}>
                <div className="participant-avatar">
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                {!participant.isVideoOn && (
                  <div className="video-off-overlay">
                    <div className="video-off-icon">📹</div>
                    <p>Camera Off</p>
                  </div>
                )}
              </div>
              <div className="participant-info">
                <span className="participant-name">{participant.name}</span>
                <div className="participant-status">
                  {!participant.isAudioOn && <span className="muted-indicator">🔇</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat sidebar */}
      {isChatOpen && (
        <div className="chat-sidebar">
          <div className="chat-header">
            <h3>Chat</h3>
            <button 
              className="close-chat-btn"
              onClick={() => setIsChatOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="chat-messages" ref={chatContainerRef}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.isOwn ? 'own' : ''} ${msg.isSystem ? 'system' : ''}`}>
                <div className="message-sender">{msg.sender}</div>
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="message-input"
            />
            <button onClick={sendMessage} className="send-btn">
              Send
            </button>
          </div>
        </div>
      )}

      {/* Control bar */}
      <div className="control-bar">
        <button 
          className={`control-btn ${!isAudioOn ? 'active' : ''}`}
          onClick={toggleAudio}
          title={isAudioOn ? 'Mute' : 'Unmute'}
        >
          {isAudioOn ? '🎤' : '🔇'}
        </button>
        
        <button 
          className={`control-btn ${!isVideoOn ? 'active' : ''}`}
          onClick={toggleVideo}
          title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoOn ? '📹' : '📹'}
        </button>
        
        <button 
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          {isScreenSharing ? '📺' : '📺'}
        </button>
        
        <button 
          className={`control-btn ${isChatOpen ? 'active' : ''}`}
          onClick={() => setIsChatOpen(!isChatOpen)}
          title="Toggle chat"
        >
          💬
        </button>
        
        <button 
          className="control-btn leave-btn"
          onClick={onLeave}
          title="Leave meeting"
        >
          📞
        </button>
      </div>

      {/* Meeting info */}
      <div className="meeting-info">
        <div className="meeting-title">{meeting?.title || 'Video Call'}</div>
        <div className="meeting-participants">
          {participants.length + 1} participant{participants.length > 0 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
