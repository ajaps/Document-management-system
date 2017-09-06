import React from 'react';
import PropTypes from 'prop-types';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div>
        <p1> TIA </p1>
        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object,
};

export default Layout;
