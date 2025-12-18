const express = require('express');
const tagRouter = express.Router();
const tagController = require('../controllers/tag.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

tagRouter.get('/', requireAuth, (req, res) => {
    tagController.getAllTags(req,res);
});

tagRouter.post('/', requireAuth, (req, res) => {
    tagController.createTag(req,res);
});


module.exports = tagRouter;