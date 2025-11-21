const express = require('express');
const router = express.Router();
const { prisma, serializeBigInt } = require("../common");

router.post('/register', async (req, res) => {
  try {
    const { email_id, user_name, password, mobile_no } = req.body;

    // Validate required fields
    if (!email_id || !user_name || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Check if email exists
    const emailExists = await prisma.citizenRegistration.findFirst({
      where: { email_id }
    });
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check if username exists
    const usernameExists = await prisma.citizenRegistration.findFirst({
      where: { user_name }
    });
    if (usernameExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create new user
    const newUser = await prisma.citizenRegistration.create({
      data: { email_id, user_name, password, mobile_no }
    });

    res.json(serializeBigInt(newUser));

  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
