import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    const admin = await Admin.create({
        name,
        email,
        password
    });

    res.status(201).json({
        success: true,
        message: "Admin registered successfully"
    });
};


export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
};
