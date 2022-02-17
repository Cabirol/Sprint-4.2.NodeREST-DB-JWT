const User = require('../models/user.js');
const Game = require('../models/game.js');

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
module.exports = {
    findUserByName,
    findUserById,
    filterUserByName,
    newUserInstance,
    saveUser
}