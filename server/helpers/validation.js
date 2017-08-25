
const verifyUserParams = (request) => {
  request.checkBody('username', 'username field is required').notEmpty();
  request.checkBody('email', 'email field is required').notEmpty();
  request.checkBody('email', 'valid email address is required').isEmail();
  request.checkBody('password', 'password field is required').notEmpty();
  request.checkBody('password', '8 or more characters required').len(8);
  return request.getValidationResult();
};

const verifyUpdateUserParams = (request) => {
  request.checkParams('id', 'ID must be specified for this operation')
    .notEmpty();
  request.checkParams('id', 'ID must be a number').isInt();
  request.checkBody('email', 'valid email address is required')
    .optional().isEmail();
  request.checkBody('password', '8 or more characters required')
    .optional().len(8);
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
  request.checkBody('title', '3 to 150 characters required').len(3, 150);
  request.checkBody('content', 'Document content cannot be empty').notEmpty();
  request.checkBody('roleId', 'roleId must be a number').optional().isInt();
  request.checkBody('access', "acesss must be 'public', 'private' or 'role'")
    .optional().isAlpha();
  return request.getValidationResult();
};

const verifyDocUpdateParams = (request) => {
  request.checkParams('id', 'ID must be specified for this operation')
    .notEmpty();
  request.checkParams('id', 'ID must be a number').isInt();
  request.checkBody('title', '3 to 150 characters required')
    .optional().len(3, 150);
  request.checkBody('roleId', 'roleId must be a number').optional().isInt();
  request.checkBody('access', "acesss must be 'public', 'private' or 'role'")
    .optional().isAlpha();
  return request.getValidationResult();
};

const verifyIsInt = (request) => {
  request.checkParams('id', 'ID must be specified for this operation')
    .notEmpty();
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


module.exports = {
  verifyLoginParams,
  verifyUserParams,
  verifyDocumentParams,
  verifyIsInt,
  verifyDocUpdateParams,
  verifyUpdateUserParams,
  verifyString,
};
