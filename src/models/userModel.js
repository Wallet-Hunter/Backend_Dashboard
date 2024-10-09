const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  telegramId: { type: String, required: true },
  phone_number: { type: String, required: true },
  userType: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);



