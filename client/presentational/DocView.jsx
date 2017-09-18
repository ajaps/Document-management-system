import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as docActions from '../actions/docActions';


class DocView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: '',
      access: '',
      content: '',
      title: '',
      updatedAt: '',
      userId: '',
    };
    this.createUpdateDocument = this.createUpdateDocument.bind(this);
    this.textChanged = this.textChanged.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.setState({ userAction: 'Update Doc' });
      this.props.docActions.getDocById(this.props.match.params.id);
    }
  }

  textChanged(event) {
    if (event.target.id === 'title') {
      const title = event.target.value;
      this.setState({ title });
    } else if (event.target.id === 'editorPane') {
      const content = event.target.value;
      this.setState({ content });
    } else if (event.target.id === 'accessType') {
      const access = event.target.value;
      this.setState({ access });
    }
  }

  createUpdateDocument(e) {
    e.preventDefault();
    const title = e.target[0].value;
    const content = e.target[1].value;
    const access = e.target[2].value;
    if (e.target[5].value === "Create Doc") {
      this.props.docActions.createDoc(title, content, access);
      // e.target.reset();
    } else {
      const docId = e.target[0].name;
      const updateDocAttributes = {};
      if (title !== this.props.documents.title) {
        updateDocAttributes.title = title;
      }
      if (content !== this.props.documents.content) {
        updateDocAttributes.content = content;
      }
      if (access !== this.props.documents.access) {
        updateDocAttributes.access = access;
      }
      this.props.docActions.updateDoc(updateDocAttributes, docId);
    }
  }


  render() {
    console.log(this.props);
    const { access, content, id, title,
      updatedAt, userId } = this.props.documents;
    console.log(this.state);
    console.log('id:   ', id);
    return (
      <div>
        <form action="" method="POST" onSubmit={this.createUpdateDocument}
          className="createDocform">
          <div className="col-lg-9">
            <label htmlFor="title">Title</label> <span>
            <input type="text" placeholder="Document title" id="title" required
              className="inputFormatting form-control" pattern=".{3,}"
              title="Document Title must be 3 or more characters" name={id}
              value={this.state.title || title}
              onChange={this.textChanged}/></span>
          </div>
          <textarea name="editorPane" id="editorPane" cols="30" rows="13"
            placeholder="Document Content" value={this.state.content || content}
            className="col-lg-8 float-left form-control col-xs-8 col-sm-8 col-md-8"
            onChange={this.textChanged}/>
            <div className="form-group accessType">
              <div className="col-lg-3">
                <label htmlFor="accessType">Access Type:</label>
                <select className="form-control inputbox" id="accessType"
                  value={this.state.access || access} onChange={this.textChanged}>
                  <option>public</option>
                  <option>private</option>
                  <option>role</option>
                </select>
              </div>
              <div className="col-lg-3">
                <label htmlFor="updated">Last Updated:</label>
                <input type="text" id="updated" value={updatedAt} disabled
                  className="inputFormatting form-control inputbox" />
              </div>
              <div className="col-lg-3">
              <label htmlFor="author">Author:</label>
              <input type="text" id="author" disabled value={userId}
                className="inputFormatting form-control inputbox"/>
              </div>
            </div>
            <input className="btn btn-primary col-lg-2 createDoc" type="submit"
                value={this.state.userAction || 'Create Doc'} />
        </form>
      </div>
    );
  }
}

DocView.propTypes = {
  docActions: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => (
  {
    documents: state.documents,
  }
);

const mapDispatchToProps = dispatch => (
  {
    docActions: bindActionCreators(docActions, dispatch),
  }
);
export default connect(mapStateToProps, mapDispatchToProps)(DocView);
