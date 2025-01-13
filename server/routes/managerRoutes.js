const express = require('express');
const {deletePassword, updatePassword, updateCategory, deleteCategory} = require("../controllers/managePassController");
const authenticateToken = require('../middlewares/authTokenMiddleware');

const router = express.Router();

router.use(authenticateToken);

// route to delete password
router.post("/deletePassword", deletePassword);

// route to update password
router.post("/updatePassword", updatePassword);

// route to update category
router.post("/updateCategory", updateCategory);

// route to delete category
router.post("/deleteCategory", deleteCategory);

module.exports = router