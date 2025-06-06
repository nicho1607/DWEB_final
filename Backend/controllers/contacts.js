'use strict'

var Contact = require('../models/contacts');

function create_contact(req, resp) {
    var body = req.body;
    var contact = new Contact();

    contact.userId = body.userId;
    contact.name = body.name;
    contact.lastName = body.lastName;
    contact.landline = body.landline;
    contact.celular = body.celular;
    contact.email = body.email;

    if (
        contact.name === null || contact.name.trim() === '' ||
        contact.lastName === null || contact.lastName.trim() === '' ||
        contact.landline === null || contact.landline.trim() === '' ||
        contact.celular === null || contact.celular.trim() === '' ||
        contact.email === null || contact.email.trim() === ''
    ) {
        return resp.status(400).send({ 'message': 'One or more required variables were not sent' });
    }

    contact.save().then(
        function(saved_contact) {
            resp.status(200).send({ 'message': 'Contact was created succesfully', 'contact': saved_contact });
        },
        function(err) {
            resp.status(500).send({ 'message': 'An error ocurred while creating the contact', 'error': err });
        }
    );
}

function edit_contact(req, resp) {
    var contact_id = req.params._id;
    var update_data = req.body;

    Contact.findByIdAndUpdate(contact_id, update_data, { new: true }).then(
        function(updated_contact) {
            resp.status(200).send({ 'message': 'Contact updated successfully', 'contact': updated_contact });
        },
        function(err) {
            resp.status(500).send({ 'message': 'Error updating the contact', 'error': err });
        }
    );
}

function find_contact_by_user_id(req, resp) {
    var user_id = req.params.userId;

    Contact.find({ userId: user_id }).then(
        function(contacts) {
            resp.status(200).send({ 'contacts': contacts });
        },
        function(err) {
            resp.status(500).send({ 'message': 'Error while searching contacts for this user', 'error': err });
        }
    );
}

function delete_contact(req, resp) {
    var contact_id = req.params._id;

    Contact.findByIdAndDelete(contact_id).then(
        function(deleted_contact) {
            resp.status(200).send({ 'message': 'Contact was deleted succesfully', 'contact': deleted_contact });
        },
        function(err) {
            resp.status(500).send({ 'message': 'An error ocurred while deleting the contact', 'error': err });
        }
    );
}

module.exports = {
    create_contact,
    find_contact_by_user_id,
    delete_contact,
    edit_contact
}