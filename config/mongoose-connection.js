
const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    throw new Error("MONGODB_URI is missing from .env");
}

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });

module.exports = mongoose.connection;
