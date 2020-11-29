import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import Signin from "./components/screens/Signin";
import CreatePost from "./components/screens/Createpost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from './components/screens/UserProfile'
import FollowingPosts from "./components/screens/followingPosts";
import Reset from "./components/screens/Reset";
import NewPassword from "./components/screens/Newpassword";

require("dotenv").config();

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type: "USER", payload: user})
    }else{
      if(!history.location.pathname.includes('/reset'))
          history.push('/signin')
    }

  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile UserContext={UserContext} />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/explore-followings">
        <FollowingPosts />
      </Route>
      <Route exact path="/reset">
      <Reset />
      </Route>
      <Route path="/reset/:token">
      <NewPassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar UserContext={UserContext} />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
