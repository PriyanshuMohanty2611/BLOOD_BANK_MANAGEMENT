const Inventory = require('../models/Inventory');
const Hospital = require('../models/Hospital');

// @desc    Add or Update Inventory
// @route   POST /api/inventory
// @access  Private (Admin/Hospital)
const addInventory = async (req, res) => {
  const { hospitalId, bloodGroup, quantity } = req.body;

  try {
    // Note: Sequelize uses 'hospitalId' (FK) directly
    let inventory = await Inventory.findOne({ 
        where: { 
            hospitalId: hospitalId, 
            bloodGroup: bloodGroup 
        } 
    });

    if (inventory) {
      inventory.quantity = Number(inventory.quantity) + Number(quantity);
      await inventory.save();
    } else {
      inventory = await Inventory.create({
        hospitalId, bloodGroup, quantity
      });
    }
    
    // Fetch full object with hospital relation to return consistent response if needed, 
    // or just return the record
    res.status(200).json(inventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get Inventory (Filter by Blood Group)
// @route   GET /api/inventory
// @access  Public
const getInventory = async (req, res) => {
  const { bloodGroup } = req.query;
  try {
    let whereClause = {};
    if (bloodGroup) {
      whereClause.bloodGroup = bloodGroup;
    }
    
    const inventory = await Inventory.findAll({
        where: whereClause,
        include: [{
            model: Hospital,
            attributes: ['name', 'address', 'phone', 'latitude', 'longitude']
        }]
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addInventory, getInventory };
