const mongoose = require('mongoose');
const { Schema } = mongoose;

const CertificateSchema = new Schema({
  certificateID: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  // This is the new field to link to the User model
  user: {
    type: Schema.Types.ObjectId, // Defines the type as a MongoDB ObjectID
    ref: 'User', // References the 'User' model
    required: true,
  },
  wipingHostOS: {
    type: String,
    required: true,
  },
  wipingHostName: {
    type: String,
    required: true,
  },
  targetDeviceSerial: {
    type: String,
    required: true,
  },
  wipeMethod: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);