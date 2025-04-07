const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  authMethod: { 
    type: String, 
    enum: ['email', 'google', 'github'], 
    default: 'email' 
  },

  // Profile (for your marketplace)
  profile: {
    username: { type: String, unique: true },
    bio: String,
    skills: [String], // For skill-based search
    avatar: String, // URL to profile image
    badges: [{ 
      type: String, 
      enum: ['verified', 'elite', 'moderator'] 
    }],
    layout: { type: String, default: 'default' } // Customizable profile layout
  },

  // Monetization (for your revenue split system)
  monetizationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'suspended'], 
    default: 'pending' 
  },
  kycVerified: { type: Boolean, default: false },
  balance: { type: Number, default: 0 }, // Earnings in USD

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// Password encryption before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords (for login)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
