import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import Routers from './Routers';
import Header from './Header';
// import './style/mainStyle.scss';

const mountNode = document.getElementById('rootNode');
render(<Routers />, mountNode);
