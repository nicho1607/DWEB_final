'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var routes_user = require('./routes/users');
var routes_contact = require('./routes/contacts');

var cors = require('cors');
var application = express();

application.use(cors());
application.use(bodyParser.json());
application.use(bodyParser.urlencoded({'extended': false}));
application.use(routes_user);
application.use(routes_contact);

module.exports = application;