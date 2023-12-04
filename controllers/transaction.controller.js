'use strict'

var User = require('../models/user.model');
var Publication = require('../models/publication.model');
var Transaction = require('../models/transaction.model');

async function buyObject(req, res) {
    const userId = req.params.idU;
    const publicationId = req.params.idP;
    const data = req.body;
    const params = req.body;
    data.status = true;
    if (userId !== req.user.sub) {
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción' });
    }

    try {
        const selfPublication = await Publication.findOne({ user: userId });

        if (selfPublication) {
            return res.status(401).send({ message: 'No puedes comprar tu propio artículo' });
        } else {
            const publicationFinded = await Publication.findById(publicationId);
            const purchaser = await User.findOne({_id:userId});
            const seller = await User.findOne({_id:publicationFinded.user});
            if (publicationFinded) {
                if(publicationFinded.stock<params.quantity){
                    return res.status(401).send({ message: 'La cantidad solicitada excede el stock actual' });
                }
                const stockNow = publicationFinded.stock - params.quantity;
                if (stockNow === 0) {
                    data.status = false;
                } 

                const currentDateTime = new Date();
                const formattedDateTime = currentDateTime.toISOString();
                const totalPurchase = params.quantity * publicationFinded.price;
                const transactionSaved = await Transaction.create({
                    idpublication: publicationFinded._id,
                    description: publicationFinded.name,
                    unitPrice: publicationFinded.price,
                    sellerName: seller.name,
                    purchaserName: purchaser.name,
                    date: formattedDateTime,
                    total: totalPurchase,
                    idseller: publicationFinded.user,
                    idpurchaser: userId
                });

                if (transactionSaved) {
                    const publicationUpdated = await Publication.findByIdAndUpdate(
                        publicationId,
                        { $set: { stock: stockNow, status: data.status }, $push: { transactions: transactionSaved._id } },
                        { new: true }
                    );
                    if (publicationUpdated) {
                        return res.status(200).send({message: 'Compra realizada con éxito', transactionSaved});
                    } 
                } 
            } else {
                return res.status(401).send({ message: 'Publicación no encontrada.' });
            }
        }  
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al realizar la compra' });
    }
}

async function getSells(req, res){
    let userId = req.params.idU;

    if(userId != req.user.sub){
        return res.status(401).send({message: 'No tienes permiso para realizar esta acción'});
    }

        const sellsFinded = await Transaction.find({idseller: userId});
        if(sellsFinded){
            return res.status(200).send({message: 'Tus ventas: ', selss:sellsFinded});
        }
}


module.exports = {
    buyObject,
    getSells

}