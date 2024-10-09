const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin login route
router.post('/login', userController.login);

// Admin registration route
router.post('/register', userController.newUser);

// Protected route to fetch all users
router.get('/getall', //authMiddleware,
    userController.getAllUsers);
router.get('/:id', userController.getUser);

module.exports = router;
