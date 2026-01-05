const passport = require('passport')
const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');



authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post(
  '/login',
  validate(loginSchema),
  passport.authenticate('local', { session: false }), //on garde passport
  authController.login
);

//authRouter.post('/register', authController.register);
//authRouter.post('/login', passport.authenticate('local', { session: false }), authController.login);
authRouter.post('/refresh', authController.refresh);

module.exports = authRouter;