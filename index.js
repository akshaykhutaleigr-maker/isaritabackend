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
    const newUser = await prisma.citizenRegistration.create({
      data: {
       
        contact_fname: req.body.contact_fname,
        contact_lname: req.body.contact_lname,
        email_id: req.body.email_id,
        user_name: req.body.user_name,
        user_pass: req.body.user_pass
      }
    });

  res.json(serializeBigInt(newUser));

  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).send("Server error");
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