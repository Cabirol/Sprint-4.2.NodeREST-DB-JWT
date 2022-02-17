const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const config = require('../../config.js');

const db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    //const { host:config.host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host:config.host, port:config.port, user:config.user, password:config.password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

    // connect to db
    const sequelize = new Sequelize(config.database, config.user, config.password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = require('../models/usermodel.js')(sequelize);
    db.Game = require('../models/gamemodel.js')(sequelize);
    
    const {User, Game} = sequelize.models;

    User.hasMany(Game);
    Game.belongsTo(User);
    
    // sync all models with database
    await sequelize.sync();
}

module.exports = db;