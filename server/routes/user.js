import bcrypt from 'bcrypt';
import models from '../models/index';
import helper from '../helpers/helper';
import authentication from '../middleware/authentication';

const saltRounds = 10;

const createUser = (request, response) => {
  helper.verifyUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      response.status(412).json({ message: verifiedParams });
      return;
    }
    const password = request.body.password || request.query.password;
    const email = request.body.email || request.query.email;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    models.User.create({
      email,
      password: hashPassword,
    })
    .then((user) => {
      const userToken = authentication.setUserToken(user);
      const data = {
        message: 'New user created successfully',
        token: userToken,
      };
      response.status(201).json(data);
    })
    .catch(() => {
      const data = {
        message: `${email} already exist in the database`,
        token: null,
      };
      response.status(406).json(data);
    });
  });
};


const loginUser = (request, response) => {
  helper.verifyUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      response.status(412).json({ message: verifiedParams });
      return;
    }
    const plainTextpassword = request.body.password || request.query.password;
    const email = request.body.email || request.query.email;
    let validUser = false;
    models.User.find({
      where: {
        email,
      }
    }).then((user) => {
      validUser = bcrypt.compareSync(plainTextpassword, user.password);
      if (validUser) {
        const userInfo = {
          userId: user.id,
          roleId: user.roleId,
          email: user.email,
        };
        const userToken = authentication.setUserToken(userInfo);
        response.status(202).json(
          { message: 'Logged in successful',
            token: userToken });
      } else {
        response.status(401).json(
          { message: 'Invalid username or password',
            token: null });
      }
    })
    .catch(() => {
      response.status(404).json(
        { message: `${email} does not exist in the database`,
          token: null });
    });
  });
};


const allUser = (request, response) => {
  models.User.findAll({ attributes: ['id', 'email', 'roleId']
  }).then((user) => {
    response.status(200).json(user);
  })
  .catch(() => {
    response.status(404).json(
      { message: 'An unexpected error occured, try agian later', });
  });
};


const findUser = (request, response) => {
  const userId = request.params.id;
  if (request.params.id) {
    models.User.findById(userId)
    .then((user) => {
      const result = { userID: user.id,
        userRole: user.roleId,
        email: user.email
      };
      response.status(200).json({ result });
    })
    .catch((error) => {
      response.status(404).json({
        message: `cannot find user with ID: ${userId}`,
        error,
      });
    });
  }
};

const updateUser = (request, response) => {
  models.User.update(request.body, {
    where: {
      id: request.params.id
    },
    returning: true,
    plain: true,
  })
  .then((user) => {
    response.status(200).json({
      message: 'User updated successfully',
      user });
  })
  .catch((error) => {
    response.status(409).json({
      message: 'An error occured while updating user',
      error,
    });
  });
};


module.exports = {
  createUser,
  loginUser,
  allUser,
  findUser,
  updateUser,
};
