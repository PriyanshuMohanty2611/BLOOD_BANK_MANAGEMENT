const express = require('express');
const router = express.Router();
const { getRewardProfile, redeemTokens } = require('../controllers/rewardController');

router.get('/:userId', getRewardProfile);
router.post('/redeem', redeemTokens);

module.exports = router;
