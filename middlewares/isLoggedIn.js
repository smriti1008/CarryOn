const jwt = require("jsonwebtoken");
const userModel = require("../models/usermodel");

module.exports = async function(req, res, next) {

    console.log("COOKIE:", req.cookies.token);

    if(!req.cookies.token){
        req.flash("error", "you need to login first");
        return res.redirect("/");
    }

    try {

        let decoded = jwt.verify(
            req.cookies.token,
            process.env.JWT_KEY
        );

        let user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        if(!user){
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        // Available in routes
        req.user = user;

        // Available in all EJS files
        res.locals.user = user;

        next();

    }
    catch(err){

        console.log("JWT ERROR:", err.message);

        req.flash("error", "something went wrong.");

        return res.redirect("/");
    }
}