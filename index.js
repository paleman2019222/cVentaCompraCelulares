var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT||8080;
const userInit = require('./controllers/user.controller');
 
 
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://ale22462:v8VaDtntobrDGnHi@cluster0.9n1sllq.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Conectado a BD');
        userInit.createInit();
        app.listen(port, ()=>{
            console.log('Servidor corriendo sin problemas', port)
        })
    }) 
    .catch((err)=>console.log('Error al conectase a la DB', err))