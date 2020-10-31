const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    profileImage:{
        type: String,
        default:"https://res.cloudinary.com/abdulrafay/image/upload/v1603043875/blank-profile-picture-973460_640_ifdjcz.png"
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    followings:[{
        type:ObjectId,
        ref:"User"
    }]
})

mongoose.model("User", userSchema)
