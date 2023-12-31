const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

module.exports = {
    rootPath: path.resolve(__dirname),
    Url: process.env.MONGO_URL,
    secretKey: process.env.SECRET_KEY,
}