const express = require("express");
const productModel = require("../models/productmodel");
const userModel = require("../models/usermodel");

const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn")

router.get("/", function(req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedIn: false });
});


router.get("/shop", isLoggedIn, async function (req, res) {
    try {
        const sortby = req.query.sortby || "popular";

        let products;

        if (sortby === "newest") {
            products = await productModel.find().sort({ _id: -1 });
        } else {
            products = await productModel.find();
        }

        res.render("shop", {
            products,
            sortby,
            success: req.flash("success")
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to load shop");
    }
});


router.get("/cart", isLoggedIn, async function(req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");
        const bill = (Number(user.cart[0].price)+20)-Number(user.cart[0].discount)
    res.render("cart", {user, bill});
});

router.get("/account", isLoggedIn, async function(req, res) {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("orders");

    res.render("account", { user });

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

// API: Get all products for the React frontend


router.get("/api/products", async (req, res) => {
    try {
        const products = await productModel.find().lean();

        const formattedProducts = products.map((product) => {
            const image = product.image;

            console.log("Product:", product.name);
            console.log("Image exists:", !!image);
            console.log("Image type:", image?.constructor?.name);
            console.log("Image length:", image?.length);
            console.log("Image keys:", image ? Object.keys(image).slice(0, 10) : []);

            let buffer = null;

            if (Buffer.isBuffer(image)) {
                buffer = image;
            } else if (image?.buffer) {
                buffer = Buffer.from(image.buffer);
            } else if (image?.data) {
                buffer = Buffer.from(image.data);
            }

            console.log("Converted buffer length:", buffer?.length);

            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                discount: product.discount || 0,
                image: buffer && buffer.length > 0
                    ? `data:image/jpeg;base64,${buffer.toString("base64")}`
                    : null,
            };
        });

        res.json(formattedProducts);
    } catch (error) {
        console.error("Products API error:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});



router.get("/login", function (req, res) {
    res.render("login", {
        error: req.flash("error")
    });
});

router.get("/register", function (req, res) {
    res.render("register", {
        error: req.flash("error")
    });
});

module.exports = router;