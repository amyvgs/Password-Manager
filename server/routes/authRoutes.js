const express = require('express');
const { logout ,authMe ,register, login, refreshToken } = require('../controllers/authController');

const router = express.Router();

// route for account registration
router.post("/register", register);

// route for logging in
router.post("/login", login);

// route to refresh token
router.post("/refreshToken", refreshToken);

// route for session persistence
router.post("/me", authMe)

// route for manual logout 
router.post("/logout", logout);


module.exports = router;