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
  const paginate = helper.paginate(request);
  const isAdmin = RegExp('admin', 'gi').test(request.decoded.data.roleType);
  let query;
  if (isAdmin) {
    query = { order: [['createdAt', 'DESC']],
      offset: paginate[0],
      limit: paginate[1],
    };
  } else {
    query = { order: [['createdAt', 'DESC']],
      offset: paginate[0],
      limit: paginate[1],
      where: {
        $or: [
          { userId: request.decoded.data.userId },
          { access: 'public' }
        ]
      }
    };
  }
  models.Document.findAndCountAll(query)
  .then((document) => {
    response.status(200).json({
      documentCount: document.count,
      message: 'successful',
      document: document.rows,
    });
  })
  .catch((error) => {
    response.status(400).json({
      message: 'An error occured retrieving documents',
      data: error,
    });
  });
};



const updateDocument = (request, response) => {
  const documentId = request.params.id;
  const isAdmin = RegExp('admin', 'gi').test(request.decoded.data.roleType);
  let query;
  if (isAdmin) {
    query = { where: { id: documentId }, returning: true, plain: true, };
  } else {
    query = { where: { id: documentId, userId: request.decoded.data.userId },
      returning: true,
      plain: true, };
  }
  models.Document.update(request.body, query)
  .then((document) => {
    if (!document.length === 0) {
      response.status(200).json({
        message: 'successful',
        document
      });
    } else {
      response.status(401).json({
        message: 'You do not have access to view/update the available documents',
        document
      });
    }
  })
  .catch((error) => {
    response.status(400).json({
      message: `An error occured updating document, confirm you
      have access right to update this document.`,
      error,
    });
  });
};

module.exports = {
  createDocument,
  getAllDocument,
  updateDocument,
};
