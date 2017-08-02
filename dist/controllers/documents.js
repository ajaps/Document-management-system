'use strict';

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

var _helper = require('../helpers/helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
   * Creates a new instance of document in the database
   * @function createDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the request
   */
var createDocument = function createDocument(request, response) {
  _helper2.default.verifyDocumentParams(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    _index2.default.Document.create({
      title: request.body.title,
      content: request.body.content,
      access: request.body.access,
      userId: request.decoded.data.userId,
      roleId: request.decoded.data.roleId
    }).then(function (document) {
      response.status(201).json({
        message: 'New Document created successfully',
        title: document.title,
        ownerId: request.decoded.data.userId
      });
    }).catch(function (error) {
      response.status(409).json({
        message: 'An error occured creating new document',
        data: error.errors
      });
    });
  });
};

/**
   * fetches all documents in the database according to the users' access right
   * @function getAllDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - nformation about the documents
   * in the database
   */
var getAllDocument = function getAllDocument(request, response) {
  var query = _helper2.default.queryForAllDocuments(request);
  _index2.default.Document.findAndCountAll(query).then(function (documents) {
    return response.status(200).json({
      message: 'successful',
      page: query.offset,
      pageCount: Math.ceil(documents.count / query.limit),
      pageSize: query.limit,
      totalCount: documents.count,
      document: documents.rows
    });
  });
};

/**
   * updates document in the database that matches the document ID supplied
   * @function updateDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the document updated
   */
var updateDocument = function updateDocument(request, response) {
  _helper2.default.verifyIsInt(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    var query = _helper2.default.queryUpdateDeleteDoc(request);
    _index2.default.Document.update(request.body, query).then(function (document) {
      if (document[0] !== 0) {
        response.status(200).json({
          message: 'updated successfully',
          document: document
        });
      } else {
        response.status(401).json({
          message: 'You do not have access to view/update the available document',
          document: document
        });
      }
    });
  });
};

/**
   * deletes the document located at the specified ID
   * @function deleteDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the deleted document
   */
var deleteDocument = function deleteDocument(request, response) {
  _helper2.default.verifyIsInt(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    var query = _helper2.default.queryUpdateDeleteDoc(request);
    _index2.default.Document.destroy(query).then(function (document) {
      if (document !== 0) {
        response.status(200).json({
          message: 'deleted successfully',
          document: document
        });
      } else {
        response.status(401).json({
          message: 'You do not have access to view/delete the available documents',
          document: document
        });
      }
    });
  });
};

/**
   * gets all documents that matches the userID
   * @function getDocumentByUserId
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var getDocumentByUserId = function getDocumentByUserId(request, response) {
  _helper2.default.verifyIsInt(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    var query = _helper2.default.queryFindDocById(request);
    _index2.default.Document.findAll(query).then(function (document) {
      return response.status(200).json({
        message: 'retrieved successfully',
        document: document
      });
    });
  });
};

/**
   * gets all documents that matches the roleId
   * @function getDocumentByRole
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
var getDocumentByRole = function getDocumentByRole(request, response) {
  _helper2.default.verifyIsInt(request).then(function (result) {
    var verifiedParams = result.mapped();
    var noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    var query = _helper2.default.queryDocumentsByRole(request);
    if (query === false) {
      response.status(400).json({
        message: 'You need permission to view documents under this role',
        error: true
      });
    }
    _index2.default.Document.findAndCountAll(query).then(function (documents) {
      response.status(200).json({
        documentCount: documents.count,
        message: 'retrieved successfully',
        document: documents.rows
      });
    });
  });
};

module.exports = {
  createDocument: createDocument,
  getAllDocument: getAllDocument,
  updateDocument: updateDocument,
  deleteDocument: deleteDocument,
  getDocumentByUserId: getDocumentByUserId,
  getDocumentByRole: getDocumentByRole
};