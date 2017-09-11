import PropTypes from 'prop-types';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
   * checks if user is authenticated  inorder to access this private route
   * @return {ReactElement}
   */
function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
        {...rest}
        render={props => authenticated.length > 5
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login',
          state: { from: props.location } }}
          />}
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.string.isRequired,
  location: PropTypes.object,
};

module.exports = {
  PrivateRoute,
};
