const express = require("express");
const multer = require("multer");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Storage engine for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// SQLite setup
const db = new sqlite3.Database(path.join(__dirname, "database.db"));
db.run(`CREATE TABLE IF NOT EXISTS recordings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT,
  filepath TEXT,
  filesize INTEGER,
  createdAt TEXT
)`);

// Upload recording
app.post("/api/recordings", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { filename, path: filepath, size } = req.file;
  const createdAt = new Date().toISOString();

  db.run(
    "INSERT INTO recordings (filename, filepath, filesize, createdAt) VALUES (?, ?, ?, ?)",
    [filename, "uploads/" + filename, size, createdAt],
    function (err) {
      if (err) return res.status(500).json({ message: "DB insert failed" });
      res.status(201).json({
        message: "Recording uploaded successfully",
        recording: {
          id: this.lastID,
          filename,
          filepath: "uploads/" + filename,
          filesize: size,
          createdAt,
        },
      });
    }
  );
});

// Get all recordings
app.get("/api/recordings", (req, res) => {
  db.all("SELECT * FROM recordings ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB fetch failed" });
    res.json(rows);
  });
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Get recording by ID (download)
app.get("/api/recordings/:id", (req, res) => {
  db.get("SELECT * FROM recordings WHERE id = ?", [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ message: "Not found" });
    res.sendFile(path.join(__dirname, row.filepath));
  });
});

// Delete recording
app.delete("/api/recordings/:id", (req, res) => {
  const recordingId = req.params.id;

  db.get("SELECT * FROM recordings WHERE id = ?", [recordingId], (err, row) => {
    if (err || !row) return res.status(404).json({ message: "Recording not found" });

    // Delete file from uploads folder
    fs.unlink(path.join(__dirname, row.filepath), (fsErr) => {
      if (fsErr) console.warn("File delete failed:", fsErr.message);
    });

    // Delete from database
    db.run("DELETE FROM recordings WHERE id = ?", [recordingId], (dbErr) => {
      if (dbErr) return res.status(500).json({ message: "DB delete failed" });
      res.json({ message: "Recording deleted successfully" });
    });
  });
});

// Start server
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
