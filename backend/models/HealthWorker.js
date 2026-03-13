const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const healthWorkerSchema = new mongoose.Schema({
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
    default: 'healthworker',
  },
  status: {
    type: String,
    enum: ['pending_verification', 'approved', 'rejected'],
    default: 'pending_verification',
  },
  village: String,
  govtId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'healthworker' });

healthWorkerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

healthWorkerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const HealthWorker = mongoose.model('HealthWorker', healthWorkerSchema);
module.exports = HealthWorker;
