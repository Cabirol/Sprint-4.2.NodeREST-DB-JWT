const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const config = require('../../config.js');

const db = {};

initialize();

async function initialize() {
    
    const connection = await mysql.createConnection({ host:config.host, port:config.port, user:config.user, password:config.password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

    const sequelize = new Sequelize(config.database, config.user, config.password, { dialect: 'mysql' });

    db.User = require('./models/usermodel.js')(sequelize);
    db.Game = require('./models/gamemodel.js')(sequelize);
    
    const {User, Game} = sequelize.models;

    User.hasMany(Game);
    Game.belongsTo(User);
    
    await sequelize.sync();
}

module.exports = db;