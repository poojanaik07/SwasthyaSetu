const express = require('express');
const router = express.Router();

router.get('/consultations', (req, res) => {
  res.json({ message: 'Doctor consultations route placeholder' });
});

module.exports = router;
