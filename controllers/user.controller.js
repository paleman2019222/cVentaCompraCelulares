'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../services/jwt");
var fs = require('fs');
var path = require('path');


//User
//función para crear al administrador

async function createInit(req, res) {
    let user = new User();
    user.password = 'BLLKhtE2';
    user.username = 'ADMIN';

    try {
        const userFind = await User.findOne({ username: user.username });

        if (userFind) {
            console.log('No se puede agregar un nuevo usuario administrador');
        } else {
            const passwordHash = await bcrypt.hashSync(user.password, null, null);

            user.username = 'ADMIN';
            user.name = 'ADMIN';
            user.role = 'ROLE_ADMIN';
            user.password = passwordHash;

            const userSaved = await user.save();

            if (userSaved) {
                console.log('Usuario administrador creado');
            } else {
                console.log('Usuario administrador no creado');
            }
        }
    } catch (err) {
        console.log('Error al crear el usuario', err);
    }
}


async function createUser(req, res){
    let user = new User();
    var params = req.body;

    if(params.name && params.username && params.phone && params.email && params.password){
        try {
            const userFind = await User.findOne({ username: params.username });
            const phoneFind = await User.findOne({phone: params.phone});
            const emailFind = await User.findOne({email: params.email});
            if (userFind) {
                console.log('El nombre de usuario ya está en uso');
                return res.status(400).send({message: 'El nombre de usuario ya está en uso'});
            }else if(phoneFind){
                console.log('El número de teléfono ingresado ya está en uso');
                return res.status(400).send({message: 'El número de teléfono ingresado ya está en uso'});
            }else if(emailFind){
                console.log('El email ingresado ya está en uso');
                return res.status(400).send({message: 'El email ingresado ya está en uso'});
            } else {
                const passwordHash = await bcrypt.hashSync(params.password, null, null);
    
                user.username = params.username;
                user.name = params.name;
                user.role = 'ROLE_USER';
                user.password = passwordHash;
                user.phone = params.phone;
                user.email = params.email;
    
                const userSaved = await user.save();
    
                if (userSaved) {
                    console.log('Usuario creado');
                    return res.status(400).send({message: 'Usuario creado correctamente'});
                } else {
                    console.log('Usuario no creado');
                }
            }
        } catch (err) {
           
        }

    }else{
        return res.status(500).send({message: 'Debes llenar todos los campos'}); 
    }

}

async function login(req, res) {
    const params = req.body;

    if (params.username && params.password) {
        try {
            const userFind = await User.findOne({ username: params.username });
            if (userFind) {
                const passwordCheck = await bcrypt.compare(params.password, userFind.password);

                if (passwordCheck) {
                    if (params.gettoken) {
                        console.log('Sesión iniciada');
                        return res.status(200).send({
                            message: 'Sesión iniciada correctamente',
                            token: await jwt.createToken(userFind),
                            userId: userFind._id,
                            username: userFind.username,
                            name: userFind.name,
                            phone: userFind.phone,
                            email: userFind.email
                        });
                    }
                } else {
                    return res.status(404).send({ message: "Usuario o contraseña incorrecto(s)" });
                }
            }
        } catch (err) {
            console.log('Error al buscar usuario', err);
            return res.status(500).send({ message: 'Error al buscar usuario',err });
        }
    } else {
        return res.status(500).send({ message: 'Ingrese usuario y contraseña' });
    }
}


async function updateUser(req, res){
    let userId = req.params.idU;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message: 'No tienes permiso para realizar esta acción'});
    }    
    
    if(update.password){
        return res.status(401).send({message: 'No se puede actualizar la contraseña desde esta función'});
    }
        
    if(update.role){
        return res.status(401).send({message: 'No puedes cambiar tu rol'});
    }

    if(!update.username){
        try{
            const userUpdated = await User.findByIdAndUpdate(userId, update, {new: true});
            if(userUpdated){
                return res.status(400).send({message: 'Datos actualizados correctamente.'});     
            } 
        }catch(err){
            return res.status(500).send({message: 'Error al editar los datos del usuario'});
        }

    }else{
        const userFind = await User.findOne({username:update.username.toLowerCase()});
        if(userFind){
            if(userFind._id == req.user.sub){
                try{
                    const userUpdated = await User.findByIdAndUpdate(userId, update, {new:true});
                    if(userUpdated){
                        return res.status(400).send({message: 'Datos actualizados correctamente.'});
                    }
                }catch(err){
                    return res.status(500).send({message: 'Error al editar los datos del usuario'});
                }
            }else{
                return res.status(401).send({message: 'Nombre de usuario en uso'});
            }
        }else{
           try {
            const userUpdated = await User.findByIdAndUpdate(userId, update, {new: true});
           if(userUpdated){
                return res.status(400).send({message: 'Datos actualizados correctamente'}); 
           }else{
                return res.status(500).send({message: 'No fue posible actualizar los datos.'}); 
           }
           }catch (err) {
            return res.status(500).send({message: 'Error al editar los datos del usuario'}); 
           }  
        }

    } 
}

async function deleteUser(req, res){
    let userId = req.params.idU;
    let data = req.body;
    if(userId != req.user.sub){
        return res.status(401).send({message: 'No tienes permiso para realizar esta acción'});
    }
    if(!data.password){
        return res.status(401).send({message: 'Debes ingresar la contraseña para eliminar la contraseña'});
    }else{
        const userFind = await User.findById(userId);
        if(userFind){

            if(userFind.role!="ROLE_ADMIN"){
                bcrypt.compare(data.password, userFind.password, async (err, passwordCheck)=>{
                    if(err){
                        return res.status(500).send({message: 'Error al comparar la contraseña'});
                    }else if(passwordCheck){
                        try {
                            const userDeleted = await User.findByIdAndRemove(userId);   
                        } catch (error) {
                            return res.status(500).send({message: 'Error al eliminar el usuario'});
                        }
                    }else{
                        return res.status(400).send({message: 'Contraseña incorrecta'});
                    }
                })
            }else{
                return res.status(401).send({message: 'No es posible eliminar un usuario administrador'});
            }
        }else{
            return res.status(404).send({message: 'Usuario inexistente'});
        }
    }
}

async function getUsers(req, res){
    try{
        const users = await User.find({}).exec();
        if(users){
            res.status(200).send({message: 'Usuarios registrados', users});
        }else{
            res.status(200).send({message: 'No hay registros'});
        }
    }catch(err){
            res.status(200).send({message: 'Error al mostrar los usuarios'});
    }
}

module.exports = {
    createInit,
    createUser,
    login,
    updateUser,
    deleteUser,
    getUsers
}