const { Router } =  require("express");   
const routerProducts = Router();
const handlePolicies = require("../middleware/handle-policies.middleware")

const {getProducts,getProductById,addProduct,deleteProduct,updateProduct,userView,generate100Products, premiumView} = require("../controllers/productController")

const {validateCreateProduct, validateProductId, validateUpdateProduct} = require('../validations/product.validate.middleware.js');

const {uploader} = require('../utils/multer.js')

routerProducts.get('/faker',generate100Products) 
routerProducts.get('/', getProducts)

routerProducts.get('/:pid', getProductById );

routerProducts.post('/',handlePolicies(['ADMIN','PREMIUM']),uploader.single('file'), validateCreateProduct, addProduct,premiumView)

routerProducts.put('/:pid',validateProductId,handlePolicies(['ADMIN','PREMIUM']),uploader.single('file'), updateProduct,premiumView)

routerProducts.delete('/delete/:pid',validateProductId,handlePolicies(['ADMIN','PREMIUM']),deleteProduct,premiumView)


module.exports = routerProducts;