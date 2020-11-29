import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import Loader from "../Loader";
import { Link } from "react-router-dom";

const FollowingPosts = () => {
  const [data, setData] = useState();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/getSubPost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          console.log(data);
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const postComment = (postId, text) => {
    fetch("/comment", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(result, postId, text);
      })
      .catch((err) => console.log(err));
  };

  const deletePost = (postId) => {
    console.log(postId);
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        M.toast({
          html: "Post deleted",
          classes: "#d84315 deep-orange darken-3",
        });
        console.log(res);
        const newData = data.filter((item) => {
          return item._id !== res._id;
        });
        setData(newData);
        document.getElementById("text").value = null
      })
      .catch((err) => console.log(err));
  };
  const deleteComment = (postId, commentId) => {
    console.log(postId);
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        M.toast({
          html: "Comment deleted",
          classes: "#d84315 deep-orange darken-3",
        });
        console.log(res);
        const newData = data.filter((item) => {
          return item._id !== res._id;
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  console.log(data);
  return (
    <div className="home">
      {data ? (
        data?.map((item) => (
          <div className="card home-card" key={item?._id}>
            <div className="card-content title">
              <span className="card-title">
                <Link
                  to={
                    item.postedBy?._id === state?._id
                      ? `/profile`
                      : `/profile/${item?.postedBy?._id}`
                  }
                >
                  {" "}
                  {item?.postedBy?.name}{" "}
                </Link>
                {item?.postedBy?._id === state?._id && (
                  <i
                    className="material-icons"
                    onClick={() => deletePost(item._id)}
                    style={{ color: "red", float: "right" }}
                  >
                    delete
                  </i>
                )}
              </span>
            </div>
            <div className="card-image">
              <img src={item?.photo} />
            </div>
            <div className="card-content" key={item?._id}>
              <p>
                {item?.likes?.includes(state?._id) ? (
                  <i
                    className="material-icons"
                    onClick={() => unlikePost(item?._id)}
                    style={{ color: "red" }}
                  >
                    favorite
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => likePost(item?._id)}
                    style={{ color: "red" }}
                  >
                    favorite_border
                  </i>
                )}
                <span>
                  &nbsp;
                  {item?.likes?.length}
                </span>
              </p>
              <h6>{item?.title}</h6>
              <p>{item?.body}</p>
              <h6>Comments</h6>
              {item?.comments?.map((comment) => {
                return (
                  <p
                    key={comment._id}
                    onClick={() => deleteComment(item?._id, comment?._id)}
                  >
                    <span style={{ fontWeight: 500 }}>
                      {comment?.postedBy?.name}{" "}
                    </span>
                    {comment?.text}
                  </p>
                );
              })}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  postComment(item?._id, e.target[0].value);
                }}
              >
                <input type="text" id="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default FollowingPosts;
