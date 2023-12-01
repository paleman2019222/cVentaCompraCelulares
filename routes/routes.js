'use strict'

var express = require('express');
var api = express.Router();
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated'); 



api.post('/saveUser', userController.createUser);
api.post('/login', userController.login);
api.post('/updateUser/:idU',mdAuth.ensureAuth, userController.updateUser);
api.post('/deleteUser/:idU',mdAuth.ensureAuth, userController.deleteUser);
api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUsers);


 
module.exports = api;