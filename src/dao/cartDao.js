const cartModel = require("../model/cart.models")


class CartDao {
    getCarts = async () => {
        try {
            const cartArr = await cartModel.find({});
            return cartArr
        } catch (error) { 
            req.logger.error(`Error al buscar los carritos` )
            
        }
     };

     createCart = async (uid) => {
        try {
            
            return await cartModel.create(uid);

        } catch (error) {
            req.logger.error(`Error al crear el carrito , nivel dao` )
            
        }
     }
     getCartById = async (cid) => {
        try {
            return  await cartModel.findById(cid).populate('products.product').lean()
            
        } catch (error) {
            req.logger.error(`Error al buscar el carrito , nivel dao` )
            
        }
     }
     getCartByUser = async (uid) => {
        try {
            return  await cartModel.findOne({user: uid})
            
        } catch (error) {
            req.logger.error(`Error al buscar el carrito by user, nivel dao` )
            
        }
     }
    

     async updateCart(cid,cart){

        try {
          
            return await cartModel.updateOne({_id:cid},cart);
            
        } catch (error) {
            req.logger.error(`Error al actualizar el carrito` )
            
            
    }
}}

module.exports = CartDao;