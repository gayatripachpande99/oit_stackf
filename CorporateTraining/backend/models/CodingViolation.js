const mongoose = require('mongoose');

const codingViolationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProblem',
      required: true,
    },
    type: {
      type: String,
      enum: ['copy_paste', 'tab_switch'],
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

codingViolationSchema.index({ user: 1, problem: 1 });

const CodingViolation = mongoose.model('CodingViolation', codingViolationSchema);

module.exports = CodingViolation;
