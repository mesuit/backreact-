// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(ext, "")
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "");
    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

export const upload = multer({ storage });
