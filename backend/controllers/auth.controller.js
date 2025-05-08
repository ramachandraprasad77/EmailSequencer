import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/tokenUtils.js";

// User Registration
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // Normalize email before checking existence
        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(409).json({ success: false, error: "User already exists" });
        }

        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        console.error("❌ Registration Error:", error.stack);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // Normalize email before lookup
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ success: false, error: "User not found" });
        }

        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const token = generateToken(user);

        // Set authentication cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: { id: user._id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error("❌ Login Error:", error.stack);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// User Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("❌ Logout Error:", error.stack);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};