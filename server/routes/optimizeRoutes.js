const express = require("express");
const multer = require("multer");

const {
  optimizeResume,
} = require("../controllers/optimizeController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/",
  upload.single("resume"),
  optimizeResume
);

module.exports = router;