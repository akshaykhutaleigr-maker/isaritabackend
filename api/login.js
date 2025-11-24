const express = require('express');
const router = express.Router();
const { prisma, serializeBigInt } = require("../common");
router.post('/login', async (req, res) => {
const { username, password } = req.body;

    if (!username || !password) {
     return res.status(400).json({ error: 'username and password are required' });
    }
    try{
     const user = await prisma.citizenRegistration.findFirst({
      where: { user_name: username ,user_pass:password }
    });

    if(!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
   
    /*
     const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }*/

    return res.status(200).json({ message: 'Login successful', user: { username: user.user_name } });


    }catch (err) {
        console.error("Insert error:", err);
        res.status(500).json({ error: "Server error" });
      }
});
module.exports = router;