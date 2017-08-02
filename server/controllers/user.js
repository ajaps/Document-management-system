import bcrypt from 'bcrypt';
import models from '../models/index';
import helper from '../helpers/helper';
import authentication from '../middleware/authentication';

const saltRounds = 10;

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
      return response.status(412).json({ message: verifiedParams });
    }
    const password = request.body.password;
    const email = request.body.email;
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
        message: `${email} already exist`,
        token: null,
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
      return response.status(412).json({ message: verifiedParams });
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
          { message: 'Logged in successful',
            token: userToken });
      }
      return response.status(401).json(
        { message: 'Invalid username or password',
          token: null });
    })
    .catch(() =>
      response.status(404).json(
        { message: `${email} does not exist in the database`,
          token: null })
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
  const paginate = helper.paginate(request);
  models.User.findAndCountAll({ attributes: ['id', 'email', 'roleId'],
    order: [['roleId', 'ASC']],
    offset: paginate[0],
    limit: paginate[1],
  }).then(user =>
  response.status(200).json({ Total_Users: user.count, users: user.rows })
  )
  .catch(() =>
    response.status(404).json(
      { message: 'An unexpected error occured, try agian later', })
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
      return response.status(412).json({ message: verifiedParams });
    }
    const query = helper.findUserById(request);
    models.User.findAll(query)
    .then(user => response.status(200).json({ user }));
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
  const isAdmin = RegExp('admin', 'gi').test(request.decoded.data.roleType);
  request.body.roleId = isAdmin ? request.body.roleId :
    request.body.roleId = request.decoded.data.roleId;
  if (!isAdmin && userId !== request.decoded.data.userId) {
    return response.status(401).json({
      message: "Only an Admin can update another user's attributes",
      error: 401 });
  }
  if (request.body.roleId === undefined) {
    request.body.roleId = request.decoded.data.roleId;
  }
  if (request.body.password !== undefined) {
    request.body.password = bcrypt.hashSync(request.body.password, saltRounds);
  }
  models.User.update(request.body, {
    where: {
      id: request.params.id
    },
    returning: true,
    plain: true,
  })
  .then(user =>
    response.status(200).json({
      message: 'User updated successfully',
      result: user[1].dataValues })
  )
  .catch(error =>
    response.status(409).json({
      message: 'Could not updating user details, verify the ID is valid',
      error: error.errors,
    })
  );
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
      error: true });
  }
  models.User.destroy(query)
  .then((user) => {
    if (user === 0) {
      return response.status(404).json({
        message: 'User ID does not exist',
        user });
    }
    return response.status(200).json({
      message: 'User deleted successfully',
      user });
  });
};

module.exports = {
  createUser,
  loginUser,
  allUser,
  findUser,
  updateUser,
  deleteUser,
};
