const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  gender: String,
  village: String,
  phone: String,
  bloodGroup: String,
  abha: {
    type: String,
    unique: true,
    sparse: true
  },
  emergencyContact: String,
  notes: String,
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthWorker'
  },
  vitalsHistory: [{
    temp: String,
    bpSys: String,
    bpDia: String,
    pulse: String,
    oxygen: String,
    weight: String,
    notes: String,
    symptoms: [String],
    symptomNotes: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'patients' });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
