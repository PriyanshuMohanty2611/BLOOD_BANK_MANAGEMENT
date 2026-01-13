const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Hospital = require('./Hospital');

const Request = sequelize.define('Request', {
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
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
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
User.hasMany(Request, { foreignKey: 'userId' });
Request.belongsTo(User, { foreignKey: 'userId' });

Hospital.hasMany(Request, { foreignKey: 'hospitalId' });
Request.belongsTo(Hospital, { foreignKey: 'hospitalId' });

module.exports = Request;
