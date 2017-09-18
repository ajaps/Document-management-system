
const user = (state = [], action) => {
  switch (action.type) {
    case ("USER_LOGIN"):
      return action.loginToken;
      // return [...state, Object.assign({}, action.loginToken)];
    case ("USER_REGISTER"):
      return action.registerToken;
      // return [...state, Object.assign({}, action.course)];
    case ("CREATE_DOC"):
      // return action.docAttributes;
      return [...state, Object.assign({}, action.docAttributes)];
    default:
      return state;
  }
};

export default user;
