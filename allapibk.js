const express = require('express');
const pool = require('./db/config.js'); 
require('dotenv').config();
const bcrypt = require('bcrypt');
const app = express();
const prisma = require("./prismaClient");

app.use(express.json()); 

const port = 3000;
app.use(require("cors")({
   origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

app.use(express.urlencoded({ extended: true }));

function serializeBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}
app.post('/register', async (req, res) => {
  try {

    const emailExists = await prisma.citizenRegistration.findFirst({
      where: { email_id: req.body.email_id }
    });
     if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const usernameExists = await prisma.citizenRegistration.findFirst({
      where: {user_name: req.body.user_name }
    });

    if (usernameExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = await prisma.citizenRegistration.create({
    
     data: req.body
 
    });

  res.json(serializeBigInt(newUser));

  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).send("Server error");
  }
});

app.get('/CheckUsername', async (req, res) => {
  try {
    const { user_name } = req.query; 

    if (!user_name) {
      return res.status(400).json({ error: 'Username is required' });
    }

     const usernameExists = await prisma.citizenRegistration.findFirst({
      where: {user_name: req.body.user_name }
    });

   if(usernameExists) {
      return res.status(400).json({ error: "Username already exists" });
    }
    res.json({ message: 'Username is available' });

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/CheckMobileNo', async (req, res) => {
  try {
    const { mobile_no } = req.query; 

    if (!mobile_no) {
      return res.status(400).json({ error: 'Mobile No is required' });
    }

     const mobNoExists = await prisma.citizenRegistration.findFirst({
      where: {mobile_no:mobile_no.toString() }
    });

   if(mobNoExists) {
      return res.status(400).json({ error: "Mobile No already exists" });
    }
    res.json({ message: 'Mobile is available' });

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/CheckEmail', async (req, res) => {
  try {
    const { email_id } = req.query; 

    if (!email_id) {
      return res.status(400).json({ error: 'EmailID No is required' });
    }

     const EmailIDExists = await prisma.citizenRegistration.findFirst({
      where: {email_id:email_id.toString() }
    });

   if(EmailIDExists) {
      return res.status(400).json({ error: "EmailId  already exists" });
    }
    res.json({ message: 'EmailId  is available' });

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/getDistrict', async (req, res) => {
  try {
   const districts = await prisma.District.findMany({
      select: {
        district_id: true,
        district_name_en: true
      }
    });
     res.json(serializeBigInt(districts));

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/getTalukaByID/:districtId',async (req,res)=>{
try {
   const districtId =  Number(req.params.districtId);
     const talukas = await prisma.Taluka.findMany({
    
     where:{
      district_id:districtId
     },
      select: {
        taluka_id: true,
        taluka_name_en: true,
        district_id:true
      }
    });
      res.json(serializeBigInt(talukas));
} catch (error) {
   console.error('Error fetching talukas:', error);
    res.status(500).json({ error: 'Server error' });
}
});

app.get('/getVillageByID/:talukaId',async (req,res)=>{
try {
   const talukaId =  Number(req.params.talukaId);
     const villages = await prisma.VillageMapping.findMany({
     where:{
      taluka_id:talukaId
     },
      select: {
        village_id: true,
        village_name_en: true,
        taluka_id:true
      }
    });
      res.json(serializeBigInt(villages));
} catch (error) {
   console.error('Error fetching villages:', error);
    res.status(500).json({ error: 'Server error' });
}
});

app.get('/Getusers', async (req, res) => {
  try {
    const users = await prisma.citizenRegistration.findMany();
     res.json(serializeBigInt(users));

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});