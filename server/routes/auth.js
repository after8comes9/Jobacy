const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuth } = require("../middleware/authMiddleware");

router.get('/signup', isAuth, authController.signup_get);
router.post('/signup', isAuth, authController.signup_post);
router.get('/login', isAuth, authController.login_get);
router.post('/login', isAuth, authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;