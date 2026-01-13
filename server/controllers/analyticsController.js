const User = require('../models/User');
const Inventory = require('../models/Inventory');
const StockHistory = require('../models/StockHistory');
const { Op } = require('sequelize');

// Helper: Calculate Distance (Haversine Formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

// 1. Predict Blood Stock (Heuristic / Simple Moving Average)
exports.predictStock = async (req, res) => {
    try {
        const { hospitalId, bloodGroup } = req.body;
        
        // Fetch recent history (last 30 entries)
        const history = await StockHistory.findAll({
            where: { hospitalId, bloodGroup },
            order: [['recordedAt', 'DESC']],
            limit: 30
        });

        if (!history.length) {
            return res.json({ 
                success: true, 
                message: "Not enough data for prediction", 
                prediction: "Unknown" 
            });
        }

        // Simple algorithm: Calculate average decline rate
        // In a real ML app, this would use Python/TensorFlow
        let totalChange = 0;
        let count = 0;
        
        for (let i = 0; i < history.length - 1; i++) {
            const current = history[i].quantity;
            const prev = history[i+1].quantity;
            if (current < prev) {
                totalChange += (prev - current);
                count++;
            }
        }

        const avgConsumptionPerRecord = count > 0 ? (totalChange / count) : 0;
        const currentStock = history[0].quantity;
        const daysUntilEmpty = avgConsumptionPerRecord > 0 ? Math.round(currentStock / avgConsumptionPerRecord) : "Stable";

        res.json({
            success: true,
            bloodGroup,
            currentStock,
            avgConsumption: avgConsumptionPerRecord.toFixed(2),
            prediction: avgConsumptionPerRecord > 0 ? `Stock may run out in ~${daysUntilEmpty} updates` : "Stock is stable or increasing",
            recommendation: daysUntilEmpty < 7 ? "URGENT_RESTOCK_NEEDED" : "OK"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error predicting stock", error: error.message });
    }
};

// 2. Find Best 3 Donors (No Diseases, Nearest, Matches Blood)
exports.findBestDonors = async (req, res) => {
    try {
        const { bloodGroup, latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, message: "Location required" });
        }

        // 1. Filter by Blood Group & Availability
        // 2. Filter out users with diseases (Application side filter for flexibility)
        const donors = await User.findAll({
            where: {
                role: 'donor',
                bloodGroup: bloodGroup,
                is_available: true
            }
        });

        // Filter & Sort
        const bestDonors = donors
            .filter(donor => {
                const diseases = donor.diseases ? JSON.parse(donor.diseases) : [];
                return diseases.length === 0; // Filter: Must have NO diseases
            })
            .map(donor => {
                // Calculate distance if donor has location
                let distance = 99999;
                if (donor.latitude && donor.longitude) {
                    distance = getDistance(latitude, longitude, donor.latitude, donor.longitude);
                }
                return { ...donor.toJSON(), distance };
            })
            .sort((a, b) => a.distance - b.distance) // Sort by nearest
            .slice(0, 3); // Top 3

        res.json({
            success: true,
            donors: bestDonors
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error finding donors", error: error.message });
    }
};

// 3. Get Platform Stats
exports.getStats = async (req, res) => {
    try {
        // Get total users
        const totalDonors = await User.count({ where: { role: 'donor' } });
        const totalHospitals = await User.count({ where: { role: 'hospital' } });

        // Get inventory statistics
        const inventoryStats = await Inventory.findAll({
            attributes: ['bloodGroup', [require('sequelize').fn('SUM', require('sequelize').col('quantity')), 'totalQuantity']],
            group: ['bloodGroup']
        });

        res.json({
            success: true,
            stats: {
                totalDonors,
                totalHospitals,
                inventory: inventoryStats
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching stats", error: error.message });
    }
};
