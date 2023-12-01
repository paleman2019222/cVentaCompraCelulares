'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'qtWuJPOuecIxkq5@#TbMD1LcE5lrjZaRj@1N6MM#Py!';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene cabecera de autenticacion.'})
    }else{
        var token = req.headers.authorization.replace(/['"']+/g, '')
        try{
                var payload = jwt.decode(token, secretKey);
                if(payload.exp <= moment().unix()){
                    return res.status(401).send({message: 'El token esta expirado'});
                }
        }catch(err){
            return res.status(404).send({message: 'Token invalido'});
        }

        req.user=payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next)=>{
    var payload = req.user;
    if(payload.role !="ROLE_ADMIN"){
        return res.status(404).send({message: 'no tienes permiso para acceder a esta ruta'})
    }else{
        return next();
    }
}

exports.ensureAuthUser = (req, res, next)=>{
    var payload = req.user;
    if(payload.role !="ROLE_USER"){
        return res.status(404).send({message: 'no tienes permiso para acceder a esta ruta'})
    }else{
        return next();
    }
}

