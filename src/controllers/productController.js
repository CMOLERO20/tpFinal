
const ProductDao = require("../dao/productDao");

const productService = new ProductDao();

const {generate100Product,generateProduct} = require("../utils/faker");



const { error } = require("winston");

const  getProducts = async (req,res) => {
        try {
            const productArr = await productService.getAllProducts();
            if (!productArr) {
                req.logger.error('error al traer los productos');
                return res.status(500).json({
                  message: `something was wrong in getProducts`,
                });
              }
              return res.json({
                message: `getProducts`,
                products: productArr,
              });
        } catch (error) { 
          req.logger.error(`Error al obtener los productos` )
            
        }
     };

const     getProductById = async (req,res) => {
    try {
        const {pid} = req.params;
        if(!pid){return res.status(401).json({
          message: `No hay pid`,
        });}
        const data = await productService.getProductById(pid);
        if (!data) {
           throw error
          }
          return res.json({
            message: `getProductsById`,
            product: data,
          });
    } catch (error) { 
      req.logger.error(`Error al buscar el producto` )
      return res.status(500).json({
        message: `something was wrong in getProductById`,
      });
    }
     }

const  addProduct = async (req,res,next) => {
    try {
      const file = req.file;
  if (!file) return res.status(400).send({ message: "Couldn't upload file" });
        const product = req.body;        
      if(!product.owner) {product.owner = req.session.user.id}
      product.thumbnail = `http://localhost:8080/public/uploads/${file.filename}`
        const data = await productService.addProduct(product) ;
        
        if (data.errors) {
          req.logger.error("Error al crear producto")
            return res.status(500).json({
              message: `something was wrong in addProduct`,
              error: data.errors
            });
          }
          next()
    } catch (error) { 
        console.log("🚀 ~ file: productManager.js:59 ~ addProduct ~ error:", error)
        
    }
     }

const  updateProduct = async (req,res,next) => {
        try {
          const {pid} = req.params;
          const product = req.body
          console.log("🚀 ~ file: productController.js:82 ~ updateProduct ~ product:", product)
          const user = req.session.user
          
          console.log("🚀 ~ file: productController.js:87 ~ updateProduct ~  user:",  user)
          if(user.role == 'PREMUIM' || user.role == 'ADMIN'){return res.status(400).json({
              message: 'not allow to do changes'
          })}
            product.owner = user.id
            const data = await productService.updateProduct(pid,product) ;
            console.log("🚀 ~ file: productController.js:91 ~ updateProduct ~ data:", data)
            if (!data) {
              req.logger.error("Error al actualizar el producto")
                return res.status(500).json({
                  message: `something was wrong in updateProduct`,
                });
              }
              next();
        } catch (error) { 
            console.log("🚀 ~ file: productManager.js:77 ~ updateProduct ~ error:", error)
            
        }
         }

const    deleteProduct = async (req,res,next) => {
    try {
        const {pid} = req.params;
        const user = req.session.user
          let product = await productService.getProductById(pid);
          if (!product) {
            req.logger.error("Error al eliminar el producto")
              return res.status(400).json({
                message: `no existe el producto`,
              });
            }
          if(product.owner !== user.id && user.role !== 'ADMIN'){return res.status(500).json({
              message: 'not allow to do changes'
          })}
        const data = await productService.deleteProduct(pid) ;
        
        if (!data) {
            req.logger.error("Error al borrar el producto")
            return res.status(500).json({
              message: `something was wrong in deleteProduct`,
              error: data.errors
            });
          }
          next()
    } catch (error) { 
        
        
        
    }

        }

const generate100Products = async(req,res)=>{
      try {
        const data =  generateProduct();
        console.log("🚀 ~ file: productController.js:106 ~ generate100Products ~ data:", data)
        if(!data){
          return res.status(500).json({
            message: `something was wrong in generate100Products`,
          });
        }
        const result = await productService.addProduct(data)
        return res.json({
          message: 'generate100Products',
          answer: result
        })
      } catch (error) {
        console.log("🚀 ~ file: productController.js:116 ~ generate100Product ~ error:", error)
        
      }

  }
      

const userView = async(req,res)=>{
  let products = await productService.getAllProducts();
  let  productosEnStock = products.filter(prod => prod.stock > 0)
  return res.render('user-view',{productos:productosEnStock})
}

const premiumView = async(req,res)=>{
  const products = await productService.getAllProducts();
  const prods = products.filter(prod => prod.owner == req.session.user.id)
  return res.render('products',{productos:prods})
}
const editProductView = async (req,res)=>{
  
  const product = await productService.getProductById(req.params.pid)
  res.render('edit-product', {product:product})

}
module.exports =  {getProducts,getProductById,addProduct,deleteProduct,updateProduct,generate100Products,userView,premiumView,editProductView};