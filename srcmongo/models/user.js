const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true
    },
    regDate : {
        type: String
    }
});

userSchema.virtual('games',{
    ref: 'Game',
    localField: '_id',
    foreignField: 'UserId'
});

const User = mongoose.model('User', userSchema);

module.exports = User;