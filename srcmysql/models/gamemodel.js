const {Sequelize} = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        _id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        die1:{
            type: Sequelize.INTEGER,
        },
        die2:{
            type: Sequelize.INTEGER,
        }
    
    };

    const options = {
        timestamps:false
    };

    return sequelize.define('Game', attributes, options);
}