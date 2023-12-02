'use strict'

var User = require('../models/user.model');
var Publication = require('../models/publication.model');
var jwt = require("../services/jwt");
var fs = require('fs');
var path = require('path');

async function createPublication(req, res){
    let userId = req.params.idU;
    var sale = new Publication();
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message: 'No tienes permiso para realizar esta acción'});
    }

    if(params.name, params.description, params.stock, params.price){
        try{
            const userFind = await User.findOne({_id:userId});
            if(userFind){
                sale.name = params.name;
                sale.description = params.description;
                sale.stock = params.stock;
                sale.user = userFind._id;
                sale.price = params.price;
                sale.status = true;

                try{
                    const publication = await sale.save();
                    if(publication){
                        return res.status(404).send({message: 'Publicación creada.', publication}); 
                    }else{
                        return res.status(500).send({message: 'Publicación no creada.'});           
                    }
                }catch(err){
                    return res.status(500).send({message: 'Error al crear la publicación', err}); 
                }

            }else{
                return res.status(404).send({message: 'Usuario no encontrado'});   
            }
        }catch(err){
                return res.status(500).send({message: 'Error al buscar el usuario indicado'});
        }

    }else{
        return res.status(401).send({message: 'Debes llenar todos los campos para crear una publicación'});
    }
}

async function updatePublication(req, res){
    let userId = req.params.idU;
    let publicationId = req.params.idP;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        const pubFinded = await Publication.findById(publicationId);
        if(pubFinded.user == userId){
            
        try{
            const userFinded = await User.findById(userId);
            if(userFinded){
                const publicationUpdated = await Publication.findByIdAndUpdate(publicationId, update, {new: true});
                if(publicationUpdated){
                    return res.status(200).send({message: 'Publicación actualizada correctamente', publicationUpdated}); 
                }else{
                    return res.status(500).send({message: 'No fue posible actualizar la publicación'}); 
                }
            }else{
                return res.status(500).send({message: 'Usuario no encontrado.'}); 
            } 
        }catch(err){
        return res.status(500).send({message: 'Error al buscar el usuario.'});        
        }
        }else{
            return res.status(404).send({message: 'No puedes actualizar esta publicación'});        
        }
    }
}

async function deletePublication(req, res){
    let userId = req.params.idU;
    let publicationId = req.params.idP;

    if(userId != req.user.sub){
        return res.status(404).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        const pubFinded = await Publication.findById(publicationId);
        if(pubFinded.user == userId){
            
        try{
            const userFinded = await User.findById(userId);
            if(userFinded){
                const publicationUpdated = await Publication.findByIdAndRemove(publicationId);
                if(publicationUpdated){
                    return res.status(200).send({message: 'Publicación eliminada correctamente'}); 
                }else{
                    return res.status(500).send({message: 'No fue posible eliminar la publicación'}); 
                }
            }else{
                return res.status(500).send({message: 'Usuario no encontrado.'}); 
            } 
        }catch(err){
        return res.status(500).send({message: 'Error al buscar el usuario.'});        
        }
        }else{
            return res.status(404).send({message: 'No puedes eliminar esta publicación'});        
        }
    }
}

module.exports = {
    createPublication,
    updatePublication,
    deletePublication
}
 