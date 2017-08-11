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
  const query = helper.queryForAllUsers(request);
  models.User.findAndCountAll({ attributes: ['id', 'username', 'roleId'],
    where: {
      username: { $iLike: `%${request.query.q}%` },
    },
    order: [['roleId', 'ASC']],
  }).then((users) => {
    if (users.count < 1) {
      return response.status(404).json({
        message: 'No username matching the search term',
        searchTerm: request.query.q,
        more_info: 'https://dmsys.herokuapp.com/#search-for-users',
      });
    }
    response.status(200).json({
      message: 'successful',
      page: Math.floor(query.offset / query.limit) + 1,
      pageCount: Math.ceil(users.count / query.limit),
      pageSize: query.limit,
      totalCount: users.count,
      users: users.rows,
    });
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
  models.Document.findAndCountAll(query)
  .then((documents) => {
    if (documents.count < 1) {
      return response.status(404).json({
        message: 'No Document title matching the search term',
        searchTerm: request.query.q,
        more_info: 'https://dmsys.herokuapp.com/#search-for-documents-based-on-title',
      });
    }
    response.status(200).json({
      message: 'successful',
      page: Math.floor(query.offset / query.limit) + 1,
      pageCount: Math.ceil(documents.count / query.limit),
      pageSize: query.limit,
      totalCount: documents.count,
      Documents: documents.rows,
    });
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
