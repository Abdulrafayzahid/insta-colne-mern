const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = mongoose.model("User")
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {JWT_TOKEN} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const { mailer } = require('../mailer')

router.post('/signup',(req,res)=>{
    const {name, email, password, profileImage} = req.body
    if(!name || !email || !password){
       return res.status(422).json({error:"Please fill all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
        return res.status(422).json({error:"User already exist with this email"})
        }
        bcryptjs.hash(password,12)
        .then((hasPassword)=>{
            const user = new User({
                name,
                email,
                password: hasPassword,
                profileImage
            })
            user.save()
            .then(user => {
                mailer(
                    email,
                    "Welcome!",
                    "Hello from insta clone!!",
                    `<h5>Hi ${name}</h5><b>Hello from insta clone!!</b>`
                ).catch(console.error)
                res.json({message:"User Added", ...user})
            })  
            .catch((error)=>{
                console.log(error)
            }) 
        })
        .catch((error)=>{
            console.log(error)
        })
    })
    .catch((error)=>{
        console.log(error)
    })
})

router.post('/signin',(req,res)=>{
    const {email, password} = req.body

    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
           return res.status(401).json({error:"invalid email or password"})
        }
        bcryptjs.compare(password, savedUser.password)
        .then((doMatach)=>{
            if(doMatach){
            //    res.json({message:"user successfully sign in"})
            const token = jwt.sign({_id: savedUser._id}, JWT_TOKEN)
            const {_id, email, name, followers, followings, profileImage} = savedUser
            res.json({token, user:{_id, email, name, followers, followings, profileImage}})
            }
            else{
                return res.status(401).json({error:"invalid email or password"})
            }
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.error(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user => {
            if(!user){
                return res.status(422).json({message:"user not found with this email"})
            }
            user.resetToken = token
            user.expireDate = Date.now() + 3600000
            user.save().then(result => {
                mailer(
                    req.body.email,
                    "Reset Password!",
                    "Hi ${user.name},",
                    `<p>Hi ${user.name},</p>
                    <p>You requested for reset password</p>
                     <h5>Click <a href="https://insta-clone-i.herokuapp.com/reset/${token}">here</a> to reset password</h5>
                     <p><i>Note: Link will expire after 60min</i></p>
                     `
                ).catch(console.error)
            })
            res.json({message:"Check your email"})
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newpassword = req.body.password
    const userToken = req.body.token
    if(!newpassword || !userToken){
        return res.json(400).json({error:"Bad request"})
    }
    User.findOne({resetToken:userToken, expireDate:{$gt: Date.now()}})
    .then(user => {
        if(!user){
            return res.status(422).json({error:"Session expired, try to reset password again"})
        }
        else{
            bcryptjs.hash(newpassword,12).then(hashpassword => {
                user.password = hashpassword
                user.resetToken = undefined
                user.expireDate = undefined
                user.save().then(savedUser => {
                    res.json({message:"Password updated successfully"})
                })
            })
        }
    }).catch(error => {
        console.log(error);
    })
})
module.exports = router