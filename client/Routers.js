import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React from 'react';

import Footer from './Footer.jsx';
import Header from './Header.jsx';
import Login from './presentational/Login.jsx';
import Layout from './Layout';
import Register from './presentational/Register.jsx';
import PublicRoute from './container/PublicRoute';
import PrivateRoute from './container/PrivateRoute';

const Routers = () => (
  <Router>
    <div>
      <Header />
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/layout">Layout</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>

      <hr/>

      {/* <PublicRoute exact path="/"
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
      <PrivateRoute path="/layout"
        authenticated={window.localStorage.docToken}
        component={Layout}
      /> */}
      <Route exact path="/goal" component={Header}/>
      <Route path="/about" component={Layout}/>
      <Route path="/topics" component={Footer}/>
      <Route path="/login" component={Login}/>
      <Route path="/layout" component={Layout}/>
      <Route path="/register" component={Register}/>

      <Footer />
    </div>
  </Router>
);

export default Routers;
