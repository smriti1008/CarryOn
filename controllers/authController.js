
const userModel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

module.exports.registerUser = async function (req, res) {
    try {
        const { email, password, fullname } = req.body;

        if (!email || !password || !fullname) {
            return res.status(400).json({
                message: "Full name, email, and password are required.",
            });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "You already have an account. Please log in.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullname,
            email,
            password: hashedPassword,
        });

        const token = generateToken(user);

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "Account created successfully!",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({
            message: "Something went wrong during registration.",
        });
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const token = generateToken(user);

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful!",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            message: "Something went wrong during login.",
        });
    }
};

module.exports.logout = function (req, res) {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
        message: "Logged out successfully.",
    });
};
