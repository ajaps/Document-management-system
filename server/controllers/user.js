import bcrypt from 'bcrypt';
import authentication from '../middleware/authentication';
import helper from '../helpers/helper';
import models from '../models/index';


/**
   * Creates new user
   * @function createUser
   * @param {object} request request
   * @param {object} response response
   * @return {object} object - information about the status of the request
   */
const createUser = (request, response) => {
  helper.verifyUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#creates-new-user',
      });
    }
    const password = request.body.password;
    const email = request.body.email;
    models.User.create({
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
        message: `${email} already exist`,
        token: null,
        error: error.errors,
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
  helper.verifyUserParams(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#login-user',
      });
    }
    const plainTextpassword = request.body.password;
    const email = request.body.email;
    let validUser = false;
    models.User.find({
      where: {
        email,
      },
      include: [{ model: models.Role }],
    }).then((user) => {
      validUser = bcrypt.compareSync(plainTextpassword, user.password);
      if (validUser) {
        const userInfo = {
          userId: user.id,
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
        { message: 'Invalid email or password',
          token: null,
          more_info: 'https://dmsys.herokuapp.com/#login-user',
        });
    })
    .catch(error => response.status(404).json(
      { message: `${email} does not exist in the database`,
        error,
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
  const query = helper.queryForAllUsers(request);
  models.User.findAndCountAll(query).then(users =>
  response.status(200).json({
    message: 'successful',
    page: Math.floor(query.offset / query.limit) + 1,
    pageCount: Math.ceil(users.count / query.limit),
    pageSize: query.limit,
    totalCount: users.count,
    users: users.rows,
  })
  )
  .catch((error) => response.status(500).json(
    {
      error,
      message: 'An unexpected error occured, try agian later',
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
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#find-user',
      });
    }
    const query = helper.findUserById(request);
    models.User.findAll(query)
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
      message: 'An unexpected error occurred',
      error,
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
const updateUser = (request, response) => {
  const userId = Number(request.params.id);
  helper.verifyIsInt(request)
  .then((result) => {
    const verifiedParams = result.mapped();
    const noErrors = result.isEmpty();
    if (!noErrors) {
      return response.status(412).json({
        message: verifiedParams,
        more_info: 'https://dmsys.herokuapp.com/#update-user',
      });
    }

    const isAdmin = request.decoded.data.roleId === 1;

    if (!isAdmin && userId !== request.decoded.data.userId) {
      return response.status(401).json({
        message: "Only an Admin can update another user's attributes",
        more_info: 'https://dmsys.herokuapp.com/#update-user',
      });
    }
    if (!isAdmin) {
      delete request.body.roleId;
    }
    delete request.body.id;
    models.User.update(request.body, {
      where: {
        id: request.params.id
      },
      returning: true,
      plain: true,
    })
    .then(user => response.status(200).json({
      message: 'User updated successfully',
      result: user[1].dataValues })
    )
    .catch(error => response.status(409).json({
      message: `Could not update user details,
          verify the ID is valid and the roleId exist`,
      error: error.errors,
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
      more_info: 'https://dmsys.herokuapp.com/#update-user',
    });
  }
  models.User.destroy(query)
  .then((user) => {
    if (user === 0) {
      return response.status(404).json({
        message: 'User ID does not exist',
        user,
        more_info: 'https://dmsys.herokuapp.com/#update-user',
      });
    }
    return response.status(200).json({
      message: 'User deleted successfully',
      user });
  })
  .catch(error => response.status(500).json({
    message: 'An unexpected error occurred',
    error,
  }));
};

module.exports = {
  createUser,
  loginUser,
  allUser,
  findUser,
  updateUser,
  deleteUser,
};
