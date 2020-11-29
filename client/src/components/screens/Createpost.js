import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { Link, useHistory } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (url) {
      fetch("http://localhost:5000/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          photo: url,
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
              html: "Post created successfully",
              classes: "#66bb6a green lighten-1",
            });
            history.push("/");
          }
        });
    }
  }, [url]);

  const onSubmit = () => {
    if (!title || !body || !image) {
      M.toast({
        html: "please enter all fields",
        classes: "#d84315 deep-orange darken-3",
      });
      return;
    }
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
  return (
    <div className="createPost card">
      <div className="input-field card-content">
        <input
          placeholder="title"
          id="title"
          type="text"
          className="validate"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="body"
          id="body"
          type="text"
          className="validate"
          value={body}
          onChange={(e) => setBody(e.target.value)}
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
          className="btn waves-effect"
          type="submit"
          name="action"
          onClick={onSubmit}
        >
          SUBMIT POST
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
