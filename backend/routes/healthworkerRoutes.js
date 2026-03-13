const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/healthworker/patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Register a new patient
// @route   POST /api/healthworker/register-patient
router.post('/register-patient', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Record vitals for a patient
// @route   POST /api/healthworker/vitals/:id
router.post('/vitals/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    patient.vitalsHistory.unshift(req.body);
    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
