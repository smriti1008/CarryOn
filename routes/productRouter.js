const express = require("express");
const router = express.Router();
const multer = require("multer");

const productModel = require("../models/productmodel");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", function(req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

router.post("/create", upload.single("image"), async function(req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        await productModel.create({
            image: req.file ? req.file.buffer : undefined,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });

        req.flash("success", "Product created successfully");
        res.redirect("/product");
    }
    catch(err) {
        console.log(err.message);
        res.send(err.message);
    }
});

module.exports = router;