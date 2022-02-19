const User = require('./models/user.js');
const Game = require('./models/game.js');

const findUsers = () =>{
    return User.find();
}
const findUserByName = (name)=>{
    return User.findOne({name});
};

const findUserById = (_id) =>{
    return User.findOne({_id});
};

const filterUserByName = (name, _id) =>{
    return User.findOne({name, _id: { $ne: _id }});
};

const newUserInstance = (name, regDate) =>{
    return new User({name, regDate});
};

const saveUser = (user) =>{
    return user.save();
};

const newGameInstance = (die1, die2, UserId) => {
    return new Game({die1, die2, UserId});
};

const saveGame = (game) =>{
    return game.save();
};

const deleteGamesByUser = (UserId) =>{
    return Game.deleteMany({UserId});
};

const findGames = () => {
    return Game.find();
};

const findGamesByUser = (UserId) =>{
    return Game.find({UserId});
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