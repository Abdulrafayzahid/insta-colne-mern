


import React, {useState, useContext} from "react";
import { Link, useHistory,useParams } from "react-router-dom";
import M from "materialize-css";
import {UserContext} from '../../App'

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [match, setmatch] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState("");
  const history = useHistory()

  const comparePassword = async () => {
   
  }
  const {token} = useParams()
  console.log(token);
  const onSubmit = async () => {
    
    if(!password){
      M.toast({
        html: "please enter password",
        classes: "#d84315 deep-orange darken-3",
      });
      return
    }
    if (password !== confirmPassword) {
      M.toast({
        html: "password did not match",
        classes: "#d84315 deep-orange darken-3",
      });
      return
    } 
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token
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
          M.toast({
            html: data.message,
            classes: "#66bb6a green lighten-1",
          });
          history.push('/signin')
        }
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          id="password"
          type="password"
          className="validate"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          id="password"
          type="password"
          className="validate"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setconfirmPassword(e.target.value)}
        />
        <button
          className="signin btn waves-effect #0095f6"
          type="submit"
          onClick={onSubmit}
          name="action"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
