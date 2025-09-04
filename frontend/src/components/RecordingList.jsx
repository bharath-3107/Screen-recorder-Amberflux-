import React, { useEffect, useState } from "react";
import "./RecordingList.css";

const API_URL = "http://localhost:5000/api/recordings";

function RecordingList() {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setRecordings(data);
    } catch (err) {
      console.error("Error fetching recordings:", err);
    }
  };

  const deleteRecording = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message || "Deleted!");
      fetchRecordings(); // refresh the list
    } catch (err) {
      console.error("Error deleting recording:", err);
    }
  };

  return (
    <div className="list">
      <h2>📂 Uploaded Recordings</h2>
      {recordings.length === 0 ? (
        <p className="empty">No recordings uploaded yet.</p>
      ) : (
        <div className="grid">
          {recordings.map((rec) => (
            <div key={rec.id} className="record-card">
              <p className="title">{rec.filename}</p>
              <p className="meta">
                {(rec.filesize / 1024).toFixed(2)} KB • {rec.createdAt}
              </p>
              <video
                src={`http://localhost:5000/${rec.filepath}`}
                controls
                className="video"
              ></video>
              <button
                className="btn delete"
                onClick={() => deleteRecording(rec.id)}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecordingList;
