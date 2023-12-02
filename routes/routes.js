'use strict'

var express = require('express');
var api = express.Router();
var userController = require('../controllers/user.controller');
var publicationController = require('../controllers/publication.controller');
var mdAuth = require('../middlewares/authenticated'); 



api.post('/saveUser', userController.createUser);
api.post('/login', userController.login);
api.post('/updateUser/:idU',mdAuth.ensureAuth, userController.updateUser);
api.post('/deleteUser/:idU',mdAuth.ensureAuth, userController.deleteUser);
api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUsers);

api.post('/createPublication/:idU',mdAuth.ensureAuth, publicationController.createPublication);
api.post('/updatePublication/:idU/:idP',mdAuth.ensureAuth, publicationController.updatePublication);
api.post('/deletePublication/:idU/:idP',mdAuth.ensureAuth, publicationController.deletePublication);

module.exports = api;