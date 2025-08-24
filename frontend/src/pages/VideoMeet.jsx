import React, { useEffect, useRef, useState } from "react";
import "../styles/videoComponent.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const server_url = "http://localhost:8000";

var connections = {};
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localvideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState();

  let [audioAvailable, setAudioAvailable] = useState();

  let [video, setVideo] = useState();

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModel, setModel] = useState();

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  // TODO
  //   if (isChrome() === false) {

  // }
  // const getPermissions = async () => {
  //   try {
  //     const videoPermissions = await navigator.mediaDevices.getUserMedia({ video: true });
  //     if (videoPermissions) {
  //       setVideoAvailable(true);
  //     } else {
  //       setVideoAvailable(false);
  //     }

  //     const audioPermissions = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     if (audioPermissions) {
  //       setAudioAvailable(true);
  //     } else {
  //       setAudioAvailable(false);
  //     }
  //     if (navigator.mediaDevices.getDisplayMedia) {
  //       setScreenAvailable(true);
  //     } else {
  //       setScreenAvailable(false);
  //     }
  const getPermissions = async () => {
    try {
      const videoStream = await navigator.mediaDevices
        .getUserMedia({ video: true })
        .catch(() => null);
      const audioStream = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .catch(() => null);

      setVideoAvailable(!!videoStream);
      setAudioAvailable(!!audioStream);

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      if (videoStream || audioStream) {
        const finalStream = await navigator.mediaDevices.getUserMedia({
          video: !!videoStream,
          audio: !!audioStream,
        });

        window.localStream = finalStream;

        if (localvideoRef.current) {
          localvideoRef.current.srcObject = finalStream;
        }
      }

      // Use actual streams to get combined media
      if (videoStream || audioStream) {
        const finalStream = await navigator.mediaDevices.getUserMedia({
          video: !!videoStream,
          audio: !!audioStream,
        });
        window.localStream = finalStream;

        if (localvideoRef.current) {
          localvideoRef.current.srcObject = finalStream;
        }
      }
    } catch (err) {
      console.error("Permission error:", err);
      setVideoAvailable(false);
      setAudioAvailable(false);
    }
  };


  useEffect(() => {
    getPermissions();
  }, []);

  let getUserMediaSucess = (stream) => {
    
  }

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
        .then(() => {getUserMediaSucess})//TODO :getUserMediaSucess
        .then((stream) => { })
      .catch((e)=>console.log(e))
    } else {
      try { 
        let tracks = localvideoRef.current.srcObject.getTracks();
        tracks.forEach(track=>track.stop())
      } catch(e) {
        
      }
  }
}
  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      }
  }, [audio,video]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

 const handleConnect = () => {
    if (username.trim()) {
      setAskForUsername(false);
      console.log("Connected as", username);
      // TODO: call your socket connection function here
    } else {
      alert("Please enter a username");
    }
  };

  return (
    <div>
      {askForUsername ? (
        <div>
          <h2>Enter into Lobby</h2>
          <TextField
            label="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" onClick={handleConnect}>
            Connect
          </Button>
          <div>
            <video ref={localvideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
