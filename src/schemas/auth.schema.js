const { z } = require('zod');
// Schéma pour l'inscription (Register)
const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(6).regex(/^(?=.*[A-Z])(?=.*\d).+$/)
});
// Schéma pour la connexion (Login)
const loginSchema = z.object({
    email: z.email(),
    password: z.string()
});
module.exports = { registerSchema, loginSchema };