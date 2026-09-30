const express = require("express");
const productModel = require("../models/productmodel");
const userModel = require("../models/usermodel");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn")

router.get("/", function(req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedIn: false });
});

router.get("/shop", isLoggedIn, async function(req, res) {

    let products = await productModel.find();
    console.log("NUMBER OF PRODUCTS:", products.length);
    let success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/cart", isLoggedIn, async function(req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");
        const bill = (Number(user.cart[0].price)+20)-Number(user.cart[0].discount)
    res.render("cart", {user, bill});
});

router.get("/removefromcart/:id", isLoggedIn, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    user.cart = user.cart.filter(function(product) {
        return product.toString() !== req.params.id;
    });

    await user.save();

    res.redirect("/cart");
});

router.get("/addtocart/:productid", isLoggedIn, async function(req, res) {

    let user = await userModel.findOne({email: req.user.email});
    console.log(user);
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to Cart");
    res.redirect("/shop");
});


module.exports = router;