const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    }
});

userSchema.pre('save', function(next) {
    let user = this;
    if(this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(error, salt) {
            if(error) {
                next(error);
            }
            bcrypt.hash(user.password, salt, null, function(error, hash) {
                if(error) {
                    next(error);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const connection = mongoose.connection;
autoIncrement.initialize(connection);
userSchema.plugin(autoIncrement.plugin, {
    model: 'userModel',
    field: 'userId',
    startAt: 1,
    incrementBy: 1
});

const userModel = mongoose.model('userModel', userSchema, 'Users');
module.exports = {
    userModel
}