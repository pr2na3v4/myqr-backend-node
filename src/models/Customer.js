const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  name: String,
  phone: { type: String, required: true },
  email: String,
  lastVisited: { type: Date, default: Date.now },
  totalVisits: { type: Number, default: 1 }
});

// Ensure a phone is unique per shop (a customer can visit many shops)
CustomerSchema.index({ shopId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('Customer', CustomerSchema);