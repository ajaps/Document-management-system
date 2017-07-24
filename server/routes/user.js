import bcrypt from 'bcrypt';
import models from '../models/index';
import helper from '../helpers/helper';
import authentication from '../middleware/authentication';

const saltRounds = 10;

const addUser = (request, response) => {
  helper.verifyUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      response.status(400).json({ message: verifiedParams });
      return;
    }
    const password = request.query.password;
    const email = request.query.email;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    models.User.create({
      email,
      password: hashPassword,
    })
    .then((user) => {
      const userToken = authentication.setUserToken(user.email);
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
      response.status(400).json({ message: verifiedParams });
      return;
    }
    const plainTextpassword = request.query.password;
    const email = request.query.email;
    let validUser = false;
    models.User.find({
      where: {
        email,
      }
    }).then((user) => {
      validUser = bcrypt.compareSync(plainTextpassword, user.password);
      if (validUser) {
        const userToken = authentication.setUserToken(user.email);
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
  models.User.findAll({
  }).then((user) => {
    response.status(200).json(user);
  })
  .catch(() => {
    response.status(404).json(
      { message: 'An unexpected error occured, try agian later', });
  });
};


module.exports = {
  addUser,
  loginUser,
  allUser,
};
