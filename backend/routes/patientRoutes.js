const express = require('express');
const router = express.Router();
// const { protect } = require('../middlewares/authMiddleware');

// @desc    Get patient profile
// @route   GET /api/patient/profile
// @access  Private/Patient
router.get('/profile', (req, res) => {
  res.json({ message: 'Patient profile route placeholder' });
});

module.exports = router;
