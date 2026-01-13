const express = require('express');
const router = express.Router();
const { predictStock, findBestDonors, getStats } = require('../controllers/analyticsController');
// const authMiddleware = require('../middleware/authMiddleware'); // Uncomment if protection needed

// POST /api/analytics/predict - Predict stock for a hospital
router.post('/predict', predictStock);

// POST /api/analytics/find-donors - Find best 3 donors
router.post('/find-donors', findBestDonors);

// GET /api/analytics/stats - Get Platform Stats
router.get('/stats', getStats);

module.exports = router;
