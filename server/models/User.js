const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('donor', 'admin', 'receiver', 'hospital'), 
        defaultValue: 'donor',
    },
    bloodGroup: {
        type: DataTypes.STRING,
        allowNull: true, // Admin might not have this
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    diseases: {
        type: DataTypes.TEXT, // Storing as JSON string for simplicity
        allowNull: true,
        defaultValue: '[]',
    },
    available_tokens: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    last_donation_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
});

module.exports = User;
