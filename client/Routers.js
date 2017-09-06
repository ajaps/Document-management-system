import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React from 'react';

import Header from './Header';
import Layout from './Layout';
import Footer from './Footer';

const Routers = () => (
  <Router>
    <div>
      <Header />
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Header}/>
      <Route path="/about" component={Layout}/>
      <Route path="/topics" component={Footer}/>

      <Footer />
    </div>
  </Router>

);

export default Routers;
