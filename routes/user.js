const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((error) => {
      res.status(422).json({ error: "user not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(422).json({ error });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { followings: req.body.followId },
        },
        {
          new: true,
        }
      ).select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => res.json({ error: err }));
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(422).json({ error });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { followings: req.body.unfollowId },
        },
        {
          new: true,
        }
      ).select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => res.json({ error: err }));
    }
  );
});

router.put('/updateprofileimage',requireLogin,(req,res)=>{
  User.findByIdAndUpdate(req.user._id,{
    $set: {profileImage: req.body.pic}
  },{
    new: true
  },(error,result)=>{
     if(error){
       return res.status(422).json({error})
     }
     res.json(result)
  })
})

module.exports = router;
