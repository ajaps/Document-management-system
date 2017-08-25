import { searchAllUsers, searchDocuments } from '../helpers/query';
import { paginateResult } from '../helpers/pagination';
import models from '../models';

/**
   * Searches for users in the database
   * @function searchUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const searchUser = (request, response) => {
  const query = searchAllUsers(request);
  models.User.findAndCountAll(query)
  .then((users) => {
    if (users.count < 1) {
      return response.status(404).json({
        message: 'No username matching the search term',
        searchTerm: request.query.q || "query term 'q' not set",
        more_info: 'https://dmsys.herokuapp.com/#search-for-users',
      });
    }
    response.status(200).json(
      paginateResult(users, query, 'users')
    );
  })
  .catch(error => response.status(500).json({
    error: 'An unexpected error occurred',
    detailed_error: error,
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
  const query = searchDocuments(request);
  models.Document.findAndCountAll(query)
  .then((documents) => {
    if (documents.count < 1) {
      return response.status(404).json({
        message: 'No Document title matching the search term',
        searchTerm: request.query.q || "query term 'q' not set",
        more_info:
          'https://dmsys.herokuapp.com/#search-for-documents-based-on-title',
      });
    }
    response.status(200).json(
        paginateResult(documents, query, 'documents')
      );
  })
  .catch(error => response.status(500).json({
    error: 'An unexpected error occurred',
    detailed_error: error,
  }));
};

module.exports = {
  searchUser,
  searchDocument,
};
