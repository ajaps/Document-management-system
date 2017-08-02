import models from '../models/index';
import helper from '../helpers/helper';

/**
   * Creates a new instance of document in the database
   * @function createDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the request
   */
const createDocument = (request, response) => {
  helper.verifyDocumentParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    models.Document.create({
      title: request.body.title,
      content: request.body.content,
      access: request.body.access,
      userId: request.decoded.data.userId,
      roleId: request.decoded.data.roleId,
    })
    .then((document) => {
      response.status(201).json({
        message: 'New Document created successfully',
        title: document.title,
        ownerId: request.decoded.data.userId,
      });
    })
    .catch((error) => {
      response.status(409).json({
        message: 'An error occured creating new document',
        data: error.errors,
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
const getAllDocument = (request, response) => {
  const query = helper.queryForAllDocuments(request);
  models.Document.findAndCountAll(query)
  .then(documents =>
    response.status(200).json({
      message: 'successful',
      page: query.offset,
      pageCount: Math.ceil(documents.count / query.limit),
      pageSize: query.limit,
      totalCount: documents.count,
      document: documents.rows,
    })
  );
};


/**
   * updates document in the database that matches the document ID supplied
   * @function updateDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the document updated
   */
const updateDocument = (request, response) => {
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    const query = helper.queryUpdateDeleteDoc(request);
    models.Document.update(request.body, query)
    .then((document) => {
      if (document[0] !== 0) {
        response.status(200).json({
          message: 'updated successfully',
          document
        });
      } else {
        response.status(401).json({
          message: 'You do not have access to view/update the available document',
          document
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
const deleteDocument = (request, response) => {
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    const query = helper.queryUpdateDeleteDoc(request);
    models.Document.destroy(query)
    .then((document) => {
      if (document !== 0) {
        response.status(200).json({
          message: 'deleted successfully',
          document
        });
      } else {
        response.status(401).json({
          message: 'You do not have access to view/delete the available documents',
          document
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
const getDocumentByUserId = (request, response) => {
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    const query = helper.queryFindDocById(request);
    models.Document.findAll(query)
    .then(document =>
      response.status(200).json({
        message: 'retrieved successfully',
        document
      })
    );
  });
};


/**
   * gets all documents that matches the roleId
   * @function getDocumentByRole
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const getDocumentByRole = (request, response) => {
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: verifiedParams });
    }
    const query = helper.queryDocumentsByRole(request);
    if (query === false) {
      response.status(400).json({
        message: 'You need permission to view documents under this role',
        error: true,
      });
    }
    models.Document.findAndCountAll(query)
    .then((documents) => {
      response.status(200).json({
        documentCount: documents.count,
        message: 'retrieved successfully',
        document: documents.rows,
      });
    });
  });
};

module.exports = {
  createDocument,
  getAllDocument,
  updateDocument,
  deleteDocument,
  getDocumentByUserId,
  getDocumentByRole,
};
