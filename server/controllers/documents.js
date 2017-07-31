import models from '../models/index';
import helper from '../helpers/helper';

const createDocument = (request, response) => {
  helper.verifyDocumentParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      response.status(412).json({ message: verifiedParams });
      return;
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
        data: error,
      });
    });
  });
};


const getAllDocument = (request, response) => {
  const query = helper.queryForAllDocuments(request);
  models.Document.findAndCountAll(query)
  .then((documents) => {
    response.status(200).json({
      documentCount: documents.count,
      message: 'successful',
      document: documents.rows,
    });
  });
};


const updateDocument = (request, response) => {
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
};

const deleteDocument = (request, response) => {
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
};

const getDocumentByUserId = (request, response) => {
  const query = helper.queryFindDocById(request);
  models.Document.findAll(query)
  .then((document) => {
    response.status(200).json({
      message: 'retrieved successfully',
      document
    });
  });
};

const getDocumentByRole = (request, response) => {
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
};

module.exports = {
  createDocument,
  getAllDocument,
  updateDocument,
  deleteDocument,
  getDocumentByUserId,
  getDocumentByRole,
};
