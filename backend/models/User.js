const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
}, { timestamps: true });

// MODERN ASYNC PRE-SAVE (No 'next' required)
// models/User.js

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  try {
    // We pass 10 directly here to avoid the "Illegal arguments" error
    this.password = await bcrypt.hash(this.password, 10);
  } catch (err) {
    throw err; 
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);