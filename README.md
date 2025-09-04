🎥 Screen Recorder App

A full-stack Screen Recorder Web App built with React (frontend), Node.js + Express (backend), and SQLite (database).
It allows users to:

Record their screen + microphone (up to 3 minutes).

Preview and download recordings locally.

Upload recordings to the backend.

View, play, and delete uploaded recordings.

🚀 Features

Record current browser tab with audio + video.

Live timer (max 180 seconds).

Preview + Download as .webm.

Upload to backend via API.

Recordings list with inline playback.

Delete uploaded recordings.

MERN + SQL stack.

🛠️ Setup Instructions
1. Clone the repository
git clone [https://github.com/your-username/screen-recorder-app.git](https://github.com/bharath-3107/Screen-recorder-Amberflux-)
cd screen-recorder-app

2. Setup Backend
cd backend
npm install
node server.js


Backend will start on: http://localhost:5000

3. Setup Frontend
cd ../frontend
npm install
npm start


Frontend will start on: http://localhost:3000

📦 API Endpoints

POST /api/recordings → Upload a recording

GET /api/recordings → Fetch all recordings

GET /api/recordings/:id → Fetch a single recording

DELETE /api/recordings/:id → Delete a recording

🗄 Database

Using SQLite (database.db) to store:

id → Auto-increment primary key

filename → Recording file name

filepath → Path to stored file

filesize → File size in bytes

createdAt → Upload timestamp

🌐 Deployment

Frontend → Netlify / Vercel

Backend → Render / Railway

Database → SQLite (local file) or Postgres (for production)

⚠️ Known Limitations

Works best in Google Chrome (other browsers may restrict screen recording).

Recording is limited to 3 minutes by design.

Uploaded files are stored locally (/uploads), so they won’t persist after server restarts unless you use cloud storage (S3, GCS, etc.).

No authentication → anyone can upload/delete recordings.
