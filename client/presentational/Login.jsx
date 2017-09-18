import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

import * as userActions from '../actions/userActions';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
    };
    this.loginBtn = this.loginBtn.bind(this);
    this.textChanged = this.textChanged.bind(this);
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

  textChanged(event) {
    if (event.target.name === 'email') {
      const email = event.target.value;
      this.setState({ email });
    } else {
      const password = event.target.value;
      this.setState({ password });
    }
  }

  loginBtn(event) {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.actions.userLogin(email, password);
  }

  render() {
    if (this.props.userToken.length > 5) {
      localStorage.setItem('userToken', this.props.userToken);
    }
    const { email } = this.state;
    return (
    <div className="container">
      <div id="loginbox" className={`mainbox col-md-6 col-md-offset-3
        col-sm-8 col-sm-offset-2`}>
        <div className="panel panel-info" >
          <div className="panel-heading">
            <div className="panel-title">Sign In</div>
          </div>
          <div className="panel-body" >
            <div id="login-alert" className="alert alert-danger col-sm-12" />
            <form id="loginform" className="form-horizontal" role="form">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="glyphicon glyphicon-user" /></span>
                <input id="login-username" type="text" className="form-control"
                  name="email" value={email} placeholder="Email"
                  onChange={this.textChanged} />
              </div>
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="glyphicon glyphicon-lock" /></span>
                <input id="login-password" type="password" name="password"
                  className="form-control" placeholder="password"
                  onChange={this.textChanged} />
              </div>
              <div className="form-group">
                <div className="col-sm-12 controls">
                  <button id="btn-login" onClick={this.loginBtn}
                  className="btn btn-success"> Login</button>
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-12 control">
                  <div className="noAccount"> Don't have an account!
                  <a href="/register">
                      Sign Up Here
                  </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

Login.propTypes = {
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
    actions: bindActionCreators(userActions, dispatch),
  }
);
export default connect(mapStateToProps, mapDispatchToProps)(Login);
