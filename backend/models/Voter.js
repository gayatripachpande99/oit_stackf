const mongoose = require('mongoose');

// We use strict: false so that it will flexibly accept whatever fields are in the existing MongoDB Atlas collection.
const voterSchema = new mongoose.Schema({
    // We let MongoDB handle the flexible schema
}, { strict: false, collection: 'voters' });

voterSchema.index({ boothNumber: 1 });
voterSchema.index({ segment: 1 });
voterSchema.index({ ward: 1 });
voterSchema.index({ area: 1 });

// Connects to the 'voters' collection on the primary oit_stack database
module.exports = mongoose.models.Voter || mongoose.model('Voter', voterSchema);

