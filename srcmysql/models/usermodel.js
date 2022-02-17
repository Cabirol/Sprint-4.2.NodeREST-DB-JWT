const { Sequelize } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        }, 
        regDate:{
            type: Sequelize.STRING
        }
    };

    const options = {
        timestamps:false
    };

    return sequelize.define('User', attributes, options);
}


