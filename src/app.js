require('dotenv').config();

const express = require('express');
const hpp = require('hpp');
const helmet = require('helmet');
const { globalLimiter } = require('./middlewares/rateLimiter');

const UserRoutes = require('./routes/user.routes');
const TicketRoutes = require('./routes/ticket.routes');
const TagsRoutes = require('./routes/tags.routes')
const AuthRoutes = require('./routes/auth.routes')
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./errors/errorHandler');
const passport = require('passport');

const app = express();

app.use((req, res, next) => {
  console.log("MIDDLEWARE TOUT EN HAUT");
  next();
});


app.use(helmet());

const cors = require('cors');
// Liste des domaines autorisés
const whitelist = ['http://localhost:5500', 'http://localhost:4200'];
const corsOptions = {
origin: function (origin, callback) {
// Cas 1 : L'origine est dans la whitelist -> OK
// Cas 2 : !origin signifie requête serveur-à-serveur (Postman, curl) -> OK
// Pour être ultra-strict et bloquer Postman, retirez "|| !origin"
if (whitelist.indexOf(origin) !== -1 || !origin) { //!origin à retirer après dev
callback(null, true);
} else {
callback(new Error('Bloqué par CORS : Domaine non autorisé'));
}
},
methods: ['GET', 'POST', 'PUT', 'DELETE'], // Verbes autorisés
allowedHeaders: ['Content-Type', 'Authorization'] // Headers autorisés
};
// Application du middleware
app.use(cors(corsOptions));

app.use(passport.initialize());
require('./config/passport')(passport);

// 1. Limiteur Global
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Protection contre la pollution de paramètres (HPP)
app.use(hpp()); //Incompatible avec express 5


app.use(logger);

//Routes
app.get('/test-hpp', (req, res) => {
  res.json(req.query);
});


app.get('/', (req, res) => {
  res.send(`
    HELLO
  `);
});

app.use('/api/users', UserRoutes);
app.use('/api/tickets', TicketRoutes);
app.use('/api/tags', TagsRoutes);
app.use('/api/auth', AuthRoutes);

app.use(errorHandler);

module.exports = app;