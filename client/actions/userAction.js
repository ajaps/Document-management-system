import { login, register } from '../api/docManagement';

const userLoginSuccess = loginToken => (
  { type: "USER_LOGIN", loginToken }
);

const userRegisterSuccess = registerToken => (
  { type: "USER_REGISTER", registerToken }
);

const userLogin = (email, password) => (
  (dispatch) => {
    login(email, password)
    .then((res) => {
      dispatch(userLoginSuccess(res.data.token));
    })
    .catch((error) => {
      throw (error);
    });
  }
);

const userRegister = (username, email, password) => (
  (dispatch) => {
    register(username, email, password)
    .then((res) => {
      dispatch(userRegisterSuccess(res.data.token));
    })
    .catch((error) => {
      throw (error);
    });
  }
);

module.exports = {
  userLoginSuccess,
  userLogin,
  userRegister,
  userRegisterSuccess,
};
