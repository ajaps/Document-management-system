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
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-documents'
      });
    }
    models.Document.create({
      title: request.body.title,
      content: request.body.content,
      access: request.body.access,
      userId: request.decoded.data.userId,
      roleId: request.decoded.data.roleId,
    })
    .then(document => response.status(201).json({
      message: 'New Document created successfully',
      title: document.title,
      ownerId: request.decoded.data.userId,
    })
    )
    .catch(error => response.status(409).json({
      message: `An error occured creating new document,
          ensure access is public, private or role`,
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
  models.Document.findAndCountAll(query)
  .then((documents) => {
    if (documents.length < 1) {
      return response.status(404).json({
        message: 'You do not have access to view available documents',
        documents,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-documents',
      });
    }
    response.status(200).json({
      message: 'successful',
      page: query.offset,
      pageCount: Math.ceil(documents.count / query.limit),
      pageSize: query.limit,
      totalCount: documents.count,
      document: documents.rows,
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
const updateDocument = (request, response) => {
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#update-document',
      });
    }
    const query = helper.queryUpdateDeleteDoc(request);
    models.Document.update(request.body, query)
    .then((document) => {
      if (document[0] !== 0) {
        return response.status(200).json({
          message: 'updated successfully',
        });
      }
      return response.status(401).json({
        message: 'You do not have access to view/update the available document',
        more_info: 'https://dmsys.herokuapp.com/#update-document',
      });
    })
    .catch((error) => {
      response.status(400).json({
        message: 'An unexpected error occured while updating document',
        error: error.parent.detail,
        more_info: 'https://dmsys.herokuapp.com/#update-document',
      });
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
        return response.status(200).json({
          message: 'deleted successfully',
          document
        });
      }
      response.status(401).json({
        message: 'You do not have access to view/delete the available documents',
        document,
        more_info: 'https://dmsys.herokuapp.com/#delete-documents',
      });
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
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-userid',
      });
    }
    const query = helper.queryFindDocById(request);
    models.Document.findAll(query)
    .then((documents) => {
      if (documents.length < 1) {
        return response.status(404).json({
          message: 'No Document matching the User Id',
          documents,
          more_info: 'https://dmsys.herokuapp.com/#get-documents-by-userid',
        });
      }
      response.status(200).json({
        message: 'retrieved successfully',
        documents
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
const getDocumentByRole = (request, response) => {
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-roleid',
      });
    }
    const query = helper.queryDocumentsByRole(request);
    if (query === false) {
      return response.status(401).json({
        message: 'You need permission to view documents under this role',
        more_info: 'https://dmsys.herokuapp.com/#get-documents-by-roleid',
      });
    }
    models.Document.findAndCountAll(query)
    .then((documents) => {
      if (documents.length < 1) {
        return response.status(404).json({
          message: 'No Document matching the role Id',
          documents,
          more_info: 'https://dmsys.herokuapp.com/#get-documents-by-roleid',
        });
      }
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
