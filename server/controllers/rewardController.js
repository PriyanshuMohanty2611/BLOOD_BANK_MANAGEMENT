const User = require('../models/User');

// Get User Rewards Profile
exports.getRewardProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            available_tokens: user.available_tokens,
            history: [] // Placeholder for reward history table if we add one later
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Redeem Tokens (Mock Implementation)
exports.redeemTokens = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.available_tokens < amount) {
            return res.status(400).json({ success: false, message: "Insufficient tokens" });
        }

        // Deduct tokens
        user.available_tokens -= amount;
        await user.save();

        res.json({
            success: true,
            message: `Successfully redeemed ${amount} tokens.`,
            remaining_tokens: user.available_tokens
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
