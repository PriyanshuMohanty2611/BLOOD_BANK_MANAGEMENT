const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, generateReport);

module.exports = router;
