const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = mongoose.model("User")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_TOKEN} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected', requireLogin, (req,res)=>{
    res.send("hello")
})

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
        require: true
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

module.exports = router