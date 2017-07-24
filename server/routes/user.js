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
  .catch(() => {
    const data = {
      message: 'Email Address already exist in the database',
      token: null,
    };
    response.send(406, data);
  });
};


const loginUser = (request, response, next) => {
  const verifiedParams = helper.verifyUserParams(request);
  if (verifiedParams.error) {
    response.send(400, { message: verifiedParams.message });
    return;
  }

  let validUser = false;
  models.User.find({
    where: {
      email: request.params.email,
    }
  }).then((user) => {
    let data;
    validUser = bcrypt.compareSync(request.params.password, user.password);
    if (validUser) {
      const userToken = helper.setUserToken(user.email);
      data = {
        message: 'Logged in successful',
        token: userToken
      };
      response.send(202, data);
      next();
    } else {
      data = {
        message: 'Invalid username or password',
        token: null,
      };
      response.send(401, data);
      next();
    }
  });
};

module.exports = {
  addUser,
  loginUser,
};
