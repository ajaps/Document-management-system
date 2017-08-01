'use strict';

var verifyUserParams = function verifyUserParams(request) {
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  request.assert('password', 'password field is required').notEmpty();
  request.assert('password', '8 or more characters required').len(8);
  return request.getValidationResult();
};

var verifyDocumentParams = function verifyDocumentParams(request) {
  request.assert('title', 'title field is required').notEmpty();
  request.assert('title', '10 to 20 characters required').len(10, 30);
  request.assert('content', 'Document content cannot be empty').notEmpty();
  return request.getValidationResult();
};

var verifyIsInt = function verifyIsInt(request) {
  request.assert('id', 'ID must be specified for this operation').notEmpty();
  request.assert('id', 'ID must be a number').isInt();
  return request.getValidationResult();
};

var verifyString = function verifyString(string) {
  var isNumber = string / 1;
  if (isNumber >= 0 || isNumber < 0) {
    return false;
  }
  return true;
};

var paginate = function paginate(request) {
  var limit = request.query.limit;
  var size = request.query.offset;
  if (!limit || limit < 1) {
    limit = 1;
  }
  if (!size || size < 1) {
    var _offset = 10 * (limit - 1);
    return [_offset, 10];
  }
  var offset = size;
  return [offset, limit];
};

var queryForAllDocuments = function queryForAllDocuments(request) {
  var getPaginate = paginate(request);
  var isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { order: [['createdAt', 'DESC']],
      offset: getPaginate[0],
      limit: getPaginate[1]
    };
  }
  return {
    order: [['createdAt', 'DESC']],
    offset: getPaginate[0],
    limit: getPaginate[1],
    where: {
      $or: [{ userId: request.decoded.data.userId }, { access: 'public' }, { access: 'role', roleId: request.decoded.data.roleId }]
    }
  };
};

var queryUpdateDeleteDoc = function queryUpdateDeleteDoc(request) {
  var documentId = request.params.id;
  var isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { id: documentId } };
  }
  return {
    where: { id: documentId, userId: request.decoded.data.userId } };
};

var queryFindDocById = function queryFindDocById(request) {
  var userId = request.params.id;
  var isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { userId: userId } };
  }
  return { where: { userId: userId, access: 'public' } };
};

var querySearchDocuments = function querySearchDocuments(request) {
  var isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { order: [['createdAt', 'DESC']] };
  }
  return { order: [['createdAt', 'DESC']],
    where: {
      $or: [{ userId: request.decoded.data.userId }, { access: 'public' }]
    }
  };
};

var findUserById = function findUserById(request) {
  var userId = request.params.id;
  return {
    attributes: ['id', 'email', 'roleId'],
    where: { id: userId }
  };
};

var queryDocumentsByRole = function queryDocumentsByRole(request) {
  var roleId = request.params.id;
  var isAdmin = request.decoded.data.roleId === 1;
  if (isAdmin) {
    return { where: { roleId: roleId }, order: [['createdAt', 'DESC']] };
  } else if (roleId === request.decoded.data.roleId) {
    return { where: { roleId: roleId }, order: [['createdAt', 'DESC']] };
  }
  return false;
};

module.exports = {
  verifyUserParams: verifyUserParams,
  verifyDocumentParams: verifyDocumentParams,
  paginate: paginate,
  queryForAllDocuments: queryForAllDocuments,
  queryUpdateDeleteDoc: queryUpdateDeleteDoc,
  queryFindDocById: queryFindDocById,
  querySearchDocuments: querySearchDocuments,
  queryDocumentsByRole: queryDocumentsByRole,
  verifyString: verifyString,
  verifyIsInt: verifyIsInt,
  findUserById: findUserById
};