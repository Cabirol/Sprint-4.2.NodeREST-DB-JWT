const db = require('./db');
const {Op} = require('sequelize');

const findUsers = () =>{
    return db.User.findAll();
}
const findUserByName = (name)=>{
    return db.User.findOne({where: {name} });
};

const findUserById = (_id) =>{
    return db.User.findOne({where: {_id} });
};

const filterUserByName = (name, _id) =>{
    return db.User.findOne({where:{name, [Op.not]: {_id} }});
};

const newUserInstance = (name, regDate) =>{
    return db.User.build({name, regDate});
};

const saveUser = (user) =>{
    return user.save();
};

const newGameInstance = (die1, die2, UserId) => {
    return db.Game.build({die1, die2, UserId});
};

const saveGame = (game) =>{
    return game.save();
};

const deleteGamesByUser = (UserId) =>{
    return db.Game.destroy({where: {UserId}});
};

const findGames = () => {
    return db.Game.findAll();
};

const findGamesByUser = (UserId) =>{
    return db.Game.findAll({where:{UserId}});
};


module.exports = {
    findUsers,
    findUserByName,
    findUserById,
    filterUserByName,
    newUserInstance,
    saveUser,
    newGameInstance,
    saveGame,
    deleteGamesByUser,
    findGames,
    findGamesByUser
};