console.log('Starting server...');

try {
  const express = require('express');
  console.log('Express loaded');
  
  const dotenv = require('dotenv');
  console.log('Dotenv loaded');
  
  const cors = require('cors');
  console.log('CORS loaded');
  
  const sequelize = require('./config/database');
  console.log('Sequelize loaded');
  
  dotenv.config();
  
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
} catch (error) {
  console.error('Fatal error:', error);
  process.exit(1);
}
