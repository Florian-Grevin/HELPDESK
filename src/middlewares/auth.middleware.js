const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const { UnauthorizedError, ForbiddenError } = require('../errors/ApiError');

const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.user
        if (!user) throw new UnauthorizedError(`Unauthorized`);
        if(role !== req.user.role) throw new ForbiddenError(`Droits insuffisants`);
        else next()
    };
};
module.exports = { requireAuth, requireRole };
