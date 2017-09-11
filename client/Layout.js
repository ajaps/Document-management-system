import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as userAction from './actions/userAction';
import Login from './presentational/Login.jsx';

class Layout extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loginToken: '',
    };
    this.textChanged = this.textChanged.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  textChanged(event) {
    const { course } = this.state;
    course.title = event.target.value;
    this.setState({ course });
  }

  saveCourse() {
    this.props.actions.createCourse(this.state.course);
  }

  eachCourse(course, index) {
    return <div key={index}>
    {course.title}
    </div>;
  }

  login() {
    this.props.loginActions.actions.userLogin();
  }

  render() {
    return (
      <div>
        <textarea name="" id="" cols="30" rows="10">This is the document content
        </textarea>
        <Login loginActions={this.props}/>
      </div>

    );
  }
}

Layout.propTypes = {
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
    actions: bindActionCreators(userAction, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

 /*
const { user } = this.state;
    return (
      <div>
        <p1> TIA </p1>
        {this.props.userToken}
        <div>
          <h1> Add course </h1>
          <input type="text" onChange={this.textChanged}
            value={user} />
          <input type="submit" value="Save" onClick={this.saveCourse}/>
        </div>
      </div>
    ); */
