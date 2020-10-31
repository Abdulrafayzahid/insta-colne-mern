import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

const Navbar = ({ UserContext }) => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory()
  const logout = () => {
    localStorage.clear();
    dispatch({type:"CLEAR"})
    history.push('/signin')
  }
  const renterList = () => {
    if (state) {
      return [
        <li key="1">
          <Link to="/create">CreatePost</Link>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/explore-followings">Explore Followings</Link>
        </li>,
        <li key="4">
          <a className="btn #d32f2f red darken-2 text-white" onClick={logout}>
            Logout!
          </a>
        </li>,
      ];
    } else {
      return [
        <li key="1">
          <Link to="/signin">Sign In</Link>
        </li>,
        <li key="2">
          <Link to="/signup">Sign Up</Link>
        </li>,
      ];
    }
  };
  return (
    <>
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          &nbsp; Instagram
        </Link>
        <ul id="nav-desktop" className="right">
          {renterList()}
        </ul>
       
      </div>
    </nav>
     <ul id="nav-mobile" className="right">
     {renterList()}
   </ul>
   </>
  );
};

export default Navbar;
