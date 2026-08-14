const express = require("express");
const router = express.Router();

const {
  saveResume,
  getResumeHistory,
  deleteResume,
  updateResume,
} = require("../controllers/resumeController");

router.post("/save", saveResume);

router.get("/history/:clerkId", getResumeHistory);

router.delete("/:id", deleteResume);
router.put("/:id", updateResume);
module.exports = router;