import 'babel-polyfill';
// import createBrowserHistory from 'history/createBrowserHistory';
import { BrowserRouter } from 'react-router-dom'
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import Routers from './Routers';
import Header from './Header';
// import './style/mainStyle.scss';

// const newHistory = createBrowserHistory();

const mountNode = document.getElementById('rootNode');
// render(<Header />, mountNode);
// render(<Router history={newHistory} routes={Routers} />, mountNode);
render((<BrowserRouter> <Routers /> </BrowserRouter>), mountNode);
