const express = require('express');
const { tempTest, createNewPassword, obtainUserCategories, obtainUserPasswords, obtainPasswordsWithCategories } = require("../controllers/userController");
const authenticateToken = require('../middlewares/authTokenMiddleware');


const router = express.Router();

// autheticate all user routes
router.use(authenticateToken);

router.get("/test", tempTest);

// router to create new password instance
router.post("/createPassword", createNewPassword);

// router to obtain user categories
router.post("/obtainCategories", obtainUserCategories);

// route to obtain all user created passwords
router.post("/obtainPasswords", obtainUserPasswords);

// route to obtain passwords with category ids
router.post("/obtainPasswordsWithCat", obtainPasswordsWithCategories);

module.exports = router;
