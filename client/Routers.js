import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React from 'react';

import Footer from './Footer.jsx';
import Header from './Header.jsx';
import Login from './presentational/Login.jsx';
import Dashboard from './Dashboard';
import Register from './presentational/Register.jsx';
import PublicRoute from './container/PublicRoute';
import PrivateRoute from './container/PrivateRoute';

const Routers = props => (
  <Router>
    <div className="container-fluid">
      <Header props={props}/>
      <hr/>

       {/*<PublicRoute exact path="/"
        authenticated={window.localStorage.docToken}
        component={Header}
      />

      <PublicRoute path="/login"
        authenticated={window.localStorage.docToken}
        component={Login}
      />

      <PublicRoute path="/register"
        authenticated={window.localStorage.docToken}
        component={Register}
      />
      <PrivateRoute path="/dashboard"
        authenticated={window.localStorage.docToken}
        component={Dashboard}
      />*/}
      <Route exact path="/" component={Login}/>
      <Route path="/about" component={Dashboard}/>
      <Route path="/topics" component={Footer}/>
      <Route path="/login" component={Login}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/register" component={Register}/>

      <Footer />
    </div>
  </Router>
);

export default Routers;
