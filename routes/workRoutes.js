const express = require('express');
const routes = express.Router();
const workController = require('../controllers/workController');
const authMiddleware = require('../middleware/auth');

// Routes for Work
routes.post('/creatework', authMiddleware, workController.createWork); 
routes.get('/allworks', workController.getAllWorks); 
routes.get('/farmer/active', authMiddleware, workController.getWorksByFarmer); 
routes.get('/farmer/inactive', authMiddleware, workController.getInactiveWorksByFarmer); 
routes.put('/updatework', authMiddleware, workController.updateWork); 
routes.delete('/deletework', authMiddleware, workController.deleteWork); 

module.exports = routes;
