import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/tokenUtils.js";

// User Registration
export const register = async (req, res) => {
    console.time("Register API Response Time");
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // Normalize email for consistency
        const normalizedEmail = email.toLowerCase().trim();

        // Optimize user existence check with indexing
        const userExists = await User.findOne({ email: normalizedEmail }).lean();
        if (userExists) {
            console.timeEnd("Register API Response Time");
            return res.status(409).json({ success: false, error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        console.timeEnd("Register API Response Time");
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
    console.time("Login API Response Time");
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Optimize lookup with `.lean()`
        const user = await User.findOne({ email: normalizedEmail }).lean();
        if (!user) {
            console.timeEnd("Login API Response Time");
            return res.status(401).json({ success: false, error: "User not found" });
        }

        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            console.timeEnd("Login API Response Time");
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        console.timeEnd("Login API Response Time");
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
