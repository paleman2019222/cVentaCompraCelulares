'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var publicationSchema = Schema({
    name: String,
    description: String,
    stock: Number,
    user: {type: Schema.ObjectId, ref: 'user'},
    price: Number,
    status: Boolean
})
module.exports = mongoose.model('publication', publicationSchema);