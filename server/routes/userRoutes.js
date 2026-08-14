const express = require("express");
const router = express.Router();

const {
  saveUser,
} = require("../controllers/userController");

router.post("/sync", saveUser);

module.exports = router;