const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  banner: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
});

const Tank = mongoose.model('Course', courseSchema);

module.exports = Tank;
