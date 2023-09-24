const mongoose = require('mongoose');
const {
  questionHandwriteSchema,
  questionMultipleChoiceSchema,
} = require('./question');

// halaman learn paling awal
const learnPageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  texts: [String],
});

// schema per page
const learnPageComposeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['learn', 'handwrite', 'multiple-choice'],
  },
  learn: learnPageSchema,
  handwrite: questionHandwriteSchema,
  multipleChoice: questionMultipleChoiceSchema,
});

const stockPatternSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    learnPages: [learnPageComposeSchema],
  },
  { timestamps: true }
);

const StockPattern = mongoose.model('StockPattern', stockPatternSchema);

module.exports = StockPattern;
