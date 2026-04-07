const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true }, 
  // Changed to optional so your current 'register' route doesn't crash
  ownerEmail: { type: String, default: 'pending@example.com' },
  upiId: { type: String, required: true },
  
  businessName: { type: String, default: "My Shop" },
  tagline: { type: String, default: "Quality you can trust" },
  logoUrl: String,

  theme: {
    primaryColor: { type: String, default: "#646cff" },
    textColor: { type: String, default: "#ffffff" },
    backgroundColor: { type: String, default: "#f8f9fa" }
  },

  socials: {
    instagram: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    website: { type: String, default: "" }
  },

  activeOffer: {
    text: { type: String, default: "" },
    isEnabled: { type: Boolean, default: false }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shop', ShopSchema);