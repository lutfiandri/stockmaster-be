const mongoose = require('mongoose');

// gambar pattern
const questionHandwriteSchema = new mongoose.Schema({
  imageUrl: String,
  title: {
    type: String,
    required: true,
  },
  trueClassIndex: {
    type: Number,
    required: true
  }
});

// pilihan ganda
const questionMultipleChoiceSchema = new mongoose.Schema({
  question: String,
  imageUrl: String,
  options: [String],
  trueOptionIndex: {
    type: Number,
    required: true,
  },
  optionType: {
    type: String,
    required: true,
    enum: ['short-text', 'long-text', 'image'],
  },
});

module.exports = {
  questionHandwriteSchema,
  questionMultipleChoiceSchema,
};
