const express = require('express');
const router = express.Router();
const { addHospital, getHospitals } = require('../controllers/hospitalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, addHospital).get(getHospitals);

module.exports = router;
