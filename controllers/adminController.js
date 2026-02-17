import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

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
