'use strict';

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
   * Searches for users in the database
   * @function searchUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var searchUser = function searchUser(request, response) {
  var searchTerm = request.query.q;
  _index2.default.User.findAll({ attributes: ['id', 'email', 'roleId'],
    email: { $like: searchTerm },
    order: [['roleId', 'ASC']]
  }).then(function (users) {
    var filteredUsers = users.filter(function (user) {
      return RegExp(searchTerm, 'gi').test(user.email);
    });
    response.status(200).json({ users: filteredUsers });
  });
};

/**
   * Searches for documents in the database
   * @function searchDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var searchDocument = function searchDocument(request, response) {
  var query = _helper2.default.querySearchDocuments(request);
  var searchTerm = request.query.q;
  _index2.default.Document.findAll(query).then(function (documents) {
    var filteredDocs = documents.filter(function (document) {
      return RegExp(searchTerm, 'gi').test(document.title);
    });
    response.status(200).json({ Documents: filteredDocs });
  });
};

module.exports = {
  searchUser: searchUser,
  searchDocument: searchDocument
};