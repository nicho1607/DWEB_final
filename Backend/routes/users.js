'use strict'

var express = require('express');
var user_controller = require('../controllers/users');
var routes = express.Router();
var token = require('../helpers/auth');

routes.post('/api/register', user_controller.create_user);
routes.post('/api/login', user_controller.login_user);
routes.put('/api/user/edit/:_id', token.validateToken, user_controller.edit_user);
routes.delete('/api/user/delete/:_id', token.validateToken, user_controller.delete_user);

module.exports = routes;