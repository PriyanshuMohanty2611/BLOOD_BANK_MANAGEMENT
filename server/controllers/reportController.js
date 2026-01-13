const { spawn } = require('child_process');
const Inventory = require('../models/Inventory');
const Hospital = require('../models/Hospital');
const path = require('path');
const fs = require('fs');

const generateReport = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({
        include: [{
            model: Hospital,
            attributes: ['name']
        }]
    });
    
    const data = inventory.map(item => ({
      hospitalName: item.Hospital ? item.Hospital.name : 'Unknown', // Sequelize puts relation in capitalized property or based on alias
      bloodGroup: item.bloodGroup,
      quantity: item.quantity
    }));

    const { Parser } = require('json2csv');
    
    const fields = [
      { label: 'Hospital', value: 'hospitalName' },
      { label: 'Blood Group', value: 'bloodGroup' },
      { label: 'Quantity', value: 'quantity' },
      { label: 'Timestamp', value: () => new Date().toLocaleString() }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filename = `inventory_report_${Date.now()}.csv`;
    const filePath = path.join(reportsDir, filename);

    fs.writeFileSync(filePath, csv);

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Download Error:", err);
      }
      // Optional: Cleanup old files here
    });

  } catch (error) {
    if(!res.headersSent) res.status(500).json({ message: error.message });
  }
};

module.exports = { generateReport };
