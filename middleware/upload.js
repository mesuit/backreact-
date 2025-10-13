// middleware/upload.js
import multer from "multer";
import path from "path";

// Storage config for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder at project root
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique filename
  },
});

export const upload = multer({ storage });
