const mongoose = require('mongoose');

// gambar pattern
const questionHandwriteSchema = new mongoose.Schema(
  {
    imageUrl: String,
    title: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// pilihan ganda
const questionMultipleChoiceSchema = new mongoose.Schema(
  {
    question: String,
    imageUrl: String,
    options: [
      {
        id: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    trueOptionId: {
      type: String,
      required: true,
    },
    optionType: {
      type: String,
      required: true,
      enum: ['short-text', 'long-text', 'image'],
    },
  },
  { _id: false }
);

// gabungan
const questionSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = {
  questionHandwriteSchema,
  questionMultipleChoiceSchema,
  questionSchema,
  Question,
};
