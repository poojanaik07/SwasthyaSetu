const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const HealthWorker = require('../models/HealthWorker');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { 
      mobile, password, role, fullName, pharmacyName, village, 
      age, gender, govtId, mcRegistration, specialization, 
      hospitalName, ownerName, drugLicense, address,
      certificateFile, licenseFile, govtIdFile, drugLicenseFile, ownerIdFile
    } = req.body;

    const UserModel = role === 'doctor' ? Doctor : (role === 'healthworker' ? HealthWorker : User);
    const userExists = await UserModel.findOne({ mobile });

    if (userExists) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    const name = pharmacyName || fullName || 'User';

    let user;
    if (role === 'doctor') {
      user = await Doctor.create({
        name, mobile, password, role,
        mcRegistration, specialization, hospitalName, govtId,
        status: 'pending_verification'
      });
    } else if (role === 'healthworker') {
      user = await HealthWorker.create({
        name, mobile, password, role,
        village, govtId,
        status: 'pending_verification'
      });
    } else {
      user = await User.create({
        name,
        mobile,
        password,
        role,
        village: village || address,
        age,
        gender,
        govtId,
        mcRegistration,
        specialization,
        hospitalName,
        ownerName,
        drugLicense,
        address,
        status: role === 'patient' ? 'approved' : 'pending_verification',
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Check both collections if necessary, or check by role potentially.
    // Since we don't always have role from frontend in login body, we check both.
    let user = await User.findOne({ mobile });
    if (!user) {
      user = await Doctor.findOne({ mobile });
    }
    if (!user) {
      user = await HealthWorker.findOne({ mobile });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
