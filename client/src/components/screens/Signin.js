import React, {useState, useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import {UserContext} from '../../App'

const Signin = () => {
  const {state,dispatch} = useContext(UserContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory()
  const onSubmit = () => {
    const validateEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    if(!email || !password){
      M.toast({
        html: "please enter all fields",
        classes: "#d84315 deep-orange darken-3",
      });
      return
    }
    
    if(!validateEmail.test(email)){
      M.toast({
        html: "invalid email",
        classes: "#d84315 deep-orange darken-3",
      });
      return
    }
    fetch("http://localhost:5000/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({
            html: data.error,
            classes: "#d84315 deep-orange darken-3",
          });
        } else {
          
          localStorage.setItem("jwt",data.token)
          localStorage.setItem("user",JSON.stringify(data.user))
          dispatch({
            type : "USER",
            payload : data.user  
          })
          M.toast({
            html: "Success",
            classes: "#66bb6a green lighten-1",
          });
          history.push('/')
        }
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="validate" placeholder="Email" />
        <input
          id="password"
          type="password"
          className="validate"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="signin btn waves-effect #0095f6"
          type="submit"
          onClick={onSubmit}
          name="action"
        >
          Sign In
        </button>
        <h6 className="auth-link">
          Don't have an account?
            <Link to='/signup'>
            &nbsp; Sign up
            </Link>
        </h6>
        <h6 className="auth-link">
          Forgot password?
            <Link to='/reset'>
            &nbsp; reset here
            </Link>
        </h6>
      </div>
    </div>
  );
};

export default Signin;
