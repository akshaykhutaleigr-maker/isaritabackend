// api/check.js
const express = require('express');
const router = express.Router();
const { prisma, serializeBigInt } = require("../common");

// Check username Exist
router.get('/CheckUsername', async (req, res) => {
  try {
    const { user_name } = req.query;
    if (!user_name) return res.status(400).json({ error: 'Username is required' });

    const usernameExists = await prisma.citizenRegistration.findFirst({
      where: { user_name }
    });

    if (usernameExists) return res.status(400).json({ error: 'Username already exists' });

    res.json({ message: 'Username is available' });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check mobile Exist
router.get('/CheckMobileNo', async (req, res) => {
  try {
    const { mobile_no } = req.query;
    if (!mobile_no) return res.status(400).json({ error: 'Mobile No is required' });

    const mobNoExists = await prisma.citizenRegistration.findFirst({
      where: { mobile_no: mobile_no.toString() }
    });

    if (mobNoExists) return res.status(400).json({ error: 'Mobile No already exists' });

    res.json({ message: 'Mobile is available' });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check email Exist
router.get('/CheckEmail', async (req, res) => {
  try {
    const { email_id } = req.query;
    if (!email_id) return res.status(400).json({ error: 'EmailID is required' });

    const EmailIDExists = await prisma.citizenRegistration.findFirst({
      where: { email_id: email_id.toString() }
    });

    if (EmailIDExists) return res.status(400).json({ error: 'EmailId already exists' });

    res.json({ message: 'EmailId is available' });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
