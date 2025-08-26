
// import React, { useEffect, useRef, useState } from "react";
// import "../styles/videoComponent.css";
// import {
//   Box, Button, Typography, Badge, IconButton, Modal, TextField, AppBar, Toolbar
// } from "@mui/material";
// import {
//   Person as PersonIcon,
//   Videocam as VideocamIcon,
//   VideocamOff as VideocamOffIcon,
//   Mic as MicIcon,
//   MicOff as MicOffIcon,
//   ScreenShare as ScreenShareIcon,
//   StopScreenShare as StopScreenShareIcon,
//   Chat as ChatIcon,
//   CallEnd as CallEndIcon,
//   MeetingRoom as MeetingRoomIcon
// } from "@mui/icons-material";
// import { io } from "socket.io-client";

// const SERVER_URL = "http://localhost:8000";
// const peerConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// // Remote Video Component
// function RemoteVideo({ stream, username }) {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (videoRef.current && stream) {
//       if (videoRef.current.srcObject !== stream) {
//         videoRef.current.srcObject = stream;
//       }
//       videoRef.current.play().catch(err => {
//         if (err.name !== "AbortError") console.error("Remote video play error:", err);
//       });
//     }
//   }, [stream]);

//   return (
//     <Box className="video-container">
//       <Box className="video-label">
//         <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
//         <Typography variant="caption">{username}</Typography>
//       </Box>
//       <video ref={videoRef} autoPlay playsInline />
//     </Box>
//   );
// }

// export default function VideoMeet() {
//   const socketRef = useRef(null);
//   const myIdRef = useRef(null);
//   const peersRef = useRef({});
//   const localVideoRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const screenStreamRef = useRef(null);

//   const [cameraStream, setCameraStream] = useState(null);
//   const [remoteVideos, setRemoteVideos] = useState([]);
//   const [askForUsername, setAskForUsername] = useState(true);
//   const [username, setUsername] = useState("");
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [cameraEnabled, setCameraEnabled] = useState(true);
//   const [micEnabled, setMicEnabled] = useState(true);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [showChat, setShowChat] = useState(false);
//   const [newMessages, setNewMessages] = useState(0);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   // Safe getUserMedia with retries
//   const getMediaSafe = async (attempt = 1, maxAttempts = 3) => {
//     try {
//       setIsLoading(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       mediaStreamRef.current = stream;
//       setCameraStream(stream);
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//         await localVideoRef.current.play().catch(() => {});
//       }
//       setError("");
//     } catch (err) {
//       console.error(`Media attempt ${attempt} failed:`, err);
//       if (attempt < maxAttempts) setTimeout(() => getMediaSafe(attempt + 1), 500);
//       else setError("Camera/mic access failed. Close other apps using camera and reload.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => { getMediaSafe(); }, []);

//   // --- WebRTC Helpers ---
//   const getCurrentVideoTrack = () => {
//     if (isScreenSharing && screenStreamRef.current) return screenStreamRef.current.getVideoTracks()[0];
//     if (cameraStream) return cameraStream.getVideoTracks()[0];
//     return null;
//   };

//   const replaceVideoTrackAllPeers = (newTrack) => {
//     Object.values(peersRef.current).forEach(pc => {
//       const sender = pc.getSenders().find(s => s.track?.kind === "video");
//       if (sender && newTrack) sender.replaceTrack(newTrack).catch(console.error);
//     });
//   };

//   const createPeer = (remoteId, remoteUsername) => {
//     const pc = new RTCPeerConnection(peerConfig);
//     pc.onicecandidate = e => { if (e.candidate) socketRef.current.emit("signal", remoteId, JSON.stringify({ ice: e.candidate })); };
//     pc.ontrack = e => {
//       const stream = e.streams[0];
//       if (!stream) return;
//       setRemoteVideos(prev => {
//         const exists = prev.find(v => v.socketId === remoteId);
//         if (exists) return prev.map(v => v.socketId === remoteId ? { ...v, stream } : v);
//         return [...prev, { socketId: remoteId, stream, username: remoteUsername || "User" }];
//       });
//     };
//     if (mediaStreamRef.current) {
//       const videoTrack = getCurrentVideoTrack();
//       if (videoTrack) pc.addTrack(videoTrack, mediaStreamRef.current);
//       if (micEnabled && mediaStreamRef.current.getAudioTracks()[0]) pc.addTrack(mediaStreamRef.current.getAudioTracks()[0], mediaStreamRef.current);
//     }
//     peersRef.current[remoteId] = pc;
//     return pc;
//   };

//   const ensurePeer = (remoteId, remoteUsername) => peersRef.current[remoteId] || createPeer(remoteId, remoteUsername);

//   const makeOffer = async (remoteId) => {
//     const pc = ensurePeer(remoteId);
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     socketRef.current.emit("signal", remoteId, JSON.stringify({ sdp: pc.localDescription }));
//   };

//   const handleSignal = async (fromId, message, fromUsername) => {
//     if (fromId === myIdRef.current) return;
//     const pc = ensurePeer(fromId, fromUsername);
//     try {
//       const signal = JSON.parse(message);
//       if (signal.sdp) {
//         await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
//         if (signal.sdp.type === "offer") {
//           const answer = await pc.createAnswer();
//           await pc.setLocalDescription(answer);
//           socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: pc.localDescription }));
//         }
//       } else if (signal.ice) await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
//     } catch (err) { console.error("Signal error:", err); }
//   };

//   // --- Controls ---
//   const toggleCamera = () => { if (mediaStreamRef.current) { const t = mediaStreamRef.current.getVideoTracks()[0]; t.enabled = !t.enabled; setCameraEnabled(t.enabled); } };
//   const toggleMic = () => { if (mediaStreamRef.current) { const t = mediaStreamRef.current.getAudioTracks()[0]; t.enabled = !t.enabled; setMicEnabled(t.enabled); } };
//   const handleScreenShare = async () => {
//     if (isScreenSharing) {
//       screenStreamRef.current?.getTracks().forEach(t => t.stop());
//       screenStreamRef.current = null; setIsScreenSharing(false);
//       if (localVideoRef.current) localVideoRef.current.srcObject = mediaStreamRef.current;
//       if (mediaStreamRef.current) replaceVideoTrackAllPeers(mediaStreamRef.current.getVideoTracks()[0]);
//     } else {
//       try {
//         const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
//         screenStreamRef.current = stream; setIsScreenSharing(true);
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//         replaceVideoTrackAllPeers(stream.getVideoTracks()[0]);
//         stream.getVideoTracks()[0].onended = handleScreenShare;
//       } catch (err) { console.error("Screen share error:", err); }
//     }
//   };

//   // --- Chat ---
//   const sendMessage = () => {
//     if (message.trim() && socketRef.current) {
//       socketRef.current.emit("chat-message", message, username);
//       setMessages(prev => [...prev, { sender: username, data: message, isOwn: true }]);
//       setMessage("");
//     }
//   };
//   const addMessage = (data, sender, socketIdSender) => {
//     setMessages(prev => [...prev, { sender, data, isOwn: socketIdSender === myIdRef.current }]);
//     if (socketIdSender !== myIdRef.current && !showChat) setNewMessages(prev => prev + 1);
//   };
//   const toggleChat = () => { setShowChat(prev => { if (!prev) setNewMessages(0); return !prev; }); };

//   // --- Socket ---
//   const connectToSocket = () => {
//     if (!mediaStreamRef.current) { setError("Camera not ready!"); return; }
//     setError("");
//     socketRef.current = io(SERVER_URL);
//     socketRef.current.on("connect", () => {
//       myIdRef.current = socketRef.current.id;
//       socketRef.current.emit("join-call", window.location.href, username);
//     });
//     socketRef.current.on("signal", (fromId, msg, fromUsername) => handleSignal(fromId, msg, fromUsername));
//     socketRef.current.on("user-left", socketId => {
//       setRemoteVideos(prev => prev.filter(v => v.socketId !== socketId));
//       if (peersRef.current[socketId]) { peersRef.current[socketId].close(); delete peersRef.current[socketId]; }
//     });
//     socketRef.current.on("user-joined", async (id, clients, username) => {
//       clients.forEach(clientId => { if (clientId !== myIdRef.current) ensurePeer(clientId, username); });
//       if (id !== myIdRef.current) await makeOffer(id);
//     });
//     socketRef.current.on("chat-message", addMessage);
//     socketRef.current.on("connect_error", err => setError("Connection error: " + err.message));
//   };

//   const handleDisconnect = () => {
//     Object.values(peersRef.current).forEach(pc => pc.close());
//     peersRef.current = {};
//     mediaStreamRef.current?.getTracks().forEach(t => t.stop());
//     screenStreamRef.current?.getTracks().forEach(t => t.stop());
//     socketRef.current?.disconnect();
//     setRemoteVideos([]); setAskForUsername(true); setError("");
//   };

//   const handleConnect = () => {
//     if (!username.trim()) { setError("Enter username"); return; }
//     setAskForUsername(false); connectToSocket();
//   };

//   return (
//     <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>Video Meet</Typography>
//           <IconButton color="inherit" onClick={toggleChat}>
//             <Badge badgeContent={newMessages} color="error"><ChatIcon /></Badge>
//           </IconButton>
//           <IconButton color="inherit" onClick={handleDisconnect}><CallEndIcon /></IconButton>
//         </Toolbar>
//       </AppBar>

//       {error && <Typography color="error" sx={{ m: 1 }}>{error}</Typography>}
//       {isLoading && <Typography sx={{ m: 1 }}>Loading camera/mic...</Typography>}

//       <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
//         <Box className="video-container">
//           <Box className="video-label"><PersonIcon sx={{ fontSize: 16, mr: 0.5 }} /><Typography variant="caption">You ({username || "Guest"})</Typography></Box>
//           <video ref={localVideoRef} autoPlay muted playsInline />
//         </Box>
//         {remoteVideos.map(v => <RemoteVideo key={v.socketId} stream={v.stream} username={v.username} />)}
//       </Box>

//       <Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 1 }}>
//         <IconButton onClick={toggleCamera}>{cameraEnabled ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
//         <IconButton onClick={toggleMic}>{micEnabled ? <MicIcon /> : <MicOffIcon />}</IconButton>
//         <IconButton onClick={handleScreenShare}>{isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}</IconButton>
//       </Box>

//       {askForUsername && (
//         <Box sx={{ p: 2 }}>
//           <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} size="small" />
//           <Button variant="contained" onClick={handleConnect} sx={{ ml: 1 }}>Join</Button>
//         </Box>
//       )}

//       <Modal open={showChat} onClose={toggleChat}>
//         <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
//           <Box className="chat-box">
//             {messages.map((m,i) => (
//               <Box key={i} className={`chat-message ${m.isOwn ? "own" : "other"}`}>{m.sender}: {m.data}</Box>
//             ))}
//           </Box>
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <TextField size="small" value={message} onChange={e => setMessage(e.target.value)} fullWidth />
//             <Button variant="contained" onClick={sendMessage}>Send</Button>
//           </Box>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import "../styles/videoComponent.css";
import {
  Box, Button, Typography, Badge, IconButton, Modal, TextField, AppBar, Toolbar
} from "@mui/material";
import {
  Person as PersonIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  Chat as ChatIcon,
  CallEnd as CallEndIcon,
  MeetingRoom as MeetingRoomIcon,
  Send as SendIcon
} from "@mui/icons-material";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8000";
const peerConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Remote Video Component
function RemoteVideo({ stream, username }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch(err => {
        if (err.name !== "AbortError") console.error("Remote video play error:", err);
      });
    }
  }, [stream]);

  return (
    <Box className="video-container">
      <Box className="video-label">
        <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
        <Typography variant="caption">{username}</Typography>
      </Box>
      <video ref={videoRef} autoPlay playsInline />
    </Box>
  );
}

export default function VideoMeet() {
  const socketRef = useRef(null);
  const myIdRef = useRef(null);
  const peersRef = useRef({});
  const localVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const chatEndRef = useRef(null); // For auto-scrolling chat

  const [cameraStream, setCameraStream] = useState(null);
  const [remoteVideos, setRemoteVideos] = useState([]);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [newMessages, setNewMessages] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Safe getUserMedia with retries
  const getMediaSafe = async (attempt = 1, maxAttempts = 3) => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      setCameraStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }
      setError("");
    } catch (err) {
      console.error(`Media attempt ${attempt} failed:`, err);
      if (attempt < maxAttempts) setTimeout(() => getMediaSafe(attempt + 1), 500);
      else setError("Camera/mic access failed. Close other apps using camera and reload.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { getMediaSafe(); }, []);

  // --- WebRTC Helpers ---
  const getCurrentVideoTrack = () => {
    if (isScreenSharing && screenStreamRef.current) return screenStreamRef.current.getVideoTracks()[0];
    if (cameraStream) return cameraStream.getVideoTracks()[0];
    return null;
  };

  const replaceVideoTrackAllPeers = (newTrack) => {
    Object.values(peersRef.current).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === "video");
      if (sender && newTrack) sender.replaceTrack(newTrack).catch(console.error);
    });
  };

  const createPeer = (remoteId, remoteUsername) => {
    const pc = new RTCPeerConnection(peerConfig);
    pc.onicecandidate = e => { if (e.candidate) socketRef.current.emit("signal", remoteId, JSON.stringify({ ice: e.candidate })); };
    pc.ontrack = e => {
      const stream = e.streams[0];
      if (!stream) return;
      setRemoteVideos(prev => {
        const exists = prev.find(v => v.socketId === remoteId);
        if (exists) return prev.map(v => v.socketId === remoteId ? { ...v, stream } : v);
        return [...prev, { socketId: remoteId, stream, username: remoteUsername || "User" }];
      });
    };
    if (mediaStreamRef.current) {
      const videoTrack = getCurrentVideoTrack();
      if (videoTrack) pc.addTrack(videoTrack, mediaStreamRef.current);
      if (micEnabled && mediaStreamRef.current.getAudioTracks()[0]) pc.addTrack(mediaStreamRef.current.getAudioTracks()[0], mediaStreamRef.current);
    }
    peersRef.current[remoteId] = pc;
    return pc;
  };

  const ensurePeer = (remoteId, remoteUsername) => peersRef.current[remoteId] || createPeer(remoteId, remoteUsername);

  const makeOffer = async (remoteId) => {
    const pc = ensurePeer(remoteId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit("signal", remoteId, JSON.stringify({ sdp: pc.localDescription }));
  };

  const handleSignal = async (fromId, message, fromUsername) => {
    if (fromId === myIdRef.current) return;
    const pc = ensurePeer(fromId, fromUsername);
    try {
      const signal = JSON.parse(message);
      if (signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === "offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current.emit("signal", fromId, JSON.stringify({ sdp: pc.localDescription }));
        }
      } else if (signal.ice) await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
    } catch (err) { console.error("Signal error:", err); }
  };

  // --- Controls ---
  const toggleCamera = () => { if (mediaStreamRef.current) { const t = mediaStreamRef.current.getVideoTracks()[0]; t.enabled = !t.enabled; setCameraEnabled(t.enabled); } };
  const toggleMic = () => { if (mediaStreamRef.current) { const t = mediaStreamRef.current.getAudioTracks()[0]; t.enabled = !t.enabled; setMicEnabled(t.enabled); } };
  const handleScreenShare = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null; setIsScreenSharing(false);
      if (localVideoRef.current) localVideoRef.current.srcObject = mediaStreamRef.current;
      if (mediaStreamRef.current) replaceVideoTrackAllPeers(mediaStreamRef.current.getVideoTracks()[0]);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = stream; setIsScreenSharing(true);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        replaceVideoTrackAllPeers(stream.getVideoTracks()[0]);
        stream.getVideoTracks()[0].onended = handleScreenShare;
      } catch (err) { console.error("Screen share error:", err); }
    }
  };

  // --- Enhanced Chat Functions ---
  const sendMessage = () => {
    if (message.trim() && socketRef.current && username) {
      const messageData = {
        text: message.trim(),
        sender: username,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random() // Simple unique ID
      };
      
      // Emit to server
      socketRef.current.emit("chat-message", messageData.text, username);
      
      // Add to local messages immediately
      setMessages(prev => [...prev, { 
        sender: username, 
        data: messageData.text, 
        isOwn: true,
        timestamp: messageData.timestamp,
        id: messageData.id
      }]);
      
      setMessage("");
    }
  };

  const addMessage = (data, sender, socketIdSender) => {
    const messageObj = {
      sender: sender || "Unknown",
      data: data || "",
      isOwn: socketIdSender === myIdRef.current,
      timestamp: new Date().toISOString(),
      id: Date.now() + Math.random()
    };
    
    setMessages(prev => {
      // Prevent duplicate messages
      const isDuplicate = prev.some(msg => 
        msg.data === messageObj.data && 
        msg.sender === messageObj.sender && 
        Math.abs(new Date(msg.timestamp) - new Date(messageObj.timestamp)) < 1000
      );
      
      if (isDuplicate) return prev;
      return [...prev, messageObj];
    });
    
    // Only increment new message count if it's from someone else and chat is closed
    if (socketIdSender !== myIdRef.current && !showChat) {
      setNewMessages(prev => prev + 1);
    }
  };

  const toggleChat = () => { 
    setShowChat(prev => { 
      if (!prev) setNewMessages(0); // Reset new message count when opening chat
      return !prev; 
    }); 
  };

  // Handle Enter key press in chat input
  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- Socket ---
  const connectToSocket = () => {
    if (!mediaStreamRef.current) { setError("Camera not ready!"); return; }
    setError("");
    socketRef.current = io(SERVER_URL);
    
    socketRef.current.on("connect", () => {
      myIdRef.current = socketRef.current.id;
      socketRef.current.emit("join-call", window.location.href, username);
    });
    
    socketRef.current.on("signal", (fromId, msg, fromUsername) => handleSignal(fromId, msg, fromUsername));
    
    socketRef.current.on("user-left", socketId => {
      setRemoteVideos(prev => prev.filter(v => v.socketId !== socketId));
      if (peersRef.current[socketId]) { 
        peersRef.current[socketId].close(); 
        delete peersRef.current[socketId]; 
      }
    });
    
    socketRef.current.on("user-joined", async (id, clients, username) => {
      clients.forEach(clientId => { 
        if (clientId !== myIdRef.current) ensurePeer(clientId, username); 
      });
      if (id !== myIdRef.current) await makeOffer(id);
    });
    
    // Enhanced chat message handling
    socketRef.current.on("chat-message", (data, sender, socketIdSender) => {
      console.log("Received chat message:", { data, sender, socketIdSender });
      addMessage(data, sender, socketIdSender);
    });
    
    socketRef.current.on("connect_error", err => setError("Connection error: " + err.message));
    
    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setError("Disconnected from server");
    });
  };

  const handleDisconnect = () => {
    Object.values(peersRef.current).forEach(pc => pc.close());
    peersRef.current = {};
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    socketRef.current?.disconnect();
    setRemoteVideos([]); 
    setAskForUsername(true); 
    setError("");
    setMessages([]); // Clear chat messages
    setNewMessages(0);
    setShowChat(false);
  };

  const handleConnect = () => {
    if (!username.trim()) { setError("Enter username"); return; }
    setAskForUsername(false); 
    connectToSocket();
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Video Meet</Typography>
          <IconButton color="inherit" onClick={toggleChat}>
            <Badge badgeContent={newMessages > 0 ? newMessages : null} color="error">
              <ChatIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleDisconnect}>
            <CallEndIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {error && <Typography color="error" sx={{ m: 1 }}>{error}</Typography>}
      {isLoading && <Typography sx={{ m: 1 }}>Loading camera/mic...</Typography>}

      <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
        <Box className="video-container">
          <Box className="video-label">
            <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">You ({username || "Guest"})</Typography>
          </Box>
          <video ref={localVideoRef} autoPlay muted playsInline />
        </Box>
        {remoteVideos.map(v => (
          <RemoteVideo key={v.socketId} stream={v.stream} username={v.username} />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 1 }}>
        <IconButton onClick={toggleCamera} color={cameraEnabled ? "primary" : "error"}>
          {cameraEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>
        <IconButton onClick={toggleMic} color={micEnabled ? "primary" : "error"}>
          {micEnabled ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        <IconButton onClick={handleScreenShare} color={isScreenSharing ? "secondary" : "default"}>
          {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
        </IconButton>
      </Box>

      {askForUsername && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <TextField 
            label="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            size="small"
            onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
            error={error.includes("username")}
            helperText={error.includes("username") ? error : ""}
          />
          <Button variant="contained" onClick={handleConnect} sx={{ ml: 1 }}>
            <MeetingRoomIcon sx={{ mr: 1 }} />
            Join
          </Button>
        </Box>
      )}

      {/* Enhanced Chat Modal */}
      <Modal open={showChat} onClose={toggleChat}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          maxWidth: '90vw',
          maxHeight: '80vh',
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <ChatIcon sx={{ mr: 1 }} />
            Chat
          </Typography>
          
          <Box className="chat-box" sx={{ flexGrow: 1, minHeight: 200 }}>
            {messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                No messages yet. Start the conversation!
              </Typography>
            ) : (
              messages.map((m, i) => (
                <Box key={m.id || i} className={`chat-message ${m.isOwn ? "own" : "other"}`}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', mb: 0.5 }}>
                    {m.sender}
                  </Typography>
                  <Typography variant="body2">{m.data}</Typography>
                </Box>
              ))
            )}
            <div ref={chatEndRef} />
          </Box>
          
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField 
              size="small" 
              value={message} 
              onChange={e => setMessage(e.target.value)}
              onKeyPress={handleChatKeyPress}
              placeholder="Type a message..."
              fullWidth
              multiline
              maxRows={3}
            />
            <Button 
              variant="contained" 
              onClick={sendMessage}
              disabled={!message.trim()}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}