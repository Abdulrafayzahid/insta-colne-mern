require('dotenv').config({path: __dirname + '/.env'})
module.exports={
    MONGO_URI: process.env['MONGO_URI'],
    JWT_TOKEN: process.env['JWT_TOKEN']
}