const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Hospital = require('./Hospital');

const StockHistory = sequelize.define('StockHistory', {
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
        allowNull: false,
    },
    recordedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    hospitalId: {
        type: DataTypes.INTEGER,
        references: {
            model: Hospital,
            key: 'id',
        },
    },
});

// Relationships
Hospital.hasMany(StockHistory, { foreignKey: 'hospitalId' });
StockHistory.belongsTo(Hospital, { foreignKey: 'hospitalId' });

module.exports = StockHistory;
