import React, {useState, useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import {UserContext} from '../../App'

const Reset = () => {
  const [email, setEmail] = useState("");
  const history = useHistory()
  const onSubmit = () => {
    const validateEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    if(!email){
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
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
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
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="validate" placeholder="Email" />
        <button
          className="signin btn waves-effect #0095f6"
          type="submit"
          onClick={onSubmit}
          name="action"
        >
          Reset password
        </button>
      </div>
    </div>
  );
};

export default Reset;
