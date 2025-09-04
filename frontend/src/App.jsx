import React, { useState, useRef } from "react";
import RecordingList from "./components/RecordingList";
import "./App.css";

const API_URL = "http://localhost:5000/api/recordings";

function App() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecording(blob);
        setIsRecording(false);
        clearInterval(timerRef.current);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setTimer(0);

      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t >= 180) {
            stopRecording();
            return 180;
          }
          return t + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  const downloadRecording = () => {
    if (!recording) return;
    const url = URL.createObjectURL(recording);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
  };

  const uploadRecording = async () => {
    if (!recording) return;
    const formData = new FormData();
    formData.append("video", recording, "recording.webm");

    const res = await fetch(API_URL, { method: "POST", body: formData });
    const data = await res.json();
    alert(data.message || "Upload complete!");
  };

  // ✅ Delete recording handler
  const deleteRecording = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message || "Deleted!");
    } catch (err) {
      console.error("Error deleting recording:", err);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎥 Screen Recorder</h1>
      </header>

      <main className="container">
        <div className="card">
          <h2>Record your screen</h2>
          <div className="controls">
            {isRecording ? (
              <button className="btn stop" onClick={stopRecording}>
                ⏹ Stop Recording
              </button>
            ) : (
              <button className="btn start" onClick={startRecording}>
                🎬 Start Recording
              </button>
            )}
          </div>
          <div className="timer">⏱ {timer}s / 180s</div>
        </div>

        {recording && (
          <div className="card">
            <h2>Preview</h2>
            <video
              src={URL.createObjectURL(recording)}
              controls
              className="preview"
            ></video>
            <div className="actions">
              <button className="btn download" onClick={downloadRecording}>
                ⬇️ Download
              </button>
              <button className="btn upload" onClick={uploadRecording}>
                ☁️ Upload
              </button>
            </div>
          </div>
        )}

        <div className="card">
          {/* ✅ Pass delete handler to RecordingList */}
          <RecordingList onDelete={deleteRecording} />
        </div>
      </main>
    </div>
  );
}

export default App;
