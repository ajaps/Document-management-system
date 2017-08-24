import models from '../models';
import { verifyDocumentParams, verifyDocUpdateParams,
  verifyIsInt } from '../helpers/validation';
import { getAllDocuments, updateDeleteDoc, getDocById, getDocByUserId,
  getDocumentsByRole } from '../helpers/query';
import { paginateResult } from '../helpers/pagination';

const Document = models.Document;
/**
   * Creates a new instance of document in the database
   * @function createDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - contains the response gotten from the request
   */
const createDocument = (request, response) => {
  verifyDocumentParams(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        detailed_error: validationErrors,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-documents'
      });
    }
    Document.create({
      title: request.body.title,
      content: request.body.content,
      access: request.body.access,
      userId: request.decoded.data.id,
      roleId: request.decoded.data.roleId,
    })
    .then(document => response.status(201).json({
      message: 'Document created',
      Document: {
        title: document.title,
        access: document.access,
        ownerId: request.decoded.data.id,
        create_date: document.createdAt,
      }
    })
    )
    .catch(error => response.status(409).json({
      error: 'An unexpected error occurred',
      detailed_error: error,
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
  const query = getAllDocuments(request);
  Document.findAndCountAll(query)
  .then((documents) => {
    if (documents.count < 1) {
      return response.status(401).json({
        error: 'You dont have access to view available document(s)',
        documents,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-documents',
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


/**
   * updates document in the database that matches the document ID supplied
   * @function updateDocument
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the document updated
   */
const updateDocument = (request, response) => {
  verifyDocUpdateParams(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();

    if (!noErrors) {
      return response.status(412).json({
        detailed_error: validationErrors,
        more_info: 'https://dmsys.herokuapp.com/#update-document'
      });
    }
    delete request.body.roleId;
    const query = updateDeleteDoc(request);
    Document.update(request.body, query)
    .then((document) => {
      if (document[0] !== 0) {
        return response.status(200).json({
          message: 'Documents updated successfully',
        });
      }
      Document.findAll({ where: { id: request.query.id } })
      .then((notfound) => {
        if (notfound.length < 1) {
          return response.status(404).json({
            error: 'the Document ID does not exist',
            more_info: 'https://dmsys.herokuapp.com/#update-document',
          });
        }
        response.status(401).json({
          error: 'You require access to update this Document',
          more_info: 'https://dmsys.herokuapp.com/#update-document',
        });
      });
    })
    .catch((error) => {
      response.status(400).json({
        error: 'An unexpected error occured',
        detailed_error: error.errors,
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
  verifyIsInt(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ detailed_error: validationErrors });
    }
    const query = getDocById(request);
    Document.findAll(query)
    .then((document) => {
      if (document.length !== 0) {
        return response.status(200).json({
          message: 'retrieved successfully',
          document
        });
      }
      Document.findAll({ where: { id: request.query.id } })
      .then((notfound) => {
        if (notfound.length < 1) {
          return response.status(404).json({
            error: 'the Document ID does not exist',
            more_info: 'https://dmsys.herokuapp.com/#update-document',
          });
        }
        response.status(401).json({
          error: 'You require access to update this Document',
          more_info: 'https://dmsys.herokuapp.com/#update-document',
        });
      });
    })
    .catch(error => response.status(500).json({
      error: 'An unexpected error occurred',
      detailed_error: error,
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
  verifyIsInt(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({ detailed_error: validationErrors });
    }
    const query = updateDeleteDoc(request);
    Document.destroy(query)
    .then((document) => {
      if (document !== 0) {
        return response.status(200).json({
          message: 'deleted successfully',
        });
      }
      Document.findAll({ where: { id: request.query.id } })
      .then((notfound) => {
        if (notfound.length < 1) {
          return response.status(404).json({
            error: 'the Document ID does not exist',
            more_info: 'https://dmsys.herokuapp.com/#update-document',
          });
        }
        response.status(401).json({
          error: 'You require access to update this Document',
          more_info: 'https://dmsys.herokuapp.com/#update-document',
        });
      });
    })
    .catch(error => response.status(500).json({
      error: 'An unexpected error occurred',
      detailed_error: error,
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
  verifyIsInt(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        error: validationErrors,
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-userid',
      });
    }
    const query = getDocByUserId(request);
    Document.findAll(query)
    .then((documents) => {
      if (documents.length > 0) {
        return response.status(200).json({
          message: 'retrieved successfully',
          documents
        });
      }
      Document.findAll({ where: { id: request.query.id } })
      .then((notfound) => {
        if (notfound.length < 1) {
          return response.status(404).json({
            error: 'UserId does not exist',
            more_info: 'https://dmsys.herokuapp.com/#update-document',
          });
        }
        response.status(401).json({
          error: 'you do not have access to view available document(s)',
          more_info: 'https://dmsys.herokuapp.com/#update-document',
        });
      });
    })
    .catch(error => response.status(500).json({
      error: 'An unexpected error occurred',
      detailed_error: error,
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
  verifyIsInt(request)
  .then((result) => {
    const validationErrors = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        error: validationErrors,
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-roleid',
      });
    }
    const query = getDocumentsByRole(request);
    Document.findAndCountAll(query)
    .then((documents) => {
      if (documents.count < 1) {
        return response.status(404).json({
          error: 'No document exists with the specified role Id',
          more_info: 'https://dmsys.herokuapp.com/#get-documents-by-roleid',
        });
      }
      response.status(200).json(paginateResult(documents, query, 'documents'));
    })
    .catch(error => response.status(500).json({
      error: 'An unexpected error occurred',
      detailed_error: error,
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
