const mongoose = require('mongoose');

const DataEntrySchema = new mongoose.Schema(
  {
    constituency_number: {
      type: Number,
      required: [true, 'Constituency number is required'],
      index: true,
    },
    booth_number: {
      type: String,
      required: [true, 'Booth number is required'],
      trim: true,
      index: true,
    },
    candidate_name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    father_name: {
      type: String,
      required: [true, 'Father name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Age must be at least 18'],
      max: [120, 'Age must be realistic'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    remark: {
      type: String,
      default: '',
      trim: true,
    },
    gps_photo: {
      type: String,
      default: '',
    },
    gps_location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      timestamp: { type: String, default: '' },
    },
    created_by: {
      type: String,
      default: 'admin01@gmail.com',
    },
  },
  {
    timestamps: true,
    collection: 'dataentries',
  }
);

DataEntrySchema.index({ constituency_number: 1, booth_number: 1 });
DataEntrySchema.index({ candidate_name: 'text', father_name: 'text', address: 'text' });

const DataEntry = mongoose.model('DataEntry', DataEntrySchema);

module.exports = DataEntry;
