const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  healthWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  symptoms: [
    {
      type: String,
    },
  ],
  duration: String, // e.g., "3 days"
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
  },
  notes: String,
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    spO2: Number,
    bloodGlucose: Number,
    recordedAt: Date,
  },
  status: {
    type: String,
    enum: ['pending_vitals', 'pending_doctor', 'in_progress', 'completed'],
    default: 'pending_vitals',
  },
  diagnosis: {
    condition: String,
    notes: String,
  },
  prescription: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
      },
      medicineName: String,
      dosage: String, // e.g., "1-0-1"
      duration: String, // e.g., "5 days"
      instructions: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;
