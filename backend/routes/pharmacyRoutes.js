const express = require('express');
const router = express.Router();

router.get('/inventory', (req, res) => {
  res.json({ message: 'Pharmacy inventory route placeholder' });
});

module.exports = router;
