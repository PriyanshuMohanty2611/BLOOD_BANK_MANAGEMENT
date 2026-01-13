const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/botController');

// POST /api/bot/chat
router.post('/chat', chatWithBot);

module.exports = router;
