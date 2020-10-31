import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    if (url) {
      uplaodFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "abdulrafay");
    fetch("https://api.cloudinary.com/v1_1/abdulrafay/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.secure_url);
      })
      .catch((error) => console.log(error));
  };

  const uplaodFields = () => {
    const validateEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email || !name || !password) {
      M.toast({
        html: "please enter all fields",
        classes: "#d84315 deep-orange darken-3",
      });
      return;
    }

    if (!validateEmail.test(email)) {
      M.toast({
        html: "invalid email",
        classes: "#d84315 deep-orange darken-3",
      });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        profileImage:url
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
            html: "Success",
            classes: "#66bb6a green lighten-1",
          });
          history.push("/signin");
        }
      });
  };

  const onSubmit = () => {
    if (image) {
      uploadPic();
    } else {
      uplaodFields();
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="validate"
          placeholder="Name"
        />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="validate"
          placeholder="Email"
        />
        <input
          id="password"
          type="password"
          className="validate"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload Image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="signin btn waves-effect #0095f6"
          type="submit"
          name="action"
          onClick={onSubmit}
        >
          Sign Up
        </button>
        <h6 className="auth-link">
          Already have an account?
          <Link to="/signin">&nbsp; Sign in</Link>
        </h6>
      </div>
    </div>
  );
};

export default Signup;
