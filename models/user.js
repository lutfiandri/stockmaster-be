const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  created_at: Date,
  email_verified: Boolean,
  email: String,
  family_name: String,
  given_name: String,
  name: String,
  nickname: String,
  picture: String,
  updated_at: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
