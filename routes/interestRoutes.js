const express = require('express');
const routes = express.Router();
const interestController = require('../controllers/interestController');
const authMiddleware = require('../middleware/auth');

// Routes for Interest
routes.post('/express', authMiddleware, interestController.expressInterest);
routes.get('/interests', authMiddleware, interestController.getInterestsByWork); 
routes.get('/interestbyuser', authMiddleware, interestController.getInterestsByLabour);
routes.put('/editinterest', authMiddleware, interestController.updateInterestStatus);

module.exports = routes;
