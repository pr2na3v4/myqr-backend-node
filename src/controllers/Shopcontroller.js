const Shop = require('../models/Shop');

exports.getPublicLandingData = async (req, res) => {
  // If the shop wasn't found in middleware, req.shop will be undefined
  if (!req.shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  // Send the pre-fetched shop data
  res.json({
    businessName: req.shop.businessName,
    tagline: req.shop.tagline,
    upiId: req.shop.upiId,
    logoUrl: req.shop.logoUrl,
    theme: req.shop.theme,
    socials: req.shop.socials,
    activeOffer: req.shop.activeOffer
  });
};  