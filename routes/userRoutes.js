const express = require('express');
const routes = express.Router();
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/auth'); // For authentication
const userController = require('../controllers/userController');

// Health check endpoint
routes.get('/check', userController.endpointcheck);

// Create a new user
routes.post('/register', upload.single('image'), userController.insertUser);

// User login (to get token)
routes.post('/login', userController.login); // Assuming login is added in userController

// Update a user (requires authentication)
routes.put('/updateuser',authMiddleware,upload.single('image'),userController.updateUser);

// Delete a user (requires authentication)
routes.delete('/deleteuser', authMiddleware, userController.deleteUser);

// Get all users (requires authentication)
routes.get('/allusers', authMiddleware, userController.getUsers);

// Get a single user by ID (requires authentication)
routes.get('/user', authMiddleware, userController.getUser);

module.exports = routes;
