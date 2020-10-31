const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .then((posts) => res.json({ posts }))
    .catch((error) => console.log(error));
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, photo } = req.body;
  console.log(title, body, photo);
  if ((!title || !body, !photo)) {
    return res.status(422).json({ error: "Please fill all fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((error) => {
      console.log("error", error);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
  .populate("comments.postedBy","_id name")

    .then((mypost) => res.json({ mypost }))
    .catch((error) => console.log(error));
});

router.get("/getSubPost", requireLogin, (req, res) => {
  Post.find({postedBy:{$in:req.user.followings}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .then((posts) => res.json({ posts }))
    .catch((error) => console.log(error));
});


router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      res.status(422).json({ error });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  ).exec((error, result) => {
    if (error) {
      res.status(422).json({ error });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  }
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((error, result) => {
    if (error) {
      res.status(422).json({ error });
    } else {
      res.json(result);
    }
  });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({_id:req.params.postId})
  .populate("postedBy","_id")
  .exec((error,post)=>{
    if(error || !post){
      res.status(422).json({error})
    }
    console.log(post);
    if(post.postedBy._id.toString() === req.user._id.toString()){
      post.remove()
      .then(result=>{
        res.send(result)
      })
      .catch(err => {
        console.log(err);
      })
    }
  })
});

router.delete("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { comments: {_id:req.params.commentId} },
    },
    { new: true }
  )
  .populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((error, result) => {
    if (error) {
      res.status(422).json({ error });
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
