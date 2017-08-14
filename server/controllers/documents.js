import helper from '../helpers/helper';
import models from '../models/index';

const Document = models.Document;
/**
   * Creates a new instance of document in the database
   * @function createDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - contains the response gotten from the request
   */
const createDocument = (request, response) => {
  helper.verifyDocumentParams(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: validationErrors,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-documents'
      });
    }
    const docRoleId = request.body.roleId || request.decoded.data.roleId;
    Document.create({
      title: request.body.title,
      content: request.body.content,
      access: request.body.access,
      userId: request.decoded.data.userId,
      roleId: docRoleId,
    })
    .then(document => response.status(201).json({
      message: 'Document created',
      title: document.title,
      ownerId: request.decoded.data.userId,
      Document_roleId: docRoleId,
    })
    )
    .catch(error => response.status(409).json({
      message: 'An unexpected error occurred',
      error: error.errors,
      more_info: 'https://dmsys.herokuapp.com/#creates-new-documents'
    })
    );
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
  Document.findAndCountAll(query)
  .then((documents) => {
    if (documents.count < 1) {
      return response.status(401).json({
        message: 'You dont have access to view available document(s)',
        documents,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-documents',
      });
    }
    response.status(200).json(
      helper.paginateResult(documents, query, 'document')
    );
  })
  .catch(error => response.status(500).json({
    message: 'An unexpected error occurred',
    error,
  }));
};


/**
   * updates document in the database that matches the document ID supplied
   * @function updateDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the document updated
   */
const updateDocument = (request, response) => {
  helper.verifyDocUpdateParams(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();

    if (!noErrors) {
      return response.status(412).json({
        message: validationErrors,
        more_info: 'https://dmsys.herokuapp.com/#update-document'
      });
    }

    const query = helper.queryUpdateDeleteDoc(request);
    Document.update(request.body, query)
    .then((document) => {
      if (document[0] !== 0) {
        return response.status(200).json({
          message: 'updated successfully',
        });
      }
      return response.status(404).json({
        message: 'You require access to update this Doc or the ID does not exist',
        more_info: 'https://dmsys.herokuapp.com/#update-document',
      });
    })
    .catch((error) => {
      response.status(400).json({
        message: 'An unexpected error occured',
        error: error.errors,
        more_info: 'https://dmsys.herokuapp.com/#update-document',
      });
    });
  });
};

/**
   * deletes the document located at the specified ID
   * @function documentById
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the deleted document
   */
const documentById = (request, response) => {
  helper.verifyIsInt(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: validationErrors });
    }
    const query = helper.queryDocbyId(request);
    Document.findAll(query)
    .then((document) => {
      if (document.length !== 0) {
        return response.status(200).json({
          message: 'retrieved successfully',
          document
        });
      }
      response.status(401).json({
        message: 'You require access to view this Doc or the ID does not exist',
        document,
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-id',
      });
    })
    .catch(error => response.status(500).json({
      message: 'An unexpected error occurred',
      error,
    }));
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
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ message: validationErrors });
    }
    const query = helper.queryUpdateDeleteDoc(request);
    Document.destroy(query)
    .then((document) => {
      if (document !== 0) {
        return response.status(200).json({
          message: 'deleted successfully',
          document
        });
      }
      response.status(401).json({
        message: 'You require access to delete this Doc or the ID does not exist',
        document,
        more_info: 'https://dmsys.herokuapp.com/#delete-documents',
      });
    })
    .catch(error => response.status(500).json({
      message: 'An unexpected error occurred',
      error,
    }));
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
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: validationErrors,
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-userid',
      });
    }
    const query = helper.queryFindDocByUserId(request);
    Document.findAll(query)
    .then((documents) => {
      if (documents.length < 1) {
        return response.status(404).json({
          message: `UserId does not exist or you do not have access
            to view available document(s)`,
          documents,
          more_info: 'https://dmsys.herokuapp.com/#get-documents-by-userid',
        });
      }
      response.status(200).json({
        message: 'retrieved successfully',
        documents
      });
    })
    .catch(error => response.status(500).json({
      message: 'An unexpected error occurred',
      error,
    }));
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
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: validationErrors,
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-roleid',
      });
    }
    const query = helper.queryDocumentsByRole(request);
    if (query === false) {
      return response.status(401).json({
        message: 'You require access to view this Doc or the ID does not exist',
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-roleid',
      });
    }
    Document.findAndCountAll(query)
    .then((documents) => {
      if (documents.count < 1) {
        return response.status(404).json({
          message: 'You require access to view this Doc or the ID does not exist',
          documents,
          more_info: 'https://dmsys.herokuapp.com/#get-documents-by-roleid',
        });
      }
      response.status(200).json({
        documentCount: documents.count,
        message: 'retrieved successfully',
        document: documents.rows,
      });
    })
    .catch(error => response.status(500).json({
      message: 'An unexpected error occurred',
      error,
    }));
  });
};

module.exports = {
  createDocument,
  getAllDocument,
  updateDocument,
  documentById,
  deleteDocument,
  getDocumentByUserId,
  getDocumentByRole,
};
