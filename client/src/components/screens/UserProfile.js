import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader";
import { UserContext } from "../../App";

const UserProfile = () => {
  const [userProfile, setProfile] = useState();
  const { userId } = useParams();
  const { state, dispatch } = useContext(UserContext);
  console.log(userId);
  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  }, []);
  const follow = () => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("followers", data.followers);
        dispatch({
          type: "UPDATE",
          payload: {
            followings: data.followings,
            followings: data.followings,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
                ...prevState.user,
                followers: [...prevState.user.followers, data._id],
              },
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unfollow = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            followings: data.followings,
            followings: data.followings,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));
        const filterFollowers = userProfile.user.followers.filter(item => item.id !== data.id)
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: filterFollowers,
            },
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(state);
  return (
    <section className="profile">
      {userProfile ? (
        <>
          <div className="profile-details">
            <div className="profile-image">
              <img src={userProfile?.user.profileImage} />
            </div>
            <div className="profile-stats-details">
              <div className="profile-name">
                <h4>{userProfile?.user?.name}</h4>
              </div>
              <div className="profile-stats">
                <h6 className="stats">
                  <span>posts</span>
                  <span> {userProfile?.posts?.length}</span>
                </h6>
                <h6 className="stats">
                  <span>followers</span>
                  <span> {userProfile?.user?.followers?.length}</span>
                </h6>
                <h6 className="stats">
                  <span>following</span>
                  <span> {userProfile?.user?.followings?.length}</span>
                </h6>
              </div>
              <h5>
                  {userProfile.user.followers.includes(state._id) ? 
                <button className="btn text-white" onClick={unfollow}>
                  unfollow
                </button>
                :
                <button className="btn text-white" onClick={follow}>
                  follow
                </button>
                }
              </h5>
            </div>
          </div>
          <div className="gallery">
            {userProfile?.posts?.map((item) => (
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

export default UserProfile;
