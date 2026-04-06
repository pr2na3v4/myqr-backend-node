const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true }, 
  ownerEmail: { type: String, required: true },
  upiId: { type: String, required: true },
  
  // Branding Config
  businessName: { type: String, default: "My Shop" },
  tagline: { type: String, default: "Quality you can trust" },
  logoUrl: String,
  theme: {
    primaryColor: { type: String, default: "#646cff" },
    textColor: { type: String, default: "#ffffff" },
    backgroundColor: { type: String, default: "#f8f9fa" }
  },

  // Socials & Growth
  socials: {
    instagram: String,
    whatsapp: String,
    website: String
  },
  activeOffer: {
    text: String,
    isEnabled: { type: Boolean, default: false }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shop', ShopSchema);