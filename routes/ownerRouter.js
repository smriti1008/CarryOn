const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownersmodel");

if(process.env.NODE_ENV === "development"){

    router.post("/create", async function(req, res){
    
    let owners = await ownerModel.find();
    if(owners.length>0)
    {
        return res
        .status(505)
        .send("you don't have the permission to create a new owner")
    }

    let {fullname, email, password} = req.body;
    
    let createOwner = await ownerModel.create({
        fullname,
        email,
        password, 
    })
    res.status(201).send(createOwner);
})
}

router.get("/", function(req, res){
    res.send("woahhhh mannnn");
});


module.exports = router;