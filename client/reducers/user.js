
const user = (state = [], action) => {
  switch (action.type) {
    case ("USER_LOGIN"):
      return action.loginToken;
      // return [...state, Object.assign({}, action.course)];
    case ("USER_REGISTER"):
      return action.registerToken;
      // return [...state, Object.assign({}, action.course)];
    default:
      return state;
  }
};

export default user;
