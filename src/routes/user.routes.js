const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const {requireAuth, requireRole} = require('../middlewares/auth.middleware');


userRouter.get('/', requireAuth, (req, res) => {
    userController.getAllUsers
});

userRouter.post('/', requireAuth, (req, res) => {
    userController.createUser
});


// 1. Route Profil (Tout le monde connecté)
userRouter.get('/profile', requireAuth, (req, res) => {
    res.json(req.user);
});
// 2. Route Support (Seulement les Boss)
userRouter.get('/support', requireAuth, requireRole('SUPPORT'), (req, res) => {
    res.json({ message: "Bienvenue dans la zone secrète Suppoty" });
});

module.exports = userRouter;