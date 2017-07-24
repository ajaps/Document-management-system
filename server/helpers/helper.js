const verifyUserParams = (request) => {
  request.assert('email', 'email field is required').notEmpty();
  request.assert('email', 'valid email address is required').isEmail();
  request.assert('password', 'password field is required').notEmpty();
  request.assert('password', '8 to 20 characters required').len(8, 20);
  return request.getValidationResult();
};

module.exports = {
  verifyUserParams,
};
