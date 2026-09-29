const express = require("express");
const productModel = require("../models/productmodel");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn")

router.get("/", function(req, res) {
    let error = req.flash("error");
    res.render("index", { error });
});

router.get("/shop", isLoggedIn, async function(req, res) {

    let products = await productModel.find();
    console.log("NUMBER OF PRODUCTS:", products.length);
    res.render("shop", { products });
});



module.exports = router;