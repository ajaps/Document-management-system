import bcrypt from 'bcrypt';
import authentication from '../middleware/authentication';
import { verifyUserParams, verifyIsInt, verifyLoginParams,
  verifyUpdateUserParams } from '../helpers/validation';
import { getAllUsers, getUserById, updateUser } from '../helpers/query';
import { paginateResult } from '../helpers/pagination';
import models from '../models';

const User = models.User;

/**
   * Creates new user
   * @function createUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const createUser = (request, response) => {
  verifyUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        error: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-user',
      });
    }
    const password = request.body.password;
    const email = request.body.email;
    const username = request.body.username;
    User.create({
      username,
      email,
      password,
    })
    .then((user) => {
      user.roleId = 2;
      const userToken = authentication.setUserToken(user);
      const data = {
        message: 'New user created successfully',
        token: userToken,
      };
      return response.status(201).json(data);
    })
    .catch((error) => {
      const data = {
        error: `${email} already exist`,
        detailed_error: error.errors,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-user',
      };
      return response.status(409).json(data);
    });
  });
};

/**
   * login user, checks the availability of email and passowrd in the database
   * @function loginUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const loginUser = (request, response) => {
  verifyLoginParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        error: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#login-user',
      });
    }
    const plainTextpassword = request.body.password;
    const email = (request.body.email).toLowerCase();
    let validUser = false;
    User.find({
      where: {
        email,
      },
      include: [{ model: models.Role }],
    }).then((user) => {
      validUser = bcrypt.compareSync(plainTextpassword, user.password);
      if (validUser) {
        const userInfo = {
          id: user.id,
          roleType: user.Role.roleName,
          email: user.email,
          roleId: user.roleId,
        };
        const userToken = authentication.setUserToken(userInfo);
        return response.status(202).json(
          { message: 'Logged in successfully',
            token: userToken });
      }
      return response.status(401).json(
        { error: 'Invalid email or password',
          more_info: 'https://dmsys.herokuapp.com/#login-user',
        });
    })
    .catch(error => response.status(404).json(
      { error: `${email} does not exist in the database`,
        detailed_error: error,
        more_info: 'https://dmsys.herokuapp.com/#login-user',
      })
    );
  });
};


/**
   * Gets all instance of user in the database
   * @function allUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const allUser = (request, response) => {
  const query = getAllUsers(request);
  User.findAndCountAll(query).then(users =>
  response.status(200).json(
      paginateResult(users, query, 'users')
    )
  )
  .catch(error => response.status(500).json({
    error: 'An unexpected error occured, try agian later',
    detailed_error: error,
    more_info: 'https://dmsys.herokuapp.com/#find-matching-instances-of-user',
  })
  );
};


/**
   * find user in the database by ID
   * @function findUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const findUser = (request, response) => {
  verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#find-user',
      });
    }
    const query = getUserById(request);
    User.findAll(query)
    .then((user) => {
      if (user.length < 1) {
        return response.status(404).json({
          message: 'userId not found',
          more_info: 'https://dmsys.herokuapp.com/#find-user',
        });
      }
      return response.status(200).json({ user });
    })
    .catch(error => response.status(500).json({
      error: 'An unexpected error occurred',
      detailed_error: error,
    }));
  });
};


/**
   * Updats user attributes in the database
   * @function updateUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const setUpdatedUser = (request, response) => {
  const userId = Number(request.params.id);
  verifyUpdateUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        error: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#update-user',
      });
    }

    const isAdmin = request.decoded.data.roleId === 1;
    if (!isAdmin && userId !== request.decoded.data.id) {
      return response.status(401).json({
        error: "Only an Admin can update another user's attributes",
        more_info: 'https://dmsys.herokuapp.com/#update-user',
      });
    }
    if (!isAdmin) {
      delete request.body.roleId;
    }
    delete request.body.id;
    const query = updateUser(request);
    User.update(request.body, query)
    .then((user) => {
      if (user[0] !== 0) {
        return response.status(200).json({
          message: 'User updated successfully',
        });
      }
      response.status(404).json({
        error: 'UserId does not exist in the database',
      });
    })
    .catch(error => response.status(409).json({
      error: 'Could not update user details',
      detailed_error: error.parent.detail,
      more_info: 'https://dmsys.herokuapp.com/#update-user',
    })
    );
  });
};

/**
   * deletes user record from the database
   * @function deleteUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const deleteUser = (request, response) => {
  const deleteUserId = request.params.id;
  const isAdmin = request.decoded.data.roleId === 1;
  let query;
  if (isAdmin || Number(deleteUserId) === request.decoded.data.id) {
    query = { where: { id: deleteUserId } };
  } else {
    return response.status(401).json({
      message: "Only an Admin can delete another user's record",
      more_info: 'https://dmsys.herokuapp.com/#delete-documents',
    });
  }
  User.destroy(query)
  .then((user) => {
    if (user === 0) {
      return response.status(404).json({
        error: 'User ID does not exist',
        more_info: 'https://dmsys.herokuapp.com/#delete-documents',
      });
    }
    return response.status(200).json({ message: 'User deleted successfully' });
  })
  .catch(error => response.status(500).json({
    error: 'An unexpected error occurred',
    detailed_error: error,
  }));
};

module.exports = {
  createUser,
  loginUser,
  allUser,
  findUser,
  setUpdatedUser,
  deleteUser,
};
