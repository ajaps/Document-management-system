const verifyUserParams = (request) => {
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  request.assert('password', 'password field is required').notEmpty();
  request.assert('password', '8 to 20 characters required').len(8, 20);
  return request.getValidationResult();
};

const verifyDocumentParams = (request) => {
  request.assert('title', 'title field is required').notEmpty();
  request.assert('title', '10 to 20 characters required').len(10, 30);
  request.assert('content', 'Document content cannot be empty').notEmpty();
  return request.getValidationResult();
};

const paginate = (request) => {
  let limit = request.query.limit;
  const size = request.query.offset;
  if (!limit || limit < 1) {
    limit = 1;
  }
  if (!size || size < 1) {
    const offset = 5 * (limit - 1);
    return [offset, 5];
  }
  const offset = Number(size * (limit - 1));
  return [offset, size];
};


module.exports = {
  verifyUserParams,
  verifyDocumentParams,
  paginate,
};
