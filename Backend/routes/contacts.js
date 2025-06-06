'use strict'

var express = require('express');
var contact_controller = require('../controllers/contacts');
var token = require('../helpers/auth');
var routes = express.Router();

routes.post('/api/contact/create', token.validateToken, contact_controller.create_contact);
routes.put('/api/contact/edit/:_id', token.validateToken, contact_controller.edit_contact);
routes.get('/api/contact/find/:userId', token.validateToken, contact_controller.find_contact_by_user_id);
routes.delete('/api/contact/delete/:_id', token.validateToken, contact_controller.delete_contact);

module.exports = routes;