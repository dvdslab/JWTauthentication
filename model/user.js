const mongoose = require('mongoose');
const {
    isEmail
} = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please, enter an email address.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please, enter a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Please, enter a password.'],
        minlength: [6, 'enter a minimum of 6 characters.']
    }
});

// fire a function before doc saved to db
userSchema.pre('save', function (next) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

// statics
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({
        email
    });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('Email is not registered');
}


const User = mongoose.model('user', userSchema);
module.exports = User;