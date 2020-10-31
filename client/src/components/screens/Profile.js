import React, { useEffect, useState, useContext } from "react";
import Loader from "../Loader";

const Profile = ({ UserContext }) => {
  const [pics, setPics] = useState();
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);

  useEffect(()=>{
    if(image){
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
          console.log(data);
         
          fetch('/updateprofileimage',{
            method:'put',
            headers:{
              Authorization: "Bearer " + localStorage.getItem("jwt"),
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
              pic:data.secure_url
            })
          }).then(res => res.json())
          .then(response =>{ 
            localStorage.setItem("user", JSON.stringify({...state,profileImage:data.secure_url}))
            dispatch({
              type:"UPDATEPIC",
              payload: data.secure_url
            })
            }
          )
        })
        .catch((error) => console.log(error));
    }
  },[image])
  console.log(state);
  
  return (
    <section className="profile">
      {pics && state ? (
        <>
          <div className="profile-details">
            <div className="profile-image">
              <img src={state.profileImage} />
              <div className="file-field input-field">
          <div className="btn">
            <span>Upload Image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
            </div>
            <div className="profile-stats-details">
              <div className="profile-name">
                <h4>{state?.name}</h4>
              </div>
              <div className="profile-stats">
                <h6 className="stats">
                  <span>posts</span>
                  <span> {pics?.length}</span>
                </h6>
                <h6 className="stats">
                   <span>following</span>
                  <span> {state?.followings.length}</span>
                </h6>
                <h6 className="stats">
                <span>followers</span>
                 
                  <span> {state?.followers.length}</span>
                </h6>
              </div>
            </div>
          </div>
          <div className="gallery">
            {pics?.map((item) => (
              <div className="item">
                <img key={item._id} src={item.photo} alt={item.title} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </section>
  );
};

export default Profile;
