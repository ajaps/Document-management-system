import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as userAction from '../actions/userActions';


class LeftNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
    };
    // this.textChanged = this.textChanged.bind(this);
    // this.registerBtn = this.registerBtn.bind(this);
  }

  // registerBtn(event) {
  //   event.preventDefault();
  //   const { username, email, password } = this.state;
  //   this.props.actions.userRegister(username, email, password);
  // }

  // textChanged(event) {
  //   if (event.target.name === 'email') {
  //     const email = event.target.value;
  //     this.setState({ email });
  //   } else if (event.target.name === 'username') {
  //     const username = event.target.value;
  //     this.setState({ username });
  //   } else {
  //     const password = event.target.value;
  //     this.setState({ password });
  //   }
  // }
  render() {
    return (
      <div className="col-sm-3 col-md-2 sidebar">
        <ul className="nav nav-sidebar">
          <li className="active"><a href="/">Overview
            <span className="sr-only">(current)</span></a></li>
          <li><a href="#">About</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </ul>
        <ul className="nav nav-sidebar">
          <li><a href="/dashboard/createdoc">Create Doc</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/dashboard/search">Search documents</a></li>
          <li><a href="">Another nav item</a></li>
          <li><a href="">More navigation</a></li>
        </ul>
        <ul className="nav nav-sidebar">
          <li><a href="">Nav item again</a></li>
          <li><a href="">One more nav</a></li>
          <li><a href="">Another nav item</a></li>
        </ul>
      </div>
    );
  }
}

// LeftNavBar.propTypes = {
//   actions: PropTypes.object,
//   userToken: PropTypes.string,
// };

// const mapStateToProps = (state, ownProps) => (
//   {
//     userToken: state.user,
//   }
// );

// const mapDispatchToProps = dispatch => (
//   {
//     actions: bindActionCreators(userAction, dispatch),
//   }
// );
// export default connect(mapStateToProps, mapDispatchToProps)(LeftNavBar);
export default LeftNavBar;
