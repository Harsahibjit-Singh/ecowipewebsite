const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      // Password is required for manual sign-ups
      // but not for Google OAuth users.
      return this.authMethod === 'manual';
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple documents to have a null value
  },
  authMethod: {
    type: String,
    enum: ['manual', 'google'],
    required: true,
    default: 'manual'
  }
}, { timestamps: true });

// Pre-save middleware to hash the password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.password === null) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);