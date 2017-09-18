import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as docAction from '../actions/docActions';
import DocumentList from './DocumentList.jsx';


class GetAllDocs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    const searchTerm = (this.props.location.search).replace('?', '');
    if (this.props.location.pathname === "/dashboard/search"
      && searchTerm.length > 1) {
      this.props.docActions.searchDocs(searchTerm);
    } else {
      this.props.docActions.getAllDocs();
    }
  }

  mapAllDocuments(document, props) {
    const { docActions, history } = props;
    return <DocumentList key={document.id} docProps={document}
      actions={docActions} history={history} />;
  }

  render() {
    return (
      this.props.documents === undefined ?
      <div className="allDocs">
        <h1>No Document Available</h1>
      </div> :
      <div>
      {this.props.documents.map(document =>
        this.mapAllDocuments(document, this.props)
      )}
      </div>
    );
  }
}

GetAllDocs.propTypes = {
  docActions: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => (
  {
    documents: state.documents,
  }
);

const mapDispatchToProps = dispatch => (
  {
    docActions: bindActionCreators(docAction, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GetAllDocs);
