const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

router.get('/stock/:hospitalId/:bloodGroup', predictionController.predictStock);
router.get('/beds/:hospitalId', predictionController.predictBeds);
router.get('/nearest', predictionController.getNearestHospitalData);

module.exports = router;
