const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password');
            }
        }
    },
    regDate : {
        type: String
    }
});

userSchema.methods.generateDate = async function(){
    const user = this;
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+' '+time;
    user.regDate = dateTime;
    await user.save();
    return dateTime;
}

const User = mongoose.model('User', userSchema);

module.exports = User;