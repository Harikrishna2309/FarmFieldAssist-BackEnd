const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

// Endpoint Check
exports.endpointcheck = (req, res) => {
    res.status(400).send('welcome to farm field app');
};

// Insert User
exports.insertUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            alter_phone,
            cost,
            age,
            role,
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        let role_id = role === 'farmer' ? 0 : 1;
        if(role=='admin'){
            role_id = 99;
        }
        const imagePath = req.file ? req.file.location : null;
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            alter_phone,
            cost,
            age,
            role: role_id,
            image: imagePath,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message,
        });
    }
};
//login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            // expiresIn: '48h',
        });

        res.status(200).json({ success: true, message: 'Login successful', token, id: user.id, role : user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.query;
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const imagePath = req.file ? req.file.location : null;

        if (req.file) {
            updates.image = imagePath;
        }

        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await user.update(updates);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message,
        });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required in query parameters",
            });
        }

        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await user.destroy();

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
};


// Get All Users (Admin Only)
exports.getUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

// Get Single User (Self or Admin Only)
exports.getUser = async (req, res) => {
    try {
        const id = req.query.id;
        const user = await userModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message,
        });
    }
};


