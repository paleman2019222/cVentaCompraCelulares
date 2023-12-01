'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = Schema({
    name: String,
    phone: String,
    username: String,
    email: String,
    role: String,
    password: String
})
module.exports = mongoose.model('user', userSchema);