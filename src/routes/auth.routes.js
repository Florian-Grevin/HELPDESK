const passport = require('passport')
const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');


authRouter.post('/register', authController.register);
authRouter.post('/login', passport.authenticate('local', { session: false }), authController.login);
authRouter.post('/refresh', authController.refresh);

module.exports = authRouter;