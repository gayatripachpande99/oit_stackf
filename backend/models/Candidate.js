const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  constituency_number: { type: Number, required: true },
  candidate_name: { type: String, required: true },
  sex: { type: String },
  age: { type: Number },
  category: { type: String },
  party: { type: String },
  symbol: { type: String },
  general: { type: Number, default: 0 },
  postal: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  votes_percentage: { type: Number },
  year: { type: Number, required: true }
}, {
  timestamps: true
});

// Create models for each year or a single model if they are merged
// To be safe, we can use a function to get the model for a specific collection if needed,
// but for now let's assume a single collection 'candidates' or yearly ones.
// I'll export a function to get the model dynamically if they are in different collections.

module.exports = mongoose.model('Candidate', CandidateSchema);
