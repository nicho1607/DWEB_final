'use strict'

var User = require('../models/users');
var token = require('../helpers/auth');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(15);

function create_user(req, resp) {
    var body = req.body;
    var user = new User();

    user.name = body.name;
    user.lastName = body.lastName;
    user.email = body.email;
    user.password = bcrypt.hashSync(body.password, salt);
    user.role = 'User';

    if (
        !user.name || user.name.trim() === '' ||
        !user.lastName || user.lastName.trim() === '' ||
        !user.email || user.email.trim() === '' ||
        !body.password || body.password.trim() === '' // Validamos con body.password porque user.password ya está encriptado
    ) {
        return resp.status(400).send({ 'message': 'One or more required variables were not sent' });
    }

    user.save().then(
        function(savedUser) {
            resp.status(200).send({ 'message': 'User created successfully', 'user': savedUser });
        },
        function(err) {
            resp.status(500).send({ 'message': 'An error occurred while creating the user', 'error': err });
        }
    );
}

function login_user(req, resp) {
    var body = req.body;

    User.findOne({ email: body.email }).then(
        function(foundUser) {
            if (!foundUser) {
                return resp.status(403).send({ 'message': 'User not found' });
            }

            if (bcrypt.compareSync(body.password, foundUser.password)) {
                return resp.status(200).send({ 'message': 'Login Success', 'token': token.generateToken(foundUser) });
            }

            resp.status(403).send({ 'message': 'Invalid Login' });
        },
        function(err) {
            resp.status(500).send({ 'message': 'An error occurred while validating the user', 'error': err });
        }
    );
}

function edit_user(req, resp) {
    var userId = req.params._id;
    var body = req.body;

    var updatedUser = {
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: 'User'
    };

    User.findByIdAndUpdate(userId, updatedUser, { new: true }).then(
        function(editedUser) {
            resp.status(200).send({ 'message': 'User edited successfully', 'user': editedUser });
        },
        function(err) {
            resp.status(500).send({ 'message': 'Something happened while editing the user', 'error': err });
        }
    );
}

function delete_user(req, resp) {
    var userId = req.params._id;

    User.findByIdAndDelete(userId).then(
        function(deletedUser) {
            resp.status(200).send({ 'message': 'User deleted successfully', 'user': deletedUser });
        },
        function(err) {
            resp.status(500).send({ 'message': 'Something happened while deleting the user', 'error': err });
        }
    );
}

module.exports = {
    create_user,
    login_user,
    edit_user,
    delete_user
};