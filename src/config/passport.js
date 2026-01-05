const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const AppDataSource = require('./data-source')

module.exports = (passport) => {
passport.use(new LocalStrategy({
usernameField: 'email', // Indiquez à Passport quel champ sert d'identifiant
session: false // Désactivez les sessions (car on fait une API REST)
},
async (email, password, done) => {
    try {
        const userRepository = AppDataSource.getRepository("User");
        const user = await userRepository.findOne({ where: { email: email } });
        
    // Si l'user n'existe pas OU si le mot de passe (bcrypt.compare) est faux :
        if (!user) { return done(null, false, { message: 'Email ou mot de passe incorrect' }); }
        const match = await bcrypt.compare(password, user.password);
        if (!match) { return done(null, false, { message: 'Email ou mot de passe incorrect' }); }

    // Succès
      return done(null, user);    
    }
    catch (err) {
      return done(err);
    }
}
));
const jwtOptions = {
// Indiquez à Passport où trouver le token 
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// Indiquez la clé secrète
secretOrKey: process.env.JWT_SECRET
};
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const userRepository = AppDataSource.getRepository("User");
    const user = await userRepository.findOne({ where: { id: payload.id } });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));
};