// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(path.resolve(), "uploads");

// ✅ Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
  },
});

export const upload = multer({ storage });
