const { Router } = require("express");
const {userView,editProductView} = require('../controllers/productController')
const {cartView, purchase, purchaseView} =require("../controllers/cartController")
const {tokenNewPass} = require('../controllers/userController')

const router = Router();
router.get("/", async (req, res) => {
  res.render("login");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/register", async (req, res) => {
  res.render("register");
});
router.get("/forgot-pass", async (req, res) => {
  res.render("forgot-pass");
});
router.get("/forgot-token/:token", tokenNewPass
);

router.get("/create-pass/", async (req, res) => {
  res.render("create-pass");
});


router.get("/new-product", async (req, res) => {
  res.render("new-product");
});

router.get("/home-user", async (req, res) => {
  res.render("user-view");
});

router.get("/home-premium", async (req, res) => {
  res.render("products");
});

router.get('/prod-disponibles',userView)

router.get('/cart-view', cartView)

router.get('/purchase-view', purchase)

router.get('/edit-product/:pid', editProductView)

module.exports = router;
