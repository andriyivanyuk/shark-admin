const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/public/images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

module.exports = upload;
