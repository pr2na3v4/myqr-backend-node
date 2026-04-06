const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shop', 
    required: true 
  },
  device: {
    browser: String,
    os: String,
    isMobile: Boolean
  },
  referrer: String, // Where did they come from?
  timestamp: { type: Date, default: Date.now },
  // For V2: we'll update this if they click "Pay Now"
  converted: { type: Boolean, default: false } 
});

module.exports = mongoose.model('Scan', ScanSchema);