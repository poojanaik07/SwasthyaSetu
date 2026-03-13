const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
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
    default: 'doctor',
  },
  status: {
    type: String,
    enum: ['pending_verification', 'approved', 'rejected'],
    default: 'pending_verification',
  },
  mcRegistration: String,
  specialization: String,
  hospitalName: String,
  experience: Number,
  clinicAddress: String,
  govtId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'doctor' }); // Explicitly set collection name

// Middleware to hash the password before saving
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
