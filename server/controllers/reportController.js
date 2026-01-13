const { spawn } = require('child_process');
const Inventory = require('../models/Inventory');
const Hospital = require('../models/Hospital');
const path = require('path');
const fs = require('fs');

const generateReport = async (req, res) => {
  try {
    let data = [];
    let filename = `report_${Date.now()}.csv`;

    if (req.user.role === 'admin') {
        const inventory = await Inventory.findAll({
            include: [{
                model: Hospital,
                attributes: ['name']
            }]
        });
        
        data = inventory.map(item => ({
          hospitalName: item.Hospital ? item.Hospital.name : 'Unknown',
          bloodGroup: item.bloodGroup,
          quantity: item.quantity
        }));
        filename = `regional_inventory_${Date.now()}.csv`;
    } else {
        // Personal Report for Donors
        data = [{
            'User Name': req.user.name,
            'Blood Group': req.user.bloodGroup,
            'Email': req.user.email,
            'Status': 'Verified Donor',
            'Joined Date': req.user.createdAt ? new Date(req.user.createdAt).toLocaleDateString() : 'N/A',
            'Lives Impacted': '15 (Estimate)'
        }];
        filename = `my_vital_report_${Date.now()}.csv`;
    }

    const { Parser } = require('json2csv');
    
    const fields = req.user.role === 'admin' 
        ? ['hospitalName', 'bloodGroup', 'quantity']
        : ['User Name', 'Blood Group', 'Email', 'Status', 'Joined Date', 'Lives Impacted'];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

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
