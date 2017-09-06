import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import Layout from './Layout';
import Footer from './Footer';

class Routers extends React.Component {
  render() {
    return (
      <div>
        <Route path="/" component={Layout}/>
        <Route path="/about" component={Header}/>
      </div>
    );
  }
}

export default Routers;

{ /* <Route path="/" component={Layout}>
        <IndexRoute component={Header} />
        <Route path="about" component={Footer} />
</Route> */ }
