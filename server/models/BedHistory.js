const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BedHistory = sequelize.define('BedHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    totalBeds: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    availableBeds: {
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
            model: 'Hospitals',
            key: 'id',
        },
    },
});

module.exports = BedHistory;
