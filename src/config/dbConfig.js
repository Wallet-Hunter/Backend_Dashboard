const mongoose = require('mongoose');
const dotenv = require('dotenv');

module.exports.init = async () => {
    await mongoose.connect(dotenv.config().parsed.MONGO_URI);
    };