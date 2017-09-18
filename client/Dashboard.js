import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import * as userActions from './actions/userActions';
import * as docActions from './actions/docActions';
import Login from './presentational/Login.jsx';
import LeftNavBar from './presentational/LeftNavBar.jsx';
import DocView from './presentational/DocView.jsx';
import GetAllDocs from './presentational/GetAllDocs.jsx';
import SearchBar from './presentational/SearchBar.jsx';

class Dashboard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loginToken: '',
    };
    this.textChanged = this.textChanged.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillMount() {
    if (!window.localStorage.userToken) {
      this.props.history.push('/login');
    }
  }

  textChanged(event) {
    const { course } = this.state;
    course.title = event.target.value;
    this.setState({ course });
  }

  saveCourse() {
    this.props.actions.createCourse(this.state.course);
  }

  render() {
    // console.log(this.props.match)
    // console.log(this.props.history.location.search)
    return (
      <div className="container-fluid">
        <div className="row">
          <LeftNavBar />
          {/* <CreateDoc props={this.props}/> */}
          <SearchBar props={this.props}/>
          <div className="well container-fluid col-sm-9 col-md-8 col-lg-10 pull-right documentsContainer">
            {/*<SearchBar props={this.props}/>*/}
            <Router>
              <switch>
                <Route exact path="/dashboard" component={GetAllDocs}/>
                <Route path="/dashboard/createdoc" component={DocView}/>
                <Route path="/dashboard/view/:id" component={DocView}/>
                <Route path="/dashboard/search" component={GetAllDocs}/>
                {/* <Route path="/topics" component={Footer}/>
                <Route path="/login" component={Login}/>
                <Route path="/dashboard" component={Dashboard}/>
                <Route path="/register" component={Register}/> */}
              </switch>
            </Router>
          </div>
        </div>
      </div>

    );
  }
}

Dashboard.propTypes = {
  courses: PropTypes.array,
  actions: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => (
  {
    userToken: state.user,
  }
);

const mapDispatchToProps = dispatch => (
  {
    userActions: bindActionCreators(userActions, dispatch),
    docActions: bindActionCreators(docActions, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
