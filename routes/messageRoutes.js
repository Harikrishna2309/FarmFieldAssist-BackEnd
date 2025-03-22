const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messagesController");

// Routes
router.post("/send", messageController.storeMessage);
router.get("/fetch", messageController.getMessages);

module.exports = router;
