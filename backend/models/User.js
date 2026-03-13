const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'healthworker', 'doctor', 'pharmacy', 'admin'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending_verification', 'approved', 'rejected'],
    default: 'pending_verification',
  },
  village: {
    type: String,
  },
  gender: String,
  age: Number,
  // Patient specific
  healthProfile: {
    age: Number,
    bloodGroup: String,
    allergies: [String],
    chronicDiseases: [String],
  },
  // Doctor/HealthWorker specific
  govtId: String,
  mcRegistration: String,
  specialization: String,
  experience: Number,
  hospitalName: String,
  clinicAddress: String,
  // Pharmacy specific
  pharmacyName: String,
  ownerName: String,
  drugLicense: String,
  address: String,
  licenseUrl: String,
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
