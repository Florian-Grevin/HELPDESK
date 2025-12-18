const express = require('express');
const ticketRouter = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

ticketRouter.get('/', requireAuth, (req, res) => {
    ticketController.getAllTickets(req,res);
});

/*ticketRouter.get('/notag', requireAuth, (req, res) => {
    ticketController.getAllTicketsNoTag;
});*/

ticketRouter.post('/', requireAuth, (req, res) => {
    ticketController.createTicket(req,res);
});

ticketRouter.patch('/:id/status', requireAuth, requireRole('SUPPORT'), (req, res) => {
    ticketController.updateStatus(req,res);
});

module.exports = ticketRouter;