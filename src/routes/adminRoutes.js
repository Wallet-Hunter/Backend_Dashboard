const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin login route
router.post('/login', adminController.login);

// Admin registration route
router.post('/register', adminController.newAdmin);

// Protected route to fetch all users
router.get('/getall', //authMiddleware,
     adminController.getAllUsers);

module.exports = router;
