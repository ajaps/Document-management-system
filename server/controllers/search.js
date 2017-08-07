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
  models.User.findAll({ attributes: ['id', 'email', 'roleId'],
    where: {
      email: { $iLike: `%${request.query.q}%` },
    },
    order: [['roleId', 'ASC']],
  }).then((users) => {
    if (users.length < 1) {
      return response.status(404).json({
        message: 'No user email matching the search term',
        users,
        more_info: 'https://dmsys.herokuapp.com/#search-for-users',
      });
    }
    response.status(200).json({ users });
  })
  .catch(error => response.status(500).json({
    message: 'An unexpected error occurred',
    error,
  }));
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
  models.Document.findAll(query)
  .then((documents) => {
    if (documents.length < 1) {
      return response.status(404).json({
        message: 'No Document title matching the search term',
        documents,
        more_info: 'https://dmsys.herokuapp.com/#search-for-documents-based-on-title',
      });
    }
    response.status(200).json({ Documents: documents });
  })
  .catch(error => response.status(500).json({
    message: 'An unexpected error occurred',
    error,
  }));
};

module.exports = {
  searchUser,
  searchDocument,
};
