
const verifyUserParams = (request) => {
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  request.assert('password', 'password field is required').notEmpty();
  request.assert('password', '8 or more characters required').len(8);
  return request.getValidationResult();
};

const verifyDocumentParams = (request) => {
  request.assert('title', 'title field is required').notEmpty();
  request.assert('title', '10 to 150 characters required').len(10, 150);
  request.assert('content', 'Document content cannot be empty').notEmpty();
  return request.getValidationResult();
};

const verifyDocUpdateParams = (request) => {
  if (isNaN(request.params.id)) {
    return {
      id: {
        param: 'id',
        msg: 'ID must be a number',
        value: request.params.id
      },
    };
  }
  if (request.body.title) {
    const titleLength = request.body.title.length;
    if (titleLength < 10 || titleLength > 150) {
      return {
        title: {
          param: 'title',
          msg: '10 to 150 characters required',
          value: request.body.title,
        },
      };
    }
  }
  if (request.body.access) {
    request.body.access = (request.body.access).toLowerCase();
    if (!['public', 'private', 'role'].includes(request.body.access)) {
      return {
        access: {
          param: 'access',
          msg: 'Access type must be public, private or role',
          value: request.body.access,
        },
      };
    }
  }
};

const verifyIsInt = (request) => {
  request.assert('id', 'ID must be specified for this operation').notEmpty();
  request.assert('id', 'ID must be a number').isInt();
  return request.getValidationResult();
};

const verifyString = (stringValue) => {
  const isNumber = stringValue / 1;
  if (isNumber >= 0 || isNumber < 0 || stringValue === undefined) {
    return false;
  }
  return true;
};

const paginate = (request) => {
  let limit = request.query.limit;
  const size = request.query.offset;
  if (!limit || limit < 1) {
    limit = 10;
  }
  if (!size || size < 1) {
    return [0, limit];
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

const queryForAllUsers = (request) => {
  const getPaginate = paginate(request);
  return {
    attributes: ['id', 'email', 'roleId'],
    order: [['roleId', 'ASC']],
    offset: getPaginate[0],
    limit: getPaginate[1],
  };
};

const queryDocbyId = (request) => {
  const documentId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { id: documentId } };
  }
  return {
    where: { id: documentId,
      $or: [
        { access: 'public' },
        { userId: request.decoded.data.userId },
        { $and: [
          { roleId: request.decoded.data.roleId },
          { access: 'role' },
        ] }
      ] }
  };
};

const queryUpdateDeleteDoc = (request) => {
  const documentId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { id: documentId } };
  }
  return {
    where: { id: documentId, userId: request.decoded.data.userId }
  };
};

const queryFindDocByUserId = (request) => {
  const userId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin || userId === request.decoded.data.userId) {
    return { where: { id: userId } };
  }
  return { where: { id: userId,
    $or: [
        { roleId: request.decoded.data.roleId },
        { access: 'public' }
    ], }
  };
};

const querySearchDocuments = (request) => {
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      title: { $iLike: `%${request.query.q}%` },
      order: [['createdAt', 'DESC']]
    };
  }
  return { order: [['createdAt', 'DESC']],
    where: {
      title: { $iLike: `%${request.query.q}%` },
      $or: [
        { userId: request.decoded.data.userId },
        { access: 'public' },
        { $and: [
          { roleId: request.decoded.data.roleId },
          { access: 'role' },
      ] }
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
  const roleId = Number(request.params.id);
  // roleId === request.decoded.data.roleId
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { roleId }, order: [['createdAt', 'DESC']] };
  }
  return { where: { roleId,
    $or: [
        { access: 'public' },
        { userId: request.decoded.data.userId },
      { $and: [
          { roleId: request.decoded.data.roleId },
          { access: 'role' },
      ] }
    ] }
  };
};


module.exports = {
  verifyUserParams,
  verifyDocumentParams,
  paginate,
  queryForAllDocuments,
  queryUpdateDeleteDoc,
  queryFindDocByUserId,
  querySearchDocuments,
  queryDocumentsByRole,
  queryForAllUsers,
  verifyString,
  verifyIsInt,
  findUserById,
  verifyDocUpdateParams,
  queryDocbyId,
};
