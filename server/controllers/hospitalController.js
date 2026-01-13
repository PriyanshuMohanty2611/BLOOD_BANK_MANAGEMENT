const Hospital = require('../models/Hospital');

// @desc    Add a new hospital
// @route   POST /api/hospitals
// @access  Private/Admin
const addHospital = async (req, res) => {
  const { name, email, phone, address, latitude, longitude } = req.body;

  try {
    const hospital = await Hospital.create({
      name, email, phone, address, latitude, longitude
    });
    res.status(201).json(hospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.findAll();
    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addHospital, getHospitals };
