const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const crypto = require("crypto")
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

router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      return console.log(err);
    }
    const token = buffer.toString("hex")
    User.findOne({email: req.body.email})
    .then(user => {
      if(!user){
        return res.send(422).json({error:"User not found"})
      }
      user.resetToken = token
      user.expireToken = Date.now() + 3600000
      user.save().then(result => {
        
      })
    })

  })
})

router.post('/search-user',(req,res)=>{
  let userPattern = new RegExp("^"+req.body.query)
  User.find({name: {$regex:userPattern}})
  .select("_id email, name")
  .then(users => {
    res.json({users})
  })
  .catch(error => {
    console.log(error);
  })
})

module.exports = router;
