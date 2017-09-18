import React from 'react';
import { Link } from 'react-router-dom';

const DocumentList = (props) => {
  const { id, title, content, userId, createdAt, access } = props.docProps;
  const { deleteDoc, getDocById } = props.actions;

  const deleteBtn = (e) => {
    e.preventDefault();
    deleteDoc(e.target.id);
  };

  const viewDocumentBtn = (e) => {
    e.preventDefault();
    props.history.push(`/dashboard/view/${id}`);
  };

  return (
  <div className="row eachDoc" key={id}>
    <div className="col-lg-9">
      <h4 className="docHeader">{title}</h4>
      <p className="docContent">{content}
      </p>
      <div>
        <span className="docDetails">Author:<em>{userId}</em></span>
        <span className="docDetails">Last updated:<em>{createdAt}
          </em></span>
        <span className="docDetails">Access Type:<em>{access}</em></span>
      </div>
        <p>
          <Link to={`/dashboard/view/${id}`}>View document &raquo;</Link>
        </p>
    </div>
    <div className="col-lg-3 float-lg-right">
      <button className="btn btn-primary btn-sm" id={id}
        onClick={deleteBtn}>Delete</button>
      <button className="btn btn-primary btn-sm" onClick={viewDocumentBtn}>
        Update
      </button>
    </div>
  </div>);
};
export default DocumentList;
