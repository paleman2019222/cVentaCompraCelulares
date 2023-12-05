'use strict';
var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
var routes = require('./routes/routes');

var app = express();

app.use(cors({
    origin: '*',  // o especifica el origen de tu aplicación
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

module.exports = app; 
