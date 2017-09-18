const documents = (state = [], action) => {
  switch (action.type) {
    case ("CREATE_DOC"):
      return action.docAttributes;
      // return [...state, Object.assign({}, action.course)];
    case ("GET_ALL_DOCS"):
      return action.documents;
      // return [...state, Object.assign({}, action.documents)];
    case ("DELETE_DOCS"):
      // return state;
      return action.statusMsg;
      // return [...state, Object.assign({}, action.statusMsg)];
    case ("GET_DOCS_BY_ID"):
      // return state;
      return action.document;
      // return [...state, Object.assign({}, action.statusMsg)];
    case ("UPDATE_DOC"):
      return state;
      // return action.document;
      // return [...state, Object.assign({}, action.statusMsg)];
    case ("SEARCH_DOC"):
      // return state;
      return action.documents;
      // return [...state, Object.assign({}, action.statusMsg)];
    default:
      return state;
  }
};

export default documents;
