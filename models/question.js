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
    required: true,
  },
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

// gabungan
const questionSchema = new mongoose.Schema({
  pattern: {
    type: String,
    required: true,
    enum: [
      'double-top',
      'bearish-pennant',
      'bullish-rectangle',
      'falling-wedge',
      'inverse-head-and-shoulders',
      'bullish-pennant',
      'inverse-cup-and-handle',
      'double-bottom',
      'bullish-flag',
      'bearish-rectangle',
      'cup-and-handle',
      'rising-wedge',
      'head-and-shoulders',
      'bearish-flag',
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ['handwrite', 'multiple-choice'],
  },
  handwrite: questionHandwriteSchema,
  multipleChoice: questionMultipleChoiceSchema,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = {
  questionHandwriteSchema,
  questionMultipleChoiceSchema,
  questionSchema,
  Question,
};
