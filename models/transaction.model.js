'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var transactionSchema = Schema({
    idpublication: {type: Schema.ObjectId, ref: 'publication'},
    description: String,
    unitPrice: String,
    idseller: {type: Schema.ObjectId, ref: 'user'},
    sellerName: String,
    idpurchaser: {type: Schema.ObjectId, ref: 'user'},
    purchaserName: String,
    date: String,
    total: String
})
module.exports = mongoose.model('transaction', transactionSchema); 