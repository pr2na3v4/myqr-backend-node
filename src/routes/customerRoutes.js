const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Shop = require('../models/Shop');

// Single route to handle customer registration/check-in
router.post('/register', async (req, res) => {
    try {
        const { shopSlug, phone, name } = req.body;

        // 1. Find the shop first
        const shop = await Shop.findOne({ slug: shopSlug });
        if (!shop) {
            return res.status(404).json({ error: "Shop not found" });
        }

        // 2. SMART UPSERT: If phone + shopId exists, just update/increment
        // If it doesn't exist, create it. This prevents 500 duplicate errors.
        const customer = await Customer.findOneAndUpdate(
            { shopId: shop._id, phone: phone }, 
            { 
                $set: { name: name || "Valued Customer" }, 
                $inc: { totalVisits: 1 },
                $set: { lastVisited: new Date() }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({ 
            message: "Successfully joined loyalty club", 
            customer 
        });

    } catch (err) {
        console.error("DATABASE ERROR:", err); // This shows in your terminal
        res.status(500).json({ error: err.message || "Failed to save customer" });
    }
});

module.exports = router;