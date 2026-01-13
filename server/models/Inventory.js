const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Hospital = require('./Hospital');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    bloodGroup: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    hospitalId: {
        type: DataTypes.INTEGER,
        references: {
            model: Hospital,
            key: 'id',
        },
    },
});

// Define Relationships
Hospital.hasMany(Inventory, { foreignKey: 'hospitalId' });
Inventory.belongsTo(Hospital, { foreignKey: 'hospitalId' });

module.exports = Inventory;
