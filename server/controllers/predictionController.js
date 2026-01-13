const { spawn } = require('child_process');
const path = require('path');
const StockHistory = require('../models/StockHistory');
const BedHistory = require('../models/BedHistory');
const Hospital = require('../models/Hospital');
const Inventory = require('../models/Inventory');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Helper to run python script
const getPredictionFromPython = (historyData) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [path.join(__dirname, '../scripts/predict.py')]);
        
        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}: ${errorString}`));
            } else {
                try {
                    const result = JSON.parse(dataString);
                    if (result.error) {
                        reject(new Error(result.error));
                    } else {
                        resolve(result.predictions);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${e.message}`));
                }
            }
        });

        // Send data to script
        pythonProcess.stdin.write(JSON.stringify({ history: historyData }));
        pythonProcess.stdin.end();
    });
};

const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

exports.predictStock = async (req, res) => {
    const { hospitalId, bloodGroup } = req.params;
    
    try {
        const history = await StockHistory.findAll({
            where: { hospitalId, bloodGroup },
            order: [['recordedAt', 'ASC']]
        });

        const formattedHistory = history.map(h => ({
            date: h.recordedAt.toISOString().split('T')[0],
            value: h.quantity
        }));

        const predictions = await getPredictionFromPython(formattedHistory);
        res.json({ success: true, predictions });
    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Prediction failed', error: error.message });
    }
};

exports.predictBeds = async (req, res) => {
    const { hospitalId } = req.params;

    try {
        const history = await BedHistory.findAll({
            where: { hospitalId },
            order: [['recordedAt', 'ASC']]
        });

        const formattedHistory = history.map(h => ({
            date: h.recordedAt.toISOString().split('T')[0],
            value: h.availableBeds
        }));

        const predictions = await getPredictionFromPython(formattedHistory);
        res.json({ success: true, predictions });
    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Prediction failed', error: error.message });
    }
};

exports.getNearestHospitalData = async (req, res) => {
    const { lat, lng } = req.query; // User location
    
    if (!lat || !lng) {
        return res.status(400).json({ success: false, message: 'Values lat and lng are required' });
    }

    try {
        const hospitals = await Hospital.findAll({
            include: [{ model: Inventory }]
        });

        // Calculate distances
        const hospitalsWithDist = hospitals.map(h => {
             const dist = calcDistance(parseFloat(lat), parseFloat(lng), h.latitude, h.longitude);
             return { ...h.toJSON(), distance: dist };
        });

        // Sort by distance
        hospitalsWithDist.sort((a, b) => a.distance - b.distance);

        // Get top 3
        const nearest = hospitalsWithDist.slice(0, 3);
        
        // For the nearest one, let's allow fetching detailed prediction if requested?
        // Actually, let's just return the list. The frontend can request prediction for a specific ID.
        
        res.json({ success: true, hospitals: nearest });
    } catch (error) {
        console.error('Nearest Error:', error);
        res.status(500).json({ success: false, message: 'Measurement failed', error: error.message });
    }
};
