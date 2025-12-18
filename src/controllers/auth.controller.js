const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserSchema = require("../models/user.entity");
const AppDataSource = require('../config/data-source');
const asyncHandler = require('../utils/asyncHandler');
const { UnauthorizedError, ConflictError, ForbiddenError } = require('../errors/ApiError');
const secret = process.env.JWT_SECRET;


const authController = {

    register : asyncHandler(async (req, res) => {
        try {
            const {email, password, role} = req.body;

        // 2. Vérifier si l'utilisateur existe déjà (findOneBy email)
            const userRepository = AppDataSource.getRepository("User");
            const user = await userRepository.findOne({ where: { email } });
            if (user) throw new ConflictError("Un utilisateur avec cet email existe déjà.");

        // 3. Hacher le mot de passe (bcrypt.hash) avec un salt de 10
            const hash = await bcrypt.hash(password, 10);
        // 4. Créer l'instance de l'utilisateur
            const newUser = userRepository.create(
            {
                email,
                password: hash,
                role: role || 'CLIENT'
            });
        // 5. Sauvegarder (Repository.save) et répondre 201
            userRepository.save(newUser);
            res.sendStatus(201);

        } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        }
    }),

    login : asyncHandler(async (req, res) => {
        // 1. Récupérer l'user validé par Passport
        const user = req.user;

        // 2. Préparer le Payload
        const payload = {
            id: user.id,
            mail: user.email,
            role: user.role
        };
        // 3. Générer l'ACCESS Token
        const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' })
        // 4. Générer le REFRESH Token
        const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' })
        // 5. Renvoyer les deux tokens au client (JSON)
        res.json({ accessToken, refreshToken });
    }),

    refresh : asyncHandler(async (req, res) => {

        // 1. Récupérer le refreshToken depuis le body
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) throw new UnauthorizedError(`Token expiré. Veuillez vous reconnecter.`);
        // 2. Vérifier le token
        jwt.verify(refreshToken, secret, (err, decodedUser) => {
            if(err) throw new ForbiddenError(`Accès interdit : vous n’avez pas les autorisations nécessaires.`);
            else {
                const payload = {
                    id: decodedUser.id,
                    mail: decodedUser.mail,
                    role: decodedUser.role
                };
                const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' })
                res.json({ accessToken });

            }
        });
    }),
}

module.exports = authController;