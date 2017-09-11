import PropTypes from 'prop-types';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
   * checks if user is authenticated redirects to dashbpard if true
   * @return {ReactElement}
   */
function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
        {...rest}
        render={props => authenticated.length < 5
        ? <Component {...props} />
        : <Redirect to="/layout" />}
    />
  );
}
PublicRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.string.isRequired,
};

module.exports = {
  PublicRoute,
};
