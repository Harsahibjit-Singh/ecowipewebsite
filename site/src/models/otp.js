const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // The document will be automatically deleted after 300 seconds (5 minutes)
  }
});

module.exports = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);