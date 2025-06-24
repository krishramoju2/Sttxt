const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const transcript = document.getElementById("transcript");

let mediaRecorder;
let socket;

startBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

  // Get Deepgram socket URL from backend
  const res = await fetch("/get-deepgram-url");
  const { url } = await res.json();
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket opened");
    mediaRecorder.start(250);
  };

  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    const transcriptText = data.channel?.alternatives[0]?.transcript;
    if (transcriptText) transcript.value += transcriptText + " ";
  };

  mediaRecorder.ondataavailable = (e) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(e.data);
  };

  startBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  socket.close();
  startBtn.disabled = false;
  stopBtn.disabled = true;
};
