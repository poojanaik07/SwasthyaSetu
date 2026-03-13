const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Doctor = require('../models/Doctor');
const HealthWorker = require('../models/HealthWorker');

// @desc    Get all pending verifications
router.get('/pending', async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending_verification' }).select('-password');
    const pendingDoctors = await Doctor.find({ status: 'pending_verification' }).select('-password');
    const pendingHW = await HealthWorker.find({ status: 'pending_verification' }).select('-password');
    
    res.json([...pendingUsers, ...pendingDoctors, ...pendingHW]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/approve/:id', async (req, res) => {
  try {
    let user = await User.findOneAndUpdate({ _id: req.params.id }, { status: 'approved' }, { new: true });
    if (!user) user = await Doctor.findOneAndUpdate({ _id: req.params.id }, { status: 'approved' }, { new: true });
    if (!user) user = await HealthWorker.findOneAndUpdate({ _id: req.params.id }, { status: 'approved' }, { new: true });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/reject/:id', async (req, res) => {
  try {
    let user = await User.findOneAndUpdate({ _id: req.params.id }, { status: 'rejected' }, { new: true });
    if (!user) user = await Doctor.findOneAndUpdate({ _id: req.params.id }, { status: 'rejected' }, { new: true });
    if (!user) user = await HealthWorker.findOneAndUpdate({ _id: req.params.id }, { status: 'rejected' }, { new: true });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
