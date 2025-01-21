const express = require("express");
const multer = require("multer");
const productsController = require("../controllers/productsController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/public/images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();
router.get("/", productsController.getProducts);
router.post("/add", upload.single("image"), productsController.addProduct);

module.exports = router;
