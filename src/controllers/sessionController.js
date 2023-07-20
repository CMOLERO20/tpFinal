
const ProductDao = require("../dao/productDao");

const productService = new ProductDao();
const passport = require("passport");
const {generateJWT }= require("../utils/jwt")

const logOut = async (req, res) => {
    req.session.destroy((err) => {
      if (!err) return res.redirect("/login");
      return res.send({ message: `logout Error`, body: err });
    });
  }

const loginCookie =  async (req, res,next) => {
    try {
      if(!req.user)return res.status(400).send({status:"error",error:"Invalid credentials"})
  
      req.session.user = {
        id: req.user._id,
        role: req.user.role,
        email:req.user.email
      };
      
      const token = await generateJWT( req.session.user );
            
      res.cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });
      next()
  
    } catch (error) {
      req.logger.error(`Error al crear la cookie` )
    }
  }  

  const loginView =  async (req, res) => {
    try {
        
      if(req.session.user.role == "USER"){

        const products = await productService.getAllProducts();
        return res.status(200).render('user-view',{productos:products})
      }
      if(req.user.role == "PREMIUM" || req.user.role == "ADMIN" ){
        const products = await productService.getAllProducts();
        const prods = products.filter(prod => prod.owner == req.session.user.id)
        return res.status(200).render('products',{productos:prods})
      }
    
  
    } catch (error) {
      req.logger.error(`Error al cargar la vista` )
    }
  } 

const passportCall = (strategy) =>{
    return async(req,res,next) =>{
        passport.authenticate(strategy,function(err, user, info){
            if(err)return next(err);
            if(!user){

                return res.status(401).send({error:info.message?info.messages:info.toString()})
            }
            req.user = user;
            next();
        })(req,res,next)
    }
}  

 module.exports = {logOut, loginCookie, loginView , passportCall} 