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

    const scriptPath = path.join(__dirname, '../scripts/report_generator.py');
    const venvPythonPath = path.join(__dirname, '../../.venv/Scripts/python.exe');
    
    // Check if venv python exists, else use default 'python'
    const pythonCmd = fs.existsSync(venvPythonPath) ? venvPythonPath : (process.env.PYTHON_PATH || 'python');
    
    const process_py = spawn(pythonCmd, [scriptPath]);

    process_py.stdin.write(JSON.stringify(data));
    process_py.stdin.end();

    let outputData = '';
    let errorData = '';

    process_py.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    process_py.stderr.on('data', (data) => {
        errorData += data.toString();
        // console.error(`Python Stderr: ${data}`);
    });

    process_py.on('close', (code) => {
        if (code !== 0) {
            console.error("Python Script Error:", errorData);
            return res.status(500).json({ message: 'Report generation failed', error: errorData });
        }
        
        const filePath = outputData.trim();
        
        setTimeout(() => {
             if (fs.existsSync(filePath)) {
                res.download(filePath, (err) => {
                    if (err) {
                         console.error("Download Error:", err);
                         if(!res.headersSent) res.status(500).send("Could not download file");
                    }
                });
            } else {
                 if(!res.headersSent) res.status(404).json({ message: 'Report file not found', path: filePath });
            }
        }, 500);
    });

  } catch (error) {
    if(!res.headersSent) res.status(500).json({ message: error.message });
  }
};

module.exports = { generateReport };
