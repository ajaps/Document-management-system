import React from 'react';
// import { Link } from 'react-router-dom';


const Header = (props) => {
  let authStatus = "hidden";
  let guestUser = "hidden";
  const textChanged = (e) => {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      location.href = `/dashboard/search?${e.target.value}`
      console.log(location);
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    location.href = '/login';
  };

  if (location.pathname.match('dashboard')) {
    authStatus = null;
  } else {
    guestUser = null;
  }

  return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed"
            data-toggle="collapse" data-target="#navbar" aria-expanded="false"
            aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
          </button>
          <a className="navbar-brand" href="#">DocSys</a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            <li className={authStatus}><a href="">Profile</a></li>
            <li className={guestUser}><a>Welcome Guest</a></li>
            <li onClick={logout} className={authStatus}>
              <span className="logoutBtn btn btn-danger">LogOut</span>
            </li>
            <li><a></a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
