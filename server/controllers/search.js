import helper from '../helpers/helper';
import models from '../models/index';

/**
   * Searches for users in the database
   * @function searchUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const searchUser = (request, response) => {
  const searchTerm = request.query.q;
  models.User.findAll({ attributes: ['id', 'email', 'roleId'],
    email: { $like: searchTerm },
    order: [['roleId', 'ASC']],
  }).then((users) => {
    const filteredUsers = users.filter(user =>
    RegExp(searchTerm, 'gi').test(user.email));
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
const searchDocument = (request, response) => {
  const query = helper.querySearchDocuments(request);
  const searchTerm = request.query.q;
  models.Document.findAll(query)
  .then((documents) => {
    const filteredDocs = documents.filter(document =>
    RegExp(searchTerm, 'gi').test(document.title));
    response.status(200).json({ Documents: filteredDocs });
  });
};

module.exports = {
  searchUser,
  searchDocument,
};
