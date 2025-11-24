// api/location.js
const express = require('express');
const router = express.Router();
const { prisma, serializeBigInt } =  require("../common");

router.post('/getDistrict', async (req, res) => {
  try {
    const districts = await prisma.District.findMany({
      select: { district_id: true, district_name_en: true }
    });
    res.json(serializeBigInt(districts));
  } catch (err) {
    console.error('Error fetching districts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/getTalukaByID/:districtId', async (req, res) => {
  try {
    const districtId = Number(req.params.districtId);
    const talukas = await prisma.Taluka.findMany({
      where: { district_id: districtId },
      select: { taluka_id: true, taluka_name_en: true, district_id: true }
    });
    res.json(serializeBigInt(talukas));
  } catch (err) {
    console.error('Error fetching talukas:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/getVillageByID/:talukaId', async (req, res) => {
  try {
    const talukaId = Number(req.params.talukaId);
    const villages = await prisma.VillageMapping.findMany({
      where: { taluka_id: talukaId },
      select: { village_id: true, village_name_en: true, taluka_id: true }
    });
    res.json(serializeBigInt(villages));
  } catch (err) {
    console.error('Error fetching villages:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
