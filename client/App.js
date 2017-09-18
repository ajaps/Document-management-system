import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configStore from './store/configStore';
import Routers from './Routers';
import './style/main.scss';
// import { userLogin } from './actions/userActions';

const store = configStore();
// store.dispatch(userLogin());

const mountNode = document.getElementById('rootNode');

render(
  <Provider store={store}>
    <Routers />
  </Provider>,
  mountNode
);
