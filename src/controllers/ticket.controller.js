const ticketService = require('../services/ticket.service');
const asyncHandler = require('../utils/asyncHandler');

const ticketController = {
    getAllTickets: asyncHandler(async (req, res) => {
        const tickets = await ticketService.findAll(req.user, req.body);
        res.status(201).json({ status: 'success', data: { tickets } });
    }),

    createTicket: asyncHandler(async (req, res) => {
        const user = req.user;
        const createdTicket = await ticketService.create(req.body, user.id);
        res.status(201).json(createdTicket);
    }),

    updateStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body || {};
        const updatedTicket = await ticketService.updateStatus(id, status);
        res.status(200).json({ status: 'success', data: { ticket: updatedTicket } });
    })

};

module.exports = ticketController;