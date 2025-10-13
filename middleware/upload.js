import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ensure these directories exist (server.js already creates uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), "uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  // allow common file types; tweak as needed
  const allowed = /pdf|doc|docx|zip|rar|txt|png|jpg|jpeg/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Unsupported file type"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
