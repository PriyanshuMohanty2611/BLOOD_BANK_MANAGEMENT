// Simple Rule-Based Medical Chatbot
// In a real production app, this would connect to OpenAI API or a specialized medical LLM

const Hospital = require('../models/Hospital');
const { Op } = require('sequelize');

const medicalKnowledgeBase = {
    "anemia": "Anemia is a condition in which you lack enough healthy red blood cells to carry adequate oxygen to your body's tissues. Eat iron-rich foods like spinach, red meat, and lentils.",
    "blood pressure": "Normal blood pressure is around 120/80 mmHg. High blood pressure (hypertension) can lead to heart disease. Reduce salt intake and exercise regularly.",
    "diabetes": "Diabetes is a chronic health condition that affects how your body turns food into energy. Monitor blood sugar levels and maintain a healthy diet.",
    "donation": "You can donate blood every 56 days. Ensure you are well-hydrated and have eaten a good meal before donating.",
    "universal donor": "O-negative blood is considered the universal red blood cell donor type.",
    "universal recipient": "AB-positive blood is considered the universal plasma donor type.",
    "dizziness": "If you feel dizzy after donation, lie down with your feet up and drink plenty of fluids."
};

// Haversine Formula for distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

exports.chatWithBot = async (req, res) => {
    try {
        const { message, latitude, longitude } = req.body;
        
        if (!message) {
            return res.status(400).json({ success: false, reply: "Please say something!" });
        }

        const lowerMsg = message.toLowerCase();

        // Check for Nearest Hospital Request
        if (lowerMsg.includes('near') || lowerMsg.includes('hospital')) {
            if (!latitude || !longitude) {
                return res.json({ 
                    success: true, 
                    reply: "I can help you find the nearest hospitals. Please allow location access or check the 'Locate Hospital' page." 
                });
            }

            // Fetch all hospitals
            const hospitals = await Hospital.findAll();
            
            // Calculate distances
            const hospitalsWithDistance = hospitals.map(h => {
                const dist = calculateDistance(latitude, longitude, h.latitude, h.longitude);
                return { ...h.toJSON(), distance: dist };
            });

            // Sort by distance and take top 3
            const nearestHospitals = hospitalsWithDistance
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 3);

            if (nearestHospitals.length === 0) {
                return res.json({ success: true, reply: "No hospitals found in our database." });
            }

            const hospitalList = nearestHospitals.map(h => 
                `${h.name} (${h.distance.toFixed(1)} km) - ${h.address}`
            ).join('\n');

            return res.json({ 
                success: true, 
                reply: `Here are the 3 nearest hospitals:\n${hospitalList}\n\nPlease proceed quickly if this is an emergency.`
            });
        }

        let reply = "I am a simple medical assistant. I can answer basic questions about blood donation, anemia, blood pressure, etc. For serious medical advice, please consult a doctor.";

        // Simple keyword matching
        for (const [key, value] of Object.entries(medicalKnowledgeBase)) {
            if (lowerMsg.includes(key)) {
                reply = value;
                break;
            }
        }
        
        // Greeting override
        if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
            reply = "Hello! How can I assist you with your health or blood donation questions today?";
        }

        res.json({ success: true, reply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Bot error", error: error.message });
    }
};
