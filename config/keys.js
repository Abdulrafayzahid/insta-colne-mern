require('dotenv').config()
module.exports={
    MONGO_URI: process.env.MONGO_URI,
    JWT_TOKEN: process.env.JWT_TOKEN,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASSWORD: process.env.USER_PASSWORD,
}