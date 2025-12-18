require('dotenv').config();

const express = require('express');
const UserRoutes = require('./routes/user.routes');
const TicketRoutes = require('./routes/ticket.routes');
const TagsRoutes = require('./routes/tags.routes')
const AuthRoutes = require('./routes/auth.routes')
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./errors/errorHandler');
const passport = require('passport');

const app = express();
app.use(passport.initialize());
require('./config/passport')(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);



//Routes
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