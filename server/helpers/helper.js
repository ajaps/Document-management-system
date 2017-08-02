
const verifyUserParams = (request) => {
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  request.assert('password', 'password field is required').notEmpty();
  request.assert('password', '8 or more characters required').len(8);
  return request.getValidationResult();
};

const verifyDocumentParams = (request) => {
  request.assert('title', 'title field is required').notEmpty();
  request.assert('title', '10 to 20 characters required').len(10, 30);
  request.assert('content', 'Document content cannot be empty').notEmpty();
  return request.getValidationResult();
};

const verifyIsInt = (request) => {
  request.assert('id', 'ID must be specified for this operation').notEmpty();
  request.assert('id', 'ID must be a number').isInt();
  return request.getValidationResult();
};

const verifyString = (string) => {
  const isNumber = string / 1;
  if (isNumber >= 0 || isNumber < 0) {
    return false;
  }
  return true;
};

const paginate = (request) => {
  let limit = request.query.limit;
  const size = request.query.offset;
  if (!limit || limit < 1) {
    limit = 1;
  }
  if (!size || size < 1) {
    const offset = 10 * (limit - 1);
    return [offset, 10];
  }
  const offset = size;
  return [offset, limit];
};


const queryForAllDocuments = (request) => {
  const getPaginate = paginate(request);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { order: [['createdAt', 'DESC']],
      offset: getPaginate[0],
      limit: getPaginate[1],
    };
  }
  return {
    order: [['createdAt', 'DESC']],
    offset: getPaginate[0],
    limit: getPaginate[1],
    where: {
      $or: [
        { userId: request.decoded.data.userId },
        { access: 'public' },
        { access: 'role', roleId: request.decoded.data.roleId },
      ]
    },
  };
};

const queryUpdateDeleteDoc = (request) => {
  const documentId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { id: documentId } };
  }
  return {
    where: { id: documentId, userId: request.decoded.data.userId } };
};

const queryFindDocById = (request) => {
  const userId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { userId } };
  }
  return { where: { userId, access: 'public' } };
};

const querySearchDocuments = (request) => {
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { order: [['createdAt', 'DESC']] };
  }
  return { order: [['createdAt', 'DESC']],
    where: {
      $or: [
        { userId: request.decoded.data.userId },
        { access: 'public' }
      ]
    }
  };
};

const findUserById = (request) => {
  const userId = request.params.id;
  return {
    attributes: ['id', 'email', 'roleId'],
    where: { id: userId }
  };
};


const queryDocumentsByRole = (request) => {
  const roleId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { roleId }, order: [['createdAt', 'DESC']] };
  } else if (roleId === request.decoded.data.roleId) {
    return { where: { roleId }, order: [['createdAt', 'DESC']] };
  }
  return false;
};


module.exports = {
  verifyUserParams,
  verifyDocumentParams,
  paginate,
  queryForAllDocuments,
  queryUpdateDeleteDoc,
  queryFindDocById,
  querySearchDocuments,
  queryDocumentsByRole,
  verifyString,
  verifyIsInt,
  findUserById,
};
