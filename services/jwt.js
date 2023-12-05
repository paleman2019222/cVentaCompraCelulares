'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'qtWuJPOuecIxkq5@#TbMD1LcE5lrjZaRj@1N6MM#Py!';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(24, 'hour').unix()
    }
    return jwt.encode(payload, secretKey);
}