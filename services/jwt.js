'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'qtWuJPOuecIxkq5@#TbMD1LcE5lrjZaRj@1N6MM#Py!';

exports.createToken = (user) => {
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(24, 'hour').unix()
    };

    // Devuelve una nueva promesa que se resuelve con el token codificado
    return new Promise((resolve, reject) => {
        try {
            const token = jwt.encode(payload, secretKey);
            resolve(token);
        } catch (error) {
            reject(error);
        }
    });
};
