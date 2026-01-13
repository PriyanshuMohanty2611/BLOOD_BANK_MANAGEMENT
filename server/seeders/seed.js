const sequelize = require('../config/database');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Inventory = require('../models/Inventory');
const StockHistory = require('../models/StockHistory');
const BedHistory = require('../models/BedHistory');
const bcrypt = require('bcryptjs');

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const generatePhone = () => {
    return '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
};

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // WARNING: This drops tables!
        console.log('Database synced. Seeding data...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create Admin
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            phone: generatePhone(),
        });

        // 2. Create Hospitals (50)
        const hospitals = [];
        for (let i = 0; i < 50; i++) {
            // Random coordinates around India (roughly)
            const lat = 20 + Math.random() * 10;
            const lng = 77 + Math.random() * 10;
            const totalBeds = 50 + Math.floor(Math.random() * 200);
            
            hospitals.push({
                name: `City Hospital ${i + 1}`,
                email: `hospital${i + 1}@example.com`,
                phone: generatePhone(),
                address: `${Math.floor(Math.random() * 100)} MG Road, Sector ${i}`,
                latitude: lat,
                longitude: lng,
                totalBeds: totalBeds,
                availableBeds: Math.floor(Math.random() * totalBeds * 0.5) // Random available
            });
        }
        const createdHospitals = await Hospital.bulkCreate(hospitals);
        console.log('Created 50 Hospitals');

        // 3. Create Users (Donors/Receivers) (200)
        const users = [];
        for (let i = 0; i < 200; i++) {
            users.push({
                name: `User ${i + 1}`,
                email: `user${i + 1}@test.com`,
                password: hashedPassword,
                role: Math.random() > 0.5 ? 'donor' : 'receiver',
                bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
                phone: generatePhone(),
                age: 18 + Math.floor(Math.random() * 40),
                weight: 50 + Math.floor(Math.random() * 40)
            });
        }
        await User.bulkCreate(users);
        console.log('Created 200 Users');

        // 4. Create Inventory & History
        const inventoryItems = [];
        const stockHistoryItems = [];
        const bedHistoryItems = [];

        // Generate dates for last 30 days
        const dates = [];
        for(let d=29; d>=0; d--) {
            const date = new Date();
            date.setDate(date.getDate() - d);
            dates.push(date);
        }

        for (const hospital of createdHospitals) {
            // Current Inventory
            for (const bg of bloodGroups) {
                const qty = Math.floor(Math.random() * 20);
                inventoryItems.push({
                    hospitalId: hospital.id,
                    bloodGroup: bg,
                    quantity: qty
                });
                
                // History for this BG (simulate fluctuation)
                let currentQty = qty;
                for (const date of dates) {
                    // Random small change
                    const change = Math.floor(Math.random() * 5) - 2; 
                    currentQty = Math.max(0, currentQty + change);
                    
                    stockHistoryItems.push({
                        hospitalId: hospital.id,
                        bloodGroup: bg,
                        quantity: currentQty,
                        recordedAt: date
                    });
                }
            }

            // Bed History
            let currentBeds = hospital.availableBeds;
            for (const date of dates) {
                const change = Math.floor(Math.random() * 10) - 5;
                currentBeds = Math.max(0, Math.min(hospital.totalBeds, currentBeds + change));
                
                bedHistoryItems.push({
                    hospitalId: hospital.id,
                    totalBeds: hospital.totalBeds,
                    availableBeds: currentBeds,
                    recordedAt: date
                });
            }
        }

        await Inventory.bulkCreate(inventoryItems);
        await StockHistory.bulkCreate(stockHistoryItems);
        await BedHistory.bulkCreate(bedHistoryItems);

        console.log('Created Inventory and History Records (Stocks & Beds)');

        console.log('Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
