import bcrypt from 'bcrypt';
import models from '../models/index';
import helper from '../helpers/helper';

const saltRounds = 10;

const addUser = (request, response, next) => {
  const verifiedParams = helper.verifyUserParams(request);
  if (verifiedParams.error) {
    response.send(400, { message: verifiedParams.message });
    return;
  }
  const hashPassword = bcrypt.hashSync(request.params.password, saltRounds);
  models.User.create({
    email: request.params.email,
    password: hashPassword,
  })
  .then((user) => {
    const userToken = helper.setUserToken(user.email);
    const data = {
      message: 'New user created successfully',
      token: userToken,
    };
    response.send(201, data);
    next();
  })
  .catch((error) => {
    const data = {
      message: 'Email Address already exist in the database',
      token: null,
    };
    response.send(406, data);
  });
};

module.exports = {
  addUser,
};
