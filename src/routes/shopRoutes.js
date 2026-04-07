const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const slugify = require('slugify');

router.post('/register', async (req, res) => {
  try {
    const { 
      businessName, 
      upiId, 
      tagline, 
      theme, 
      instagram, // Coming from your frontend social-grid
      website    // Coming from your frontend social-grid
    } = req.body;

    // 1. Validation
    if (!businessName || !upiId) {
      return res.status(400).json({ error: "Business Name and UPI ID are required" });
    }

    // 2. Slug Generation
    const baseSlug = slugify(businessName, { lower: true, strict: true });
    const slug = `${baseSlug}-${Math.random().toString(36).substring(7)}`;

    // 3. Create Shop according to your Schema structure
    const newShop = new Shop({
      slug: slug,
      upiId: upiId,
      businessName: businessName,
      tagline: tagline,
      theme: {
        primaryColor: theme?.primaryColor || "#646cff",
        textColor: theme?.textColor || "#ffffff"
      },
      socials: {
        instagram: instagram || "",
        website: website || ""
      }
    });

    await newShop.save();
    
    console.log("✅ Shop created successfully:", slug);
    res.status(201).json({ slug: newShop.slug });

  } catch (err) {
    console.error("❌ Registration Crash:", err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: err.message 
    });
  }
});

// GET route for the Landing Page
router.get('/landing/:slug', async (req, res) => {
  try {
    const shop = await Shop.findOne({ slug: req.params.slug.toLowerCase() });
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching shop" });
  }
});

module.exports = router;