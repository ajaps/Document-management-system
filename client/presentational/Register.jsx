import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as userAction from '../actions/userActions';


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
    };
    this.textChanged = this.textChanged.bind(this);
    this.registerBtn = this.registerBtn.bind(this);
  }

  componentWillMount() {
    if (window.localStorage.userToken) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userToken) {
      this.props.history.push('/dashboard');
    }
  }

  registerBtn(event) {
    event.preventDefault();
    const { username, email, password } = this.state;
    this.props.actions.userRegister(username, email, password);
  }

  textChanged(event) {
    if (event.target.name === 'email') {
      const email = event.target.value;
      this.setState({ email });
    } else if (event.target.name === 'username') {
      const username = event.target.value;
      this.setState({ username });
    } else {
      const password = event.target.value;
      this.setState({ password });
    }
  }

  render() {
    if (this.props.userToken.length > 5) {
      localStorage.setItem('userToken', this.props.userToken);
    }
    return (
      <div className="container">
      <div id="signinlink"
        className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
        <div className="panel panel-info">
          <div className="panel-heading">
            <div className="panel-title">Sign Up</div>
          </div>
          <div className="panel-body" >
            <form id="signupform" className="form-horizontal" role="form">
              <div id="signupalert" className="alert alert-danger">
                <p>Error:</p>
              </div>
              <div className="form-group">
                <label htmlFor="email" className="col-md-3 control-label">
                  Email</label>
                <div className="col-md-9">
                  <input type="text" className="form-control" name="email"
                      placeholder="Email Address" onChange={this.textChanged}/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username" className="col-md-3 control-label">
                  UserName</label>
                <div className="col-md-9">
                  <input type="text" className="form-control" name="username"
                    placeholder="username" onChange={this.textChanged}/>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="col-md-3 control-label">
                  Password</label>
                <div className="col-md-9">
                  <input type="password" className="form-control" name="passwd"
                    placeholder="Password" onChange={this.textChanged}/>
                </div>
              </div>

              <div className="form-group">
                <div className="col-md-offset-3 col-md-9">
                  <button id="btn-signup" type="button" className="btn btn-info"
                    onClick={this.registerBtn}><i className="icon-hand-right" />
                    Sign Up</button>
                </div>
              </div>
              <div>Already a member <br/>
                <a href="/login">Sign In</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

Register.propTypes = {
  actions: PropTypes.object,
  userToken: PropTypes.string,
  history: PropTypes.object,
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
export default connect(mapStateToProps, mapDispatchToProps)(Register);
