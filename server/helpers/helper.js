
const verifyUserParams = (request) => {
  request.checkBody('username', 'username field is required').notEmpty();
  request.checkBody('email', 'email field is required').notEmpty();
  request.checkBody('email', 'valid email address is required').isEmail();
  request.checkBody('password', 'password field is required').notEmpty();
  request.checkBody('password', '8 or more characters required').len(8);
  return request.getValidationResult();
};

const verifyUpdateUserParams = (request) => {
  request.checkParams('id', 'ID must be specified for this operation').notEmpty();
  request.checkParams('id', 'ID must be a number').isInt();
  request.checkBody('email', 'valid email address is required').optional().isEmail();
  request.checkBody('password', '8 or more characters required').optional().len(8);
  return request.getValidationResult();
};

const verifyLoginParams = (request) => {
  request.checkBody('email', 'email field is required').notEmpty();
  request.checkBody('email', 'valid email address is required').isEmail();
  request.checkBody('password', 'password field is required').notEmpty();
  request.checkBody('password', '8 or more characters required').len(8);
  return request.getValidationResult();
};

const verifyDocumentParams = (request) => {
  request.checkBody('title', 'title field is required').notEmpty();
  request.checkBody('title', '10 to 150 characters required').len(10, 150);
  request.checkBody('content', 'Document content cannot be empty').notEmpty();
  request.checkBody('roleId', 'roleId must be a number').optional().isInt();
  request.checkBody('access', "acesss must be 'public', 'private' or 'role'").optional().isAlpha();
  return request.getValidationResult();
};

const verifyDocUpdateParams = (request) => {
  request.checkParams('id', 'ID must be specified for this operation').notEmpty();
  request.checkParams('id', 'ID must be a number').isInt();
  request.checkBody('title', '10 to 150 characters required').optional().len(10, 150);
  request.checkBody('roleId', 'roleId must be a number').optional().isInt();
  request.checkBody('access', "acesss must be 'public', 'private' or 'role'").optional().isAlpha();
  return request.getValidationResult();
};

const verifyIsInt = (request) => {
  request.checkParams('id', 'ID must be specified for this operation').notEmpty();
  request.checkParams('id', 'ID must be a number').isInt();
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
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      order: [['roleId', 'ASC']],
      offset: getPaginate[0],
      limit: getPaginate[1],
    };
  }
  return {
    attributes: ['id', 'username', 'roleId'],
    order: [['roleId', 'ASC']],
    offset: getPaginate[0],
    limit: getPaginate[1],
  };
};

const queryForAllRoles = (request) => {
  const getPaginate = paginate(request);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      offset: getPaginate[0],
      limit: getPaginate[1],
    };
  }
  return {
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

const queryUpdateUser = (request) => {
  const userId = request.params.id;
  return {
    where: { id: userId },
    individualHooks: true,
  };
};

const queryUpdateDeleteDoc = (request) => {
  const documentId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      where: { id: documentId },
    };
  }
  return {
    where: { id: documentId, userId: request.decoded.data.userId },
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
  const getPaginate = paginate(request);
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      where: {
        title: { $iLike: `%${request.query.q}%` },
      },
      order: [['createdAt', 'DESC']],
      offset: getPaginate[0],
      limit: getPaginate[1],
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
    },
    offset: getPaginate[0],
    limit: getPaginate[1],
  };
};

const findUserById = (request) => {
  const userId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return {
      where: { id: userId }
    };
  }
  return {
    attributes: ['id', 'username', 'roleId'],
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

const paginateResult = (data, query, type) => {
  const result = {
    message: 'successful',
    page: Math.floor(query.offset / query.limit) + 1,
    pageCount: Math.ceil(data.count / query.limit),
    pageSize: query.limit,
    totalCount: data.count,
  };
  result[type] = data.rows;
  return result;
};

module.exports = {
  verifyLoginParams,
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
  queryUpdateUser,
  verifyUpdateUserParams,
  paginateResult,
  queryForAllRoles,
};
