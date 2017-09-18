import { newDoc, fetchAllDocs, callDeleteDoc,
  fetchDocById, updateDocById, searchDocById } from '../api/docManagement';

const createDocSuccess = docAttributes => (
  { type: "CREATE_DOC", docAttributes }
);

const getDocSuccess = documents => (
  { type: "GET_ALL_DOCS", documents }
);

const deleteDocSuccess = statusMsg => (
  { type: "DELETE_DOCS", statusMsg }
);

const getDocByIdSuccess = document => (
  { type: "GET_DOCS_BY_ID", document }
);

const updateDocSuccess = documents => (
  { type: "UPDATE_DOC", documents }
);

const searchDocByIdSuccess = documents => (
  { type: "SEARCH_DOC", documents }
);

const createDoc = (title, content, access) => (
  (dispatch) => {
    newDoc(title, content, access)
    .then((res) => {
      dispatch(createDocSuccess(res.data.document));
    })
    .catch((error) => {
      throw (error);
    });
  }
);

const getAllDocs = (title, content, access) => (
  (dispatch) => {
    fetchAllDocs(title, content, access)
    .then((res) => {
      dispatch(getDocSuccess(res.data.documents));
    })
    .catch((error) => {
      throw (error);
    });
  }
);

const deleteDoc = docId => (
  (dispatch) => {
    callDeleteDoc(docId)
    .then((res) => {
      dispatch(deleteDocSuccess(res.data.message));
    })
    .catch((error) => {
      throw (error);
    });
  }
);

const getDocById = docId => (
  (dispatch) => {
    fetchDocById(docId)
    .then((res) => {
      dispatch(getDocByIdSuccess(res.data.document[0]));
    })
    .catch((error) => {
      throw (error);
    });
  }
);

const updateDoc = (docAttributes, docId) => (
  (dispatch) => {
    updateDocById(docAttributes, docId)
    .then((res) => {
      dispatch(updateDocSuccess(res.data.message));
    })
    .catch((error) => {
      throw (error);
    });
  }
);

const searchDocs = searchString => (
  (dispatch) => {
    searchDocById(searchString)
    .then((res) => {
      dispatch(searchDocByIdSuccess(res.data.documents));
    })
    .catch((error) => {
      throw (error);
    });
  }
);

module.exports = {
  createDoc,
  createDocSuccess,
  getAllDocs,
  getDocSuccess,
  deleteDoc,
  deleteDocSuccess,
  getDocById,
  updateDoc,
  searchDocs,
};
