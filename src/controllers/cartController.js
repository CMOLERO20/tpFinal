const CartDao = require("../dao/cartDao");
const ProductDao = require("../dao/productDao");
const TicketDao = require("../dao/ticketDao")
const cartModel = require('../model/cart.models')



const productService = new ProductDao()
const cartService = new CartDao();
const ticketService = new TicketDao();

const getCarts = async(req,res) =>{
    try {
        const data = await cartService.getCarts();
        if(!data){
            req.logger.error('error al traer los carritos');
            return res.status(500).json({
                message: 'something was wrong in GetCarts'
            })
        }
        return res.json({
            message: 'GetCarts',
            carts: data
        })
    } catch (error) {
        req.logger.error(`Error al buscar los carritos` )
        
    }
}

const getCartsById = async(req,res) =>{
    try {
        const {cid} = req.params
        const data = await cartService.getCartById(cid);
        if(!data){
            return res.status(500).json({
                message: 'Carrito no existente'
            })
        }
        return res.json({
            message: 'GetCartById',
            cart: data
        })
    } catch (error) {
        req.logger.error(`Error al buscar el producto` )
        
        
    }

}

const createCart = async(req,res) =>{
    try {
        const uid = req.session.user.id;
        let newCart = {user:uid}
        const data = await cartService.createCart(newCart);
        if(!data){
            return res.status(500).json({
                message: 'something was wrong in createCart'
            })
        }
        return res.json({
            message: 'createCart',
            carts: data
        })
    } catch (error) {
        req.logger.error(`Error al crear el producto` )
        
        
    }
}

const addProduct = async(req,res) =>{
    try {
        const {pid} = req.params
        const uid = req.session.user.id
        let cart = await cartService.getCartByUser(uid);
         if(!cart){  let newCart = {user:uid}
            cart = await cartService.createCart(newCart);
       }
        let product = await productService.getProductById(pid);
        if(product.owner == uid){return res.status(400).json({
            message: 'cannot add a product from your ownership'
        })}
        const result = cart.products.find(prod => prod.product == pid)
        if(!result){
            
            cart.products.push({product:pid,quantity: 1})
            
         } else {result.quantity += 1}
        cart.amount += product.price
        const data = await cartService.updateCart(cart._id,cart);
        if(!data){
            return res.status(500).json({
                message: 'something was wrong in AddProduct'
            })
        }
        return res.status(200).redirect('/cart-view')
        
    } catch (error) {
        req.logger.error(`Error al agregar el producto` )
         
    }

}

const deleteProducts = async(req,res) =>{
    try {
        const {cid,pid} = req.params
        let cart = await cartService.getCartById(cid);      
        const result = cart.products.find(prod => prod.product._id == pid)
      
        if(!result){
            return 'el producto no existe'
            } else if(result.quantity > 1) {result.quantity -= 1; cart.amount -= result.product.price} 
            else {
                let indexId = cart.products.findIndex(product => product._id == pid)
                cart.products.splice(indexId,1)
                cart.amount -= result.product.price
            }
        const resultado = await cartService.updateCart(cid,cart)
        if(!resultado){ return res.status(500).json({
                message: 'something was wrong in deleteProduct'
            }) }

             res.status(200).redirect('/cart-view')
           
    } catch (error) {
        req.logger.error(`Error al borrar el producto` )
       
         
    }

}

const purchase = async(req,res)=>{
    try {
        const cid = req.params.cid
        let cartData = await cartService.getCartById(cid);
        if(!cartData){ 
            return res.status(500).json({
            message: 'something was wrong in GetCartsByid'
        })}
      
        let prodEnStock = []
        let prodSinStock = []
        let cont=0
        let amount = 0;
        let productosCarrito = cartData.products
      
        for (let i = 0; i < productosCarrito.length; i++){
               let prodId = productosCarrito[i].product._id
                let prod = await productService.getProductById(prodId)
                
                if(productosCarrito[i].quantity<=prod.stock){ 
                    prodEnStock.push(productosCarrito[i])
                    prod.stock -= (productosCarrito[i].quantity)
                    await productService.updateProduct(prodId,prod)
                    amount += prod.price*productosCarrito[i].quantity
                   
                }   else {
                    prodSinStock.push(productosCarrito[i]);
                }

                  
            }
        
        if(amount==0){return res.send({message: `Productos sin stock`})}
        cartData.products = prodSinStock;
        cartData.amount -= amount
        await cartService.updateCart(cartData._id,cartData);

        let code = Date.now() + Math.floor(Math.random() * 10000 + 1);
        const ticket = {
            code:code,
            purchase_datetime: Date.now(),
            amount: amount,
            purchaser: cartData.user,
            products: prodEnStock
        }
         let newTicket = await ticketService.createTicket(ticket)
         if(!newTicket){
            return res.status(500).json({
            message: 'something was wrong creating the ticket'
        }) }
      return  res.status(200).render('purchase', {ticketCode: newTicket.code , amount: newTicket.amount, products:newTicket.items} )
 
    } catch (error) {
        console.log("🚀 ~ file: cartController.js:198 ~ purchase ~ error:", error)
        
        
        
    }
}



const cartView = async(req,res) =>{
    try {
        const uid = req.session.user.id
        let cart = await cartModel.findOne({user: uid}).populate('products.product').lean();
        return res.render('carrito', {carrito: cart} )
       
        
    } catch (error) {
        req.logger.error(`Error al cargar la vista` )
         
    }

}

const purchaseView = async(req,res) => {
    try {
        const ticketId = req.session.user.ticket
        let ticket = await ticketService.getTicketById(ticketId);       
        return res.render('purchase', {ticketCode: ticket.code , amount: ticket.amount, products:ticket.items} )
       
        
    } catch (error) {
        req.logger.error(`Error al cargar la vista` )
        
         
    }
}

module.exports = {getCarts,getCartsById,createCart,purchase,addProduct,deleteProducts,cartView, purchaseView};