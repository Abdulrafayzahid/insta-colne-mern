import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Navbar = ({ UserContext }) => {
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState()
  const [users, setUsers] = useState()
  const history = useHistory()
  const searchModal = useRef(null)
  const logout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" })
    history.push('/signin')
  }
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])
  const renterList = () => {
    if (state) {
      return [
        <li key="0">
          <a data-target="modal1" className="modal-trigger"><i className="material-icons">search</i></a>
        </li>,
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
        <li key="5">
          <Link to="/signin">Sign In</Link>
        </li>,
        <li key="6">
          <Link to="/signup">Sign Up</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query)
    if (query) {
      fetch("http://localhost:5000/search-user", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query
        }),
      }).then(res => res.json())
        .then(users => {
          setUsers(users.users)
          console.log(users);
        })
    }

  }
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
      <div id="modal1" className="modal" ref={searchModal} style={{ 'color': 'white' }}>
        <div className="modal-content">
          <input id="text" placeholder="search user" type="text"
            value={search} onChange={(e) => fetchUsers(e.target.value)}
            className="validate" />
          <ul className="collection" style={{ 'color': 'black' }}>

            {users?.map(item => {
              return <Link to={item?._id !== state?._id ? `/profile/${item._id}` : '/profile'} onClick={() => {
                M.Modal.init(searchModal.current).close()
                setSearch('')
              }}> <li className="collection-item" style={{ 'float': 'inherit' }}>{item.name}</li></Link>
            })}
          </ul>
        </div>
      </div>

      <ul id="nav-mobile" className="right">
        {renterList()}
      </ul>
    </>
  );
};

export default Navbar;
