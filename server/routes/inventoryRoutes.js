const express = require('express');
const router = express.Router();
const { addInventory, getInventory } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addInventory).get(getInventory);

module.exports = router;
