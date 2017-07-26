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
    .then((user) => {
      response.status(201).json({
        message: 'New Document created successfully',
        title: user.title,
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

module.exports = {
  createDocument,
};
