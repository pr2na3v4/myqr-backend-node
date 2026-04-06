const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

router.post('/collect', async (req, res) => {
  try {
    const { shopId, phone, name } = req.body;

    // Upsert logic: Update if exists, create if new
    const customer = await Customer.findOneAndUpdate(
      { shopId, phone },
      { 
        $set: { name }, 
        $inc: { totalVisits: 1 },
        lastVisited: new Date() 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Welcome to the club!", customer });
  } catch (error) {
    res.status(500).json({ error: "Could not save customer info" });
  }
});

module.exports = router;