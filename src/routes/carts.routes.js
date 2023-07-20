const { Router } =  require("express");   
const {purchase,getCarts,getCartsById,createCart,addProduct,deleteProducts} = require('../controllers/cartController')
const handlePolicies = require("../middleware/handle-policies.middleware")
const {validateCartId} = require('../validations/cart.validation.middleware')
const {validateProductId} = require('../validations/product.validate.middleware')

const routerCarts = Router();



routerCarts.get('/', getCarts);
routerCarts.post('/', createCart);
routerCarts.get('/:cid',validateCartId, getCartsById);
routerCarts.get('/product/:pid',validateProductId, handlePolicies(["USER","PREMIUM","ADMIN"]), addProduct);
routerCarts.delete('/:cid/product/:pid', validateProductId, handlePolicies(["USER","PREMIUM","ADMIN"]),deleteProducts);
routerCarts.get('/:cid/purchase', handlePolicies(["USER","PREMIUM","ADMIN"]), validateCartId,purchase);


module.exports = routerCarts;